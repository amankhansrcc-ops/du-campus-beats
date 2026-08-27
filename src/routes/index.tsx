import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BackgroundManager } from "@/components/du/BackgroundManager";
import { BottomNav, type PanelId } from "@/components/du/BottomNav";
import { CategoryPanel } from "@/components/du/CategoryPanel";
import { CollegePanel } from "@/components/du/CollegePanel";
import { NowPlaying } from "@/components/du/NowPlaying";
import { PlaylistPanel } from "@/components/du/PlaylistPanel";
import { SearchPanel } from "@/components/du/SearchPanel";
import { SpotifyPlayerPanel } from "@/components/du/SpotifyPlayerPanel";
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

function HomeShell() {
  const [college, setCollege] = useState<College>(defaultCollege);
  const [panel, setPanel] = useState<PanelId>(null);
  const [taglineIdx, setTaglineIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setTaglineIdx((i) => (i + 1) % taglines.length),
      9000,
    );
    return () => clearInterval(t);
  }, []);

  const selectCollege = (c: College) => {
    setCollege(c);
    setTaglineIdx((i) => (i + 1) % taglines.length);
  };

  const openSpotify = () => setPanel("spotify");

  return (
    <>
      <BackgroundManager college={college} />

      <main className="relative flex min-h-[100dvh] flex-col">
        <TopStatus />

        <section className="flex flex-1 items-center justify-center px-4 py-8 sm:py-10">
          <div key={college.id} className="animate-fade-in">
            <NowPlaying
              tagline={taglines[taglineIdx]!}
              collegeName={college.name}
              onOpenSpotify={openSpotify}
            />
          </div>
        </section>

        <div className="sticky bottom-0 z-30">
          <SpotifyBar />
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

      {/* The Spotify panel is kept mounted even when closed (uses CSS translate),
          so the embedded iframe and its controller remain alive across drawer open/close. */}
      <SpotifyPlayerPanel open={panel === "spotify"} onClose={() => setPanel(null)} />

      {/* TEMPORARY: always-visible raw Spotify Embed (no iFrame API wrapper)
          so we can diagnose whether the raw iframe itself plays audio.
          Remove this once the root cause is confirmed. */}
      <div className="fixed right-3 top-3 z-[60] w-[320px] max-w-[40vw] rounded-2xl border border-hairline bg-background/85 p-2 shadow-deep backdrop-blur">
        <p className="mb-1.5 px-1 text-[10px] font-bold uppercase tracking-[0.22em] text-accent-soft">
          TEMP Raw Embed Test
        </p>
        <iframe
          title="Raw Spotify Embed — direct test"
          src="https://open.spotify.com/embed/playlist/37i9dQZF1DX2Y6ZOyTJZfp?utm_source=generator"
          width="100%"
          height="352"
          style={{ borderRadius: 12 }}
          frameBorder="0"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="eager"
          onLoad={() => console.log("[DIAG] TEMP raw Spotify embed onLoad fired")}
          onError={(e) => console.error("[DIAG] TEMP raw Spotify embed ERROR", e)}
        />
      </div>

      {/* preload neighbouring college images for instant crossfades */}
      <div className="hidden">
        {colleges.map((c) => (
          <img
            key={c.id}
            src={c.background}
            alt=""
            width={1}
            height={1}
            loading="lazy"
          />
        ))}
      </div>
    </>
  );
}

function Home() {
  return (
    <PlayerProvider>
      <HomeShell />
    </PlayerProvider>
  );
}
