import { Heart, Pause, Play } from "lucide-react";
import { formatTime, type Song } from "@/data/music";
import { usePlayer } from "@/lib/player";

export function SongList({ songs, queueName }: { songs: Song[]; queueName: string }) {
  const { current, isPlaying, playSong, toggle, favourites, toggleFavourite } = usePlayer();

  if (!songs.length) {
    return <p className="py-8 text-center text-sm text-muted-foreground">Nothing here yet.</p>;
  }

  return (
    <ol className="space-y-1">
      {songs.map((song, i) => {
        const active = current?.id === song.id;
        const playingThis = active && isPlaying;
        return (
          <li key={song.id}>
            <div
              className={`group flex items-center gap-3 rounded-2xl px-2 py-2 transition-colors sm:gap-4 sm:px-3 ${
                active ? "bg-foreground/10" : "hover:bg-foreground/[0.07]"
              }`}
            >
              <span className="w-5 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                {i + 1}
              </span>
              <button
                onClick={() => (active ? toggle() : playSong(song, songs, queueName))}
                className="relative size-11 shrink-0 overflow-hidden rounded-xl sm:size-12"
                style={{ background: song.cover }}
                aria-label={playingThis ? `Pause ${song.title}` : `Play ${song.title}`}
              >
                <span className="absolute inset-0 grid place-items-center bg-background/45 opacity-0 transition-opacity group-hover:opacity-100 data-[on=true]:opacity-100" data-on={active}>
                  {playingThis ? <Pause className="size-4" /> : <Play className="size-4" />}
                </span>
              </button>
              <button
                onClick={() => playSong(song, songs, queueName)}
                className="min-w-0 flex-1 text-left"
              >
                <p className={`truncate text-sm font-medium ${active ? "text-accent-soft" : ""}`}>
                  {song.title}
                </p>
                <p className="truncate text-xs text-muted-foreground">{song.artist}</p>
              </button>
              <span className="hidden text-xs tabular-nums text-muted-foreground sm:block">
                {formatTime(song.duration)}
              </span>
              <button
                onClick={() => toggleFavourite(song.id)}
                aria-label="Add to favourites"
                className="rounded-full p-2 text-muted-foreground transition-colors hover:text-accent-soft"
              >
                <Heart
                  className={`size-4 ${favourites.includes(song.id) ? "fill-current text-accent-soft" : ""}`}
                />
              </button>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
