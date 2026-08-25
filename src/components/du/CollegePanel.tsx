import { useMemo, useState } from "react";
import { Check, Search } from "lucide-react";
import { colleges, type College } from "@/data/colleges";
import { Overlay } from "./Overlay";

/**
 * College selection = background/visual theme only. It never touches music.
 */
export function CollegePanel({
  open,
  onClose,
  active,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  active: College;
  onSelect: (c: College) => void;
}) {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return colleges;
    return colleges.filter(
      (c) => c.name.toLowerCase().includes(t) || c.short.toLowerCase().includes(t),
    );
  }, [q]);

  return (
    <Overlay
      open={open}
      onClose={onClose}
      title="Colleges"
      subtitle="Pick your campus — it changes the view, not the music."
    >
      <label className="mb-4 flex items-center gap-3 rounded-full border border-hairline bg-foreground/[0.05] px-4 py-2.5">
        <Search className="size-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search colleges"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </label>

      <div className="grid gap-2 sm:grid-cols-2">
        {results.map((c) => {
          const isActive = c.id === active.id;
          return (
            <button
              key={c.id}
              onClick={() => {
                onSelect(c);
                onClose();
              }}
              className={`group flex items-center gap-3 overflow-hidden rounded-2xl border p-2 text-left transition-colors ${
                isActive
                  ? "border-accent/50 bg-foreground/[0.1]"
                  : "border-hairline hover:bg-foreground/[0.07]"
              }`}
            >
              <span
                className="size-14 shrink-0 rounded-xl bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${c.background})` }}
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{c.name}</span>
                <span className="block text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  {c.short}
                </span>
              </span>
              {isActive && <Check className="mr-2 size-4 text-accent-soft" />}
            </button>
          );
        })}
        {!results.length && (
          <p className="col-span-full py-8 text-center text-sm text-muted-foreground">
            No college matched “{q}”.
          </p>
        )}
      </div>
    </Overlay>
  );
}
