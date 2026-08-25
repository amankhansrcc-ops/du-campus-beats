import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BackgroundManager } from "@/components/du/BackgroundManager";
import { BottomNav, type PanelId } from "@/components/du/BottomNav";
import { CategoryPanel } from "@/components/du/CategoryPanel";
import { CollegePanel } from "@/components/du/CollegePanel";
import { NowPlaying } from "@/components/du/NowPlaying";
import { PlaylistPanel } from "@/components/du/PlaylistPanel";
import { SearchPanel } from "@/components/du/SearchPanel";
import { TopStatus } from "@/components/du/TopStatus";
import { colleges, defaultCollege, type College } from "@/data/colleges";
import { PlayerProvider } from "@/lib/player";

const TITLE = "Campus FM — The Music Platform of Delhi University";
const DESC =
  "Discover what Delhi University students are listening to. Cinematic campus backgrounds, global music categories, playlists and a full web player.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: Home,
});

const taglines = [
  "What are Delhi University students listening to?",
  "The DU campus is listening right now.",
  "Music for every DU mood.",
  "What's playing across campus tonight?",
  "Sound from the corridors of North Campus.",
];

function Home() {
  const [college, setCollege] = useState<College>(defaultCollege);
  const [panel, setPanel] = useState<PanelId>(null);
  const [taglineIdx, setTaglineIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTaglineIdx((i) => (i + 1) % taglines.length), 9000);
    return () => clearInterval(t);
  }, []);

  const selectCollege = (c: College) => {
    setCollege(c);
    setTaglineIdx((i) => (i + 1) % taglines.length);
  };

  return (
    <PlayerProvider>
      <BackgroundManager college={college} />

      <main className="relative flex min-h-[100dvh] flex-col">
        <TopStatus />

        <section className="flex flex-1 items-center justify-center px-4 py-8 sm:py-10">
          <div key={college.id} className="animate-fade-in">
            <NowPlaying tagline={taglines[taglineIdx]} collegeName={college.name} />
          </div>
        </section>

        <div className="sticky bottom-0">
          <BottomNav onOpen={setPanel} collegeName={college.short} />
        </div>
      </main>

      <CategoryPanel open={panel === "categories"} onClose={() => setPanel(null)} />
      <PlaylistPanel open={panel === "playlists"} onClose={() => setPanel(null)} />
      <CollegePanel
        open={panel === "colleges"}
        onClose={() => setPanel(null)}
        active={college}
        onSelect={selectCollege}
      />
      <SearchPanel
        open={panel === "search"}
        onClose={() => setPanel(null)}
        onSelectCollege={selectCollege}
      />

      {/* preload neighbouring college images for instant crossfades */}
      <div className="hidden">
        {colleges.map((c) => (
          <img key={c.id} src={c.background} alt="" width={1} height={1} loading="lazy" />
        ))}
      </div>
    </PlayerProvider>
  );
}
