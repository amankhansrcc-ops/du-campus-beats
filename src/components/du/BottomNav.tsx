import { Building2, LayoutGrid } from "lucide-react";

export type PanelId = "categories" | "colleges" | "playlists" | "search" | "spotify" | null;

export function BottomNav({
  onOpen,
  collegeName,
}: {
  onOpen: (p: PanelId) => void;
  collegeName: string;
}) {
  return (
    <nav className="pointer-events-auto absolute inset-x-0 bottom-4 px-4 sm:px-6">
      <div className="flex items-end justify-between gap-3">
        <NavButton
          icon={<LayoutGrid className="size-4" />}
          label="Categories"
          onClick={() => onOpen("categories")}
          className="ml-0"
        />

        <NavButton
          icon={<Building2 className="size-4" />}
          label="Colleges"
          sub={collegeName}
          onClick={() => onOpen("colleges")}
          className="mr-0"
        />
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
  className,
}: {
  icon: React.ReactNode;
  label: string;
  sub?: string;
  onClick: () => void;
  compact?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex min-h-[72px] min-w-[120px] flex-col items-center justify-center gap-1 rounded-[20px] border border-white/10 bg-black/15 px-3 py-2 text-center shadow-[0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-md transition-colors hover:bg-foreground/[0.07] ${
        compact ? "shrink-0" : ""
      } ${className ?? ""}`}
    >
      <span className="text-accent-soft">{icon}</span>
      <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-foreground/85 sm:text-[11px] sm:tracking-[0.22em]">
        {label}
      </span>
      {sub && (
        <span className="hidden max-w-[120px] truncate text-[10px] text-muted-foreground sm:block">
          {sub}
        </span>
      )}
    </button>
  );
}
