export const SPOTIFY_PLAYLIST_ID = "37i9dQZF1DX2Y6ZOyTJZfp";
export const SPOTIFY_PLAYLIST_URL = `https://open.spotify.com/embed/playlist/${SPOTIFY_PLAYLIST_ID}?utm_source=generator`;

export type PlaybackState = {
  duration: number;
  playbackPosition: number;
  isPaused: boolean;
};

export type Track = {
  uri: string;
  id: string | null;
  type: "track" | "episode" | "ad";
  mediaType: "audio" | "video";
  name: string;
  isPlayable: boolean;
  album: {
    uri: string;
    name: string;
    images: Array<{ url: string; width?: number; height?: number }>;
  };
  artists: Array<{ uri: string; name: string }>;
};

export type SpotifyController = {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  getInfo: () => Promise<{
    version: string;
    metadata?: {
      current_track: Track;
      next_tracks: Track[];
      previous_tracks: Track[];
      context?: { uri?: string; metadata?: { name?: string } };
      playback?: PlaybackState;
      playback_features?: {
        shuffling?: boolean;
        repeating_mode?: 0 | 1 | 2;
      };
    };
  }>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  seek: (positionMs: number) => Promise<void>;
  nextTrack: () => Promise<void>;
  previousTrack: () => Promise<void>;
  setShuffle: (shuffle: boolean) => Promise<void>;
  setRepeat: (mode: 0 | 1 | 2) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  getVolume: () => Promise<number>;
  destroy: () => void;
};

declare global {
  interface Window {
    SpotifyIFrameAPI?: {
      createController: (iframeId: string) => Promise<SpotifyController>;
      onReady: (callback: () => void) => void;
      _ready?: boolean;
      _callbacks?: Array<() => void>;
    };
    onSpotifyIframeApiReady?: (api: NonNullable<Window["SpotifyIFrameAPI"]>) => void;
  }
}

const SPOTIFY_DEBUG = true;
const slog = (...a: unknown[]) => {
  if (SPOTIFY_DEBUG) console.log("[spotify.ts]", ...a);
};

export const loadSpotifyScript = (): Promise<void> =>
  new Promise((resolve) => {
    if (typeof window === "undefined") return resolve();
    if (window.SpotifyIFrameAPI) {
      slog("Spotify iFrame API already loaded, resolving immediately");
      return resolve();
    }

    const existing = document.querySelector<HTMLScriptElement>(
      'script[src*="spotify.com/embed/iframe-api"]',
    );

    const done = () => resolve();

    if (existing) {
      slog("Existing iframe-api <script> tag found in DOM — waiting for load");
      existing.addEventListener("load", done, { once: true });
      return;
    }

    slog("Injecting <script src=https://open.spotify.com/embed/iframe-api/v1 …>");
    const script = document.createElement("script");
    script.src = "https://open.spotify.com/embed/iframe-api/v1";
    script.async = true;
    script.defer = true;

    window.onSpotifyIframeApiReady = (api) => {
      slog("✓ window.onSpotifyIframeApiReady called by Spotify SDK");
      window.SpotifyIFrameAPI = api;
      done();
    };

    document.head.appendChild(script);

    script.addEventListener("error", (e) => {
      console.error("[spotify.ts] iframe-api script load ERROR", e);
      done();
    }, { once: true });
  });

export const PLAYLIST_COVER =
  "linear-gradient(135deg,#f2994a,#7a2416)";
