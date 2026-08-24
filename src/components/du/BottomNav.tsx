import { Building2, LayoutGrid, ListMusic, Pause, Play, Search } from "lucide-react";
import { usePlayer } from "@/lib/player";

export type PanelId = "categories" | "colleges" | "playlists" | "search" | null;

export function BottomNav({
  onOpen,
  collegeName,
}: {
  onOpen: (p: PanelId) => void;
  collegeName: string;
}) {
  const { current, isPlaying, toggle, queueName } = usePlayer();

  return (
    <nav className="pointer-events-auto mx-auto w-full max-w-5xl px-3 pb-4 sm:px-6 sm:pb-6">
      <div className="glass flex items-stretch gap-2 rounded-[24px] p-2 sm:gap-3 sm:p-3">
        <NavButton icon={<LayoutGrid className="size-4" />} label="Categories" onClick={() => onOpen("categories")} />

        <button
          onClick={() => onOpen("playlists")}
          className="flex min-w-0 flex-[1.4] items-center gap-3 rounded-2xl px-2 py-2 text-left transition-colors hover:bg-foreground/[0.07] sm:px-4"
        >
          <span
            className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl sm:size-11"
            style={{ background: current?.cover ?? "linear-gradient(135deg,#f2994a,#7a2416)" }}
          >
            {isPlaying && (
              <span className="flex items-end gap-[2px]">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-[2px] bg-background/90"
                    style={{ height: 10, animation: `eq ${520 + i * 160}ms ease-in-out infinite alternate` }}
                  />
                ))}
              </span>
            )}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[9px] uppercase tracking-[0.28em] text-muted-foreground">
              Now Playing
            </span>
            <span className="block truncate text-sm font-medium">
              {current?.title ?? "Nothing playing"}
            </span>
            <span className="hidden truncate text-xs text-muted-foreground sm:block">
              {current ? `${current.artist} • ${queueName}` : queueName}
            </span>
          </span>
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              toggle();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.stopPropagation();
                toggle();
              }
            }}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="grid size-10 shrink-0 place-items-center rounded-full bg-foreground text-background transition-transform hover:scale-105"
          >
            {isPlaying ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current" />}
          </span>
        </button>

        <NavButton icon={<Search className="size-4" />} label="Search" onClick={() => onOpen("search")} compact />
        <NavButton icon={<Building2 className="size-4" />} label="Colleges" sub={collegeName} onClick={() => onOpen("colleges")} />
      </div>
    </nav>
  );
}

function NavButton({
  icon,
  label,
  sub,
  onClick,
  compact,
}: {
  icon: React.ReactNode;
  label: string;
  sub?: string;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 transition-colors hover:bg-foreground/[0.07] ${
        compact ? "shrink-0" : "flex-1"
      }`}
    >
      <span className="text-accent-soft">{icon}</span>
      <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-foreground/85 sm:text-[11px] sm:tracking-[0.22em]">
        {label}
      </span>
      {sub && <span className="hidden max-w-[120px] truncate text-[10px] text-muted-foreground sm:block">{sub}</span>}
    </button>
  );
}

export { ListMusic };
