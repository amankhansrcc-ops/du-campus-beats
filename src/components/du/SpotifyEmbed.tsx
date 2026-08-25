import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import {
  SPOTIFY_PLAYLIST_URL,
  loadSpotifyScript,
  type SpotifyController,
  type Track,
} from "@/lib/spotify";

export type SpotifyEmbedHandle = {
  getController: () => SpotifyController | null;
  isReady: () => boolean;
  reload: () => void;
};

export type SpotifyEmbedEvents = {
  onReady?: (controller: SpotifyController) => void;
  onPlaybackStarted?: (track?: Track) => void;
  onPlaybackPaused?: (track?: Track) => void;
  onPlaybackUpdate?: (payload: {
    track?: Track;
    isPaused: boolean;
    positionMs: number;
    durationMs: number;
    shuffle?: boolean;
    repeatMode?: 0 | 1 | 2;
  }) => void;
  onError?: (message: string) => void;
  onAutoplayBlocked?: () => void;
  onLoad?: () => void;
};

const IFRAME_ID = "du-spotify-embed-player";

const DEBUG = true;
const log = (...args: unknown[]) => {
  if (DEBUG) console.log("[SpotifyEmbed]", ...args);
};
const err = (...args: unknown[]) => {
  if (DEBUG) console.error("[SpotifyEmbed]", ...args);
};

