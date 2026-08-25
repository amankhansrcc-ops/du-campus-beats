import { useState } from "react";
import { ChevronLeft, Play } from "lucide-react";
import { playlists, playlistSongs, songs, type Playlist } from "@/data/music";
import { favouriteSongs, usePlayer } from "@/lib/player";
import { Overlay } from "./Overlay";
import { SongList } from "./SongList";

type Tab = "playlists" | "recent" | "favourites";

export function PlaylistPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>("playlists");
  const [activeId, setActiveId] = useState<string | null>(null);
  const { playQueue, recent, favourites } = usePlayer();

  const active: Playlist | null = playlists.find((p) => p.id === activeId) ?? null;
  const list = active ? playlistSongs(active) : [];

  const close = () => {
    onClose();
    setActiveId(null);
  };

  return (
    <Overlay
      open={open}
      onClose={close}
      title={active ? active.name : "Playlists"}
      subtitle={active ? `${active.description} • ${list.length} songs` : "Trending, after-hours and everything in between."}
      footer={
        active ? (
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveId(null)}
              className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronLeft className="size-4" /> All playlists
            </button>
            <button
              onClick={() => playQueue(list, active.name)}
              className="flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-transform hover:scale-105"
            >
              <Play className="size-4 fill-current" /> Play playlist
            </button>
          </div>
        ) : null
      }
    >
      {active ? (
        <SongList songs={list} queueName={active.name} />
      ) : (
        <>
          <div className="mb-4 flex gap-1 rounded-full border border-hairline p-1 text-xs">
            {(
              [
                ["playlists", "Playlists"],
                ["recent", "Recently played"],
                ["favourites", "Favourites"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex-1 rounded-full px-3 py-2 transition-colors ${
                  tab === id ? "bg-foreground/12 text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === "playlists" && (
            <div className="grid gap-2 sm:grid-cols-2">
              {playlists.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActiveId(p.id)}
                  className="group flex items-center gap-3 rounded-2xl border border-hairline p-2 text-left transition-colors hover:bg-foreground/[0.07]"
                >
                  <span
                    className="grid size-16 shrink-0 place-items-center rounded-xl"
                    style={{ background: p.cover }}
                  >
                    <Play className="size-5 fill-current opacity-0 transition-opacity group-hover:opacity-90" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-display text-lg leading-tight">{p.name}</span>
                    <span className="line-clamp-2 text-[11px] text-muted-foreground">{p.description}</span>
                    <span className="mt-1 block text-[10px] uppercase tracking-[0.2em] text-accent-soft">
                      {p.songIds.length} songs
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}

          {tab === "recent" && (
            <SongList songs={favouriteSongs(recent)} queueName="Recently played" />
          )}
          {tab === "favourites" && (
            <SongList songs={favouriteSongs(favourites)} queueName="Your favourites" />
          )}
          {tab === "playlists" && (
            <div className="mt-6">
              <p className="mb-2 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                Popular this week
              </p>
              <SongList songs={songs.slice(5, 11)} queueName="Popular this week" />
            </div>
          )}
        </>
      )}
    </Overlay>
  );
}
