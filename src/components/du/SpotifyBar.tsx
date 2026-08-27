import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, Pause, Play } from "lucide-react";
import { SpotifyEmbed, type SpotifyEmbedHandle } from "./SpotifyEmbed";
import { usePlayer } from "@/lib/player";
import { formatTime } from "@/data/music";

/**
 * Truck-reference style player bar.
 *
 * The Spotify iframe stays mounted at all times (audio dies if it unmounts) but
 * is visually collapsed behind the bar. If the browser blocks programmatic
 * playback, the real embed is revealed so the user can tap Spotify's own play
 * button once.
 */
export function SpotifyBar() {
  const embedRef = useRef<SpotifyEmbedHandle | null>(null);
  const { spotify, current, isPlaying, progress, duration, toggle, next, prev } = usePlayer();
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (embedRef.current && spotify.reloadRequestCount > 0) {
      embedRef.current.reload();
    }
  }, [spotify.reloadRequestCount]);

  // Auto-reveal the native embed when the browser refuses programmatic playback.
  useEffect(() => {
    if (spotify.autoplayBlocked) setRevealed(true);
  }, [spotify.autoplayBlocked]);

  const pct = duration > 0 ? Math.min(100, (progress / duration) * 100) : 0;

  return (
    <div className="w-full px-2 pb-2 sm:px-4">
      {/* Persistent Spotify embed — collapsed by default, revealed on demand. */}
      <div
        className={`mx-auto w-full max-w-3xl overflow-hidden transition-all duration-500 ${
          revealed ? "mb-2 max-h-[380px] opacity-100" : "max-h-0 opacity-0"
        }`}
        aria-hidden={!revealed}
        style={{ pointerEvents: revealed ? "auto" : "none" }}
      >
        <SpotifyEmbed
          ref={embedRef}
          onReady={(ctrl) => spotify.registerController(ctrl)}
          onPlaybackStarted={(t) => spotify.emitPlaybackStarted(t)}
          onPlaybackPaused={(t) => spotify.emitPlaybackPaused(t)}
          onPlaybackUpdate={(u) => spotify.emitPlaybackUpdate(u)}
          onError={(m) => spotify.emitError(m)}
        />
      </div>

      <div className="mx-auto flex w-full max-w-3xl items-center gap-3 rounded-full glass px-3 py-2 sm:gap-4 sm:px-5 sm:py-3">
        <button
          onClick={() => setRevealed((r) => !r)}
          className="size-12 shrink-0 overflow-hidden rounded-full border border-hairline shadow-deep sm:size-14"
          style={{ background: current?.cover ?? "linear-gradient(135deg,#f2994a,#7a2416)" }}
          aria-label={revealed ? "Hide Spotify playlist" : "Show Spotify playlist"}
        />

        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-base leading-tight sm:text-lg">
            {current?.title ?? (spotify.ready ? "Sufi & Bollywood — DU Mix" : "Connecting to Spotify…")}
          </p>
          <p className="truncate text-[11px] text-muted-foreground sm:text-xs">
            {spotify.error ?? current?.artist ?? "Spotify"}
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="w-9 text-[10px] tabular-nums text-muted-foreground">
              {formatTime(progress)}
            </span>
            <span className="relative h-1 flex-1 overflow-hidden rounded-full bg-foreground/15">
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-accent transition-[width] duration-500"
                style={{ width: `${pct}%` }}
              />
            </span>
            <span className="w-9 text-right text-[10px] tabular-nums text-muted-foreground">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => void prev()}
            aria-label="Previous track"
            className="grid size-9 place-items-center rounded-full border border-hairline text-foreground/80 transition-colors hover:text-foreground"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={() => void toggle()}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="grid size-11 place-items-center rounded-full bg-accent text-accent-foreground shadow-glow transition-transform hover:scale-105 sm:size-12"
          >
            {!spotify.ready ? (
              <Loader2 className="size-5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="size-5" />
            ) : (
              <Play className="size-5" />
            )}
          </button>
          <button
            onClick={() => void next()}
            aria-label="Next track"
            className="grid size-9 place-items-center rounded-full border border-hairline text-foreground/80 transition-colors hover:text-foreground"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {spotify.autoplayBlocked && !isPlaying && (
        <p className="mx-auto mt-1.5 max-w-3xl px-4 text-center text-[11px] text-muted-foreground">
          Your browser blocked autoplay — tap play inside the Spotify window above once, then these
          controls take over.
        </p>
      )}
    </div>
  );
}
