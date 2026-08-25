import { useEffect, useRef } from "react";
import { AlertCircle, Loader2, RefreshCcw, Music2 } from "lucide-react";
import { SpotifyEmbed, type SpotifyEmbedHandle } from "./SpotifyEmbed";
import { usePlayer } from "@/lib/player";
import { SPOTIFY_PLAYLIST_ID } from "@/lib/spotify";

export function SpotifyPlayerPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const embedRef = useRef<SpotifyEmbedHandle | null>(null);
  const { spotify, isPlaying } = usePlayer();

  useEffect(() => {
    if (embedRef.current && spotify.reloadRequestCount > 0) {
      embedRef.current.reload();
    }
  }, [spotify.reloadRequestCount]);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 transition-all duration-500 ease-out ${
        open ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!open}
      style={{ pointerEvents: open ? "auto" : "none" }}
    >
      <div className="mx-auto flex min-h-[60vh] w-full max-w-4xl flex-col rounded-t-[28px] glass animate-sheet-up">
        <div className="flex items-center justify-between gap-3 border-b border-hairline px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="relative grid size-10 shrink-0 place-items-center rounded-2xl bg-foreground/10">
              <Music2 className="size-4 text-accent-soft" />
              {isPlaying && (
                <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-accent shadow-glow" />
              )}
            </span>
            <div className="min-w-0">
              <p className="font-display text-lg leading-tight sm:text-xl">Spotify Player</p>
              <p className="truncate text-[11px] text-muted-foreground">
                {spotify.error
                  ? spotify.error
                  : spotify.autoplayBlocked
                  ? "Tap play on Spotify to start listening"
                  : spotify.ready
                  ? isPlaying
                    ? "Live playback from the DU Trending playlist"
                    : "Connected — press play on either player"
                  : "Connecting to Spotify…"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {spotify.error && (
              <button
                onClick={() => spotify.requestReload()}
                className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Reload Spotify player"
              >
                <RefreshCcw className="size-3.5" /> Reload
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-full px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Close Spotify player"
            >
              Close
            </button>
          </div>
        </div>

        <div className="relative flex-1 overflow-y-auto px-3 py-3 sm:px-5 sm:py-5">
          {spotify.error ? (
            <div className="grid min-h-[280px] place-items-center rounded-[20px] border border-dashed border-foreground/20 p-6 text-center">
              <div className="space-y-3">
                <AlertCircle className="mx-auto size-8 text-accent-soft" />
                <p className="font-display text-lg">{spotify.error}</p>
                <button
                  onClick={() => spotify.requestReload()}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-transform hover:scale-105"
                >
                  <RefreshCcw className="size-4" /> Reload Spotify
                </button>
              </div>
            </div>
          ) : !spotify.ready ? (
            <div className="grid min-h-[280px] place-items-center rounded-[20px] border border-dashed border-foreground/20 p-6 text-center">
              <div className="space-y-3">
                <Loader2 className="mx-auto size-7 animate-spin text-accent-soft" />
                <p className="text-sm text-muted-foreground">Loading Spotify playlist…</p>
                <p className="text-[11px] text-muted-foreground/70">
                  Playlist ID: {SPOTIFY_PLAYLIST_ID}
                </p>
              </div>
            </div>
          ) : (
            <SpotifyEmbed
              ref={embedRef}
              onReady={(ctrl) => spotify.registerController(ctrl)}
              onPlaybackStarted={(t) => spotify.emitPlaybackStarted(t)}
              onPlaybackPaused={(t) => spotify.emitPlaybackPaused(t)}
              onPlaybackUpdate={(u) => spotify.emitPlaybackUpdate(u)}
              onError={(m) => spotify.emitError(m)}
            />
          )}

          {spotify.autoplayBlocked && spotify.ready && !isPlaying && (
            <div className="mt-3 rounded-2xl border border-accent/25 bg-accent/10 px-4 py-3 text-xs text-foreground/90 sm:text-sm">
              <p className="font-medium text-accent-soft">Browser blocked autoplay</p>
              <p className="mt-1 text-muted-foreground">
                Click the <span className="font-semibold text-foreground">play button</span> inside
                the Spotify window above to start listening. Your browser requires a direct click
                on the player before audio can begin.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
