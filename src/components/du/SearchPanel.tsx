import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { categories, playlists, playlistSongs, songs } from "@/data/music";
import { colleges, type College } from "@/data/colleges";
import { usePlayer } from "@/lib/player";
import { Overlay } from "./Overlay";
import { SongList } from "./SongList";

export function SearchPanel({
  open,
  onClose,
  onSelectCollege,
}: {
  open: boolean;
  onClose: () => void;
  onSelectCollege: (c: College) => void;
}) {
  const [q, setQ] = useState("");
  const { playQueue } = usePlayer();
  const t = q.trim().toLowerCase();

  const results = useMemo(() => {
    if (!t) return null;
    return {
      songs: songs.filter(
        (s) => s.title.toLowerCase().includes(t) || s.artist.toLowerCase().includes(t),
      ),
      categories: categories.filter((c) => c.name.toLowerCase().includes(t)),
      playlists: playlists.filter(
        (p) => p.name.toLowerCase().includes(t) || p.description.toLowerCase().includes(t),
      ),
      colleges: colleges.filter(
        (c) => c.name.toLowerCase().includes(t) || c.short.toLowerCase().includes(t),
      ),
    };
  }, [t]);

  return (
    <Overlay
      open={open}
      onClose={onClose}
      title="Search"
      subtitle="Songs, artists, playlists, categories and colleges."
    >
      <label className="mb-5 flex items-center gap-3 rounded-full border border-hairline bg-foreground/[0.05] px-4 py-3">
        <Search className="size-4 text-muted-foreground" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Try “Arijit”, “Hip-Hop”, “SRCC”"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </label>

      {!results && (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Start typing to search across the campus library.
        </p>
      )}

      {results && (
        <div className="space-y-6">
          {!!results.categories.length && (
            <Section label="Categories">
              <div className="flex flex-wrap gap-2">
                {results.categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() =>
                      playQueue(
                        songs.filter((s) => s.categoryId === c.id),
                        c.name,
                      )
                    }
                    className="rounded-full border border-hairline px-4 py-2 text-sm transition-colors hover:bg-foreground/[0.08]"
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </Section>
          )}

          {!!results.playlists.length && (
            <Section label="Playlists">
              <div className="grid gap-2 sm:grid-cols-2">
                {results.playlists.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => playQueue(playlistSongs(p), p.name)}
                    className="flex items-center gap-3 rounded-2xl border border-hairline p-2 text-left transition-colors hover:bg-foreground/[0.08]"
                  >
                    <span className="size-11 shrink-0 rounded-xl" style={{ background: p.cover }} />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{p.name}</span>
                      <span className="block truncate text-[11px] text-muted-foreground">
                        {p.songIds.length} songs
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </Section>
          )}

          {!!results.colleges.length && (
            <Section label="Colleges (changes the view)">
              <div className="flex flex-wrap gap-2">
                {results.colleges.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectCollege(c);
                      onClose();
                    }}
                    className="rounded-full border border-hairline px-4 py-2 text-sm transition-colors hover:bg-foreground/[0.08]"
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </Section>
          )}

          {!!results.songs.length && (
            <Section label="Songs">
              <SongList songs={results.songs} queueName={`Search: ${q}`} />
            </Section>
          )}

          {!results.songs.length &&
            !results.playlists.length &&
            !results.categories.length &&
            !results.colleges.length && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Nothing matched “{q}”.
              </p>
            )}
        </div>
      )}
    </Overlay>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}
