import {
  Heart,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume1,
  VolumeX,
  ExternalLink,
} from "lucide-react";
import { formatTime } from "@/data/music";
import { usePlayer } from "@/lib/player";
import { AudioVisualizer, PulseGlow } from "./AudioVisualizer";
import { PLAYLIST_COVER } from "@/lib/spotify";

export function NowPlaying({
  tagline,
  collegeName,
  onOpenSpotify,
}: {
  tagline: string;
  collegeName: string;
  onOpenSpotify?: () => void;
}) {
  const {
    current,
    isPlaying,
    progress,
    duration,
    volume,
    muted,
    shuffle,
    repeat,
    favourites,
    queueName,
    toggle,
    next,
    prev,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
    toggleFavourite,
    spotify,
  } = usePlayer();

  const total = duration || current?.duration || 0;
  const pct = total ? Math.min(100, (progress / total) * 100) : 0;

  const hasStarted = !!current;
  const cover = current?.cover ?? PLAYLIST_COVER;

  const showTapSpotifyHint = spotify.autoplayBlocked || spotify.needsInteraction;

  return (
    <div className="flex w-full max-w-xl flex-col items-center text-center">
      <p className="text-[10px] font-medium uppercase tracking-[0.42em] text-accent-soft sm:text-xs">
        {collegeName}
      </p>
      <p className="mt-3 max-w-sm font-display text-xl leading-snug text-foreground/90 sm:mt-4 sm:max-w-md sm:text-[28px]">
        {tagline}
      </p>

      {/* artwork + visualizer, blended into the background */}
      <div className="relative mt-8 size-44 sm:mt-10 sm:size-56">
        <PulseGlow active={isPlaying} />
        <div
          className={`absolute inset-0 overflow-hidden rounded-[28px] shadow-deep transition-transform duration-700 ${
            isPlaying ? "scale-100" : "scale-[0.96]"
          }`}
          style={{
            background: cover,
            backgroundColor: "#1a0f0a",
          }}
        >
          <div className="absolute inset-0 rounded-[28px] ring-1 ring-inset ring-foreground/15" />
          <div className="absolute inset-0 rounded-[28px] bg-gradient-to-b from-transparent via-transparent to-black/35" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden rounded-b-[28px]">
            <AudioVisualizer active={isPlaying} loading={!spotify.ready && !spotify.error} />
          </div>
        </div>
      </div>

      <div className="mt-7 flex items-center gap-3">
        <h1 className="font-display text-3xl leading-tight tracking-tight sm:text-[40px]">
          {hasStarted ? current?.title : spotify.ready ? "Press play" : "Loading Spotify…"}
        </h1>
        {current && (
          <button
            onClick={() => toggleFavourite(current.id)}
            aria-label="Favourite this song"
            className="mt-1 text-muted-foreground transition-colors hover:text-accent-soft"
          >
            <Heart
              className={`size-5 ${
                favourites.includes(current.id) ? "fill-current text-accent-soft" : ""
              }`}
            />
          </button>
        )}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        {current ? current.artist : "Delhi University, on shuffle"}
        <span className="mx-2 opacity-40">•</span>
        <span className="text-foreground/70">{queueName}</span>
      </p>

      {showTapSpotifyHint && hasStarted === false && !spotify.error && (
        <button
          onClick={onOpenSpotify}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-xs text-accent-soft transition-transform hover:scale-[1.02]"
        >
          <ExternalLink className="size-3.5" />
          Tap play in the Spotify player to start listening
        </button>
      )}

      {spotify.error && (
        <button
          onClick={onOpenSpotify}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-destructive/40 bg-destructive/10 px-4 py-2 text-xs text-destructive-foreground/90 transition-transform hover:scale-[1.02]"
        >
          Spotify unavailable — click to retry
        </button>
      )}

      {/* progress */}
      <div className="mt-7 w-full max-w-md px-2">
        <div className="group relative h-6">
          <input
            type="range"
            min={0}
            max={total || 1}
            step={1}
            value={progress}
            onChange={(e) => seek(Number(e.target.value))}
            aria-label="Seek"
            className="absolute inset-0 z-10 h-6 w-full cursor-pointer opacity-0"
          />
          <div className="absolute left-0 right-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-foreground/20">
            <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
          </div>
          <div
            className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent opacity-0 shadow-glow transition-opacity group-hover:opacity-100"
            style={{ left: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] tabular-nums text-muted-foreground">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(total)}</span>
        </div>
      </div>

      {/* controls */}
      <div className="mt-5 flex items-center gap-4 sm:gap-6">
        <button
          onClick={toggleShuffle}
          aria-label="Shuffle"
          className={`p-2 transition-colors ${
            shuffle ? "text-accent-soft" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Shuffle className="size-4" />
        </button>
        <button
          onClick={prev}
          aria-label="Previous"
          className="p-2 text-foreground/80 transition-transform hover:scale-110 hover:text-foreground"
        >
          <SkipBack className="size-6" />
        </button>
        <button
          onClick={toggle}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="grid size-16 place-items-center rounded-full bg-foreground text-background shadow-deep transition-transform hover:scale-105 active:scale-95"
        >
          {isPlaying ? (
            <Pause className="size-6 fill-current" />
          ) : (
            <Play className="size-6 translate-x-[1px] fill-current" />
          )}
        </button>
        <button
          onClick={next}
          aria-label="Next"
          className="p-2 text-foreground/80 transition-transform hover:scale-110 hover:text-foreground"
        >
          <SkipForward className="size-6" />
        </button>
        <button
          onClick={cycleRepeat}
          aria-label="Repeat"
          className={`p-2 transition-colors ${
            repeat !== "off" ? "text-accent-soft" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {repeat === "one" ? <Repeat1 className="size-4" /> : <Repeat className="size-4" />}
        </button>
      </div>

      {/* volume */}
      <div className="mt-5 flex w-40 items-center gap-3">
        <button
          onClick={toggleMute}
          aria-label="Mute"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          {muted || volume === 0 ? <VolumeX className="size-4" /> : <Volume1 className="size-4" />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={muted ? 0 : volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          aria-label="Volume"
          className="range-slim flex-1"
        />
      </div>
    </div>
  );
}
