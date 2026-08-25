import { useState } from "react";
import { ChevronLeft, Play } from "lucide-react";
import { categories, songsByCategory } from "@/data/music";
import { usePlayer } from "@/lib/player";
import { Overlay } from "./Overlay";
import { SongList } from "./SongList";

export function CategoryPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const { playQueue } = usePlayer();
  const active = categories.find((c) => c.id === activeId) ?? null;
  const list = active ? songsByCategory(active.id) : [];

  const close = () => {
    onClose();
    setActiveId(null);
  };

  return (
    <Overlay
      open={open}
      onClose={close}
      title={active ? active.name : "Music Categories"}
      subtitle={
        active
          ? `${active.blurb} • ${list.length} songs`
          : "Global across every college — the same playlists wherever you are."
      }
      footer={
        active ? (
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveId(null)}
              className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronLeft className="size-4" /> All categories
            </button>
            <button
              onClick={() => playQueue(list, active.name)}
              className="flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-transform hover:scale-105"
            >
              <Play className="size-4 fill-current" /> Play all
            </button>
          </div>
        ) : null
      }
    >
      {active ? (
        <SongList songs={list} queueName={active.name} />
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className="group rounded-2xl border border-hairline bg-foreground/[0.04] p-4 text-left transition-colors hover:bg-foreground/[0.1]"
            >
              <p className="font-display text-lg leading-tight">{c.name}</p>
              <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">{c.blurb}</p>
              <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-accent-soft">
                {songsByCategory(c.id).length} songs
              </p>
            </button>
          ))}
        </div>
      )}
    </Overlay>
  );
}