export const SpotifyEmbed = forwardRef<SpotifyEmbedHandle, SpotifyEmbedEvents>(
  function SpotifyEmbed(props, ref) {
    const { onReady, onPlaybackStarted, onPlaybackPaused, onPlaybackUpdate, onError, onAutoplayBlocked, onLoad } = props;
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const controllerRef = useRef<SpotifyController | null>(null);
    const pollRef = useRef<number | null>(null);
    const readyRef = useRef(false);
    const startedRef = useRef(false);
    const [reloadKey, setReloadKey] = useState(0);

    useImperativeHandle(ref, () => ({
      getController: () => controllerRef.current,
      isReady: () => readyRef.current,
      reload: () => setReloadKey((k) => k + 1),
    }));

    useEffect(() => {
      let cancelled = false;
      startedRef.current = false;

      const start = async () => {
        if (startedRef.current || cancelled) return;
        startedRef.current = true;
        log("start() — loading Spotify iFrame API script…");

        await loadSpotifyScript();
        if (cancelled) return;

        if (!window.SpotifyIFrameAPI) {
          const msg = "Spotify iFrame API script did not attach window.SpotifyIFrameAPI";
          err(msg);
          onError?.(msg);
          return;
        }
        log("Spotify iFrame API loaded ✓", typeof window.SpotifyIFrameAPI.createController);

        const iframe = document.getElementById(IFRAME_ID) as HTMLIFrameElement | null;
        if (!iframe) {
          const msg = `iframe with id="${IFRAME_ID}" not found in DOM after load`;
          err(msg, { present: !!document.getElementById(IFRAME_ID) });
          onError?.(msg);
          return;
        }
        log(`iframe located in DOM: id=${iframe.id}, src=${iframe.src.substring(0, 60)}…`);

        try {
          log("Calling SpotifyIFrameAPI.createController…");
          const controller = await window.SpotifyIFrameAPI.createController(IFRAME_ID);
          if (cancelled) {
            try { controller.destroy(); } catch { /* ignore */ }
            return;
          }
          controllerRef.current = controller;
          readyRef.current = true;
          log("Spotify EmbedController ready ✓");
          onReady?.(controller);
          startPolling(controller);
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : String(e);
          err("createController FAILED:", msg, e);
          onError?.(`Spotify EmbedController failed to initialize: ${msg}`);
        }
      };

      const startPolling = (controller: SpotifyController) => {
        if (pollRef.current) window.clearInterval(pollRef.current);
        let lastPaused: boolean | null = null;

        const tick = async () => {
          try {
            const info = await controller.getInfo();
            const md = info.metadata;
            const track = md?.current_track;
            const playback = md?.playback;
            const features = md?.playback_features;
            const isPaused = playback?.isPaused ?? true;
            const positionMs = Math.max(0, (playback?.playbackPosition ?? 0) * 1000);
            const durationMs = Math.max(0, (playback?.duration ?? 0) * 1000);
            const shuffle = features?.shuffling;
            const repeatMode = features?.repeating_mode;

            onPlaybackUpdate?.({
              track,
              isPaused,
              positionMs,
              durationMs,
              shuffle,
              repeatMode,
            });

            if (lastPaused !== null && isPaused !== lastPaused) {
              if (isPaused) {
                log("▶ playback PAUSED", track?.name);
                onPlaybackPaused?.(track);
              } else {
                log("▶ playback STARTED", track?.name, "by", track?.artists?.map(a => a.name).join(", "));
                onPlaybackStarted?.(track);
              }
            }
            lastPaused = isPaused;
          } catch (e: unknown) {
            err("poll tick error:", e instanceof Error ? e.message : String(e));
          }
        };

        void tick();
        pollRef.current = window.setInterval(tick, 1200);
        log("polling started (every 1.2s)");
      };

      const iframe = iframeRef.current;
      if (!iframe) {
        err("iframe ref is empty — cannot attach onload");
        // Retry once on next tick, in case React ref hasn't been assigned yet
        const t = window.setTimeout(() => {
          if (!cancelled) void start();
        }, 250);
        return () => window.clearTimeout(t);
      }

      const handleIframeLoad = () => {
        log("Spotify iframe loaded (onload fired)");
        onLoad?.();
        void start();
      };

      // Attach listener synchronously (before the next paint — iframe may still be loading).
      iframe.addEventListener("load", handleIframeLoad);

      // Race-condition safety: if the iframe has already been in the DOM for a
      // while, `load` may have already fired. In that case kick off start()
      // immediately after a short delay to let the iframe internal script init.
      const isProbablyLoaded =
        (iframe as any).contentWindow &&
        (iframe as any).contentDocument?.readyState === "complete";

      if (isProbablyLoaded) {
        log("iframe already appears loaded — scheduling start() immediately");
        const t = window.setTimeout(() => {
          if (!cancelled) void start();
        }, 300);
        return () => {
          cancelled = true;
          window.clearTimeout(t);
          iframe.removeEventListener("load", handleIframeLoad);
          if (pollRef.current) window.clearInterval(pollRef.current);
          pollRef.current = null;
          try { controllerRef.current?.destroy(); } catch { /* ignore */ }
          controllerRef.current = null;
          readyRef.current = false;
          startedRef.current = false;
        };
      }

      // Backup: guarantee start() is attempted at least once even if load event
      // never fires for some reason (CSP, sandboxing).
      const fallbackTimer = window.setTimeout(() => {
        if (!startedRef.current && !cancelled) {
          log("iframe load event not received — fallback start() attempt");
          void start();
        }
      }, 6000);

      return () => {
        cancelled = true;
        window.clearTimeout(fallbackTimer);
        iframe.removeEventListener("load", handleIframeLoad);
        if (pollRef.current) window.clearInterval(pollRef.current);
        pollRef.current = null;
        try { controllerRef.current?.destroy(); } catch { /* ignore */ }
        controllerRef.current = null;
        readyRef.current = false;
        startedRef.current = false;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadKey]);

    return (
      <div className="w-full overflow-hidden rounded-[20px] border border-hairline bg-card/60 p-2 sm:p-3">
        <iframe
          ref={iframeRef}
          id={IFRAME_ID}
          key={reloadKey}
          data-testid="embed-iframe"
          title="Spotify Player"
          src={SPOTIFY_PLAYLIST_URL}
          width="100%"
          height="352"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="eager"
          referrerPolicy="no-referrer-when-downgrade"
          className="block w-full rounded-[16px] max-w-full"
          style={{ minHeight: 352 }}
          onError={() => {
            err("iframe onError fired");
            onError?.("Spotify embed failed to load.");
          }}
        />
      </div>
    );
  },
);
