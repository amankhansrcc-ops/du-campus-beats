import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getSong, type Song } from "@/data/music";
import { PLAYLIST_COVER, type SpotifyController, type Track } from "@/lib/spotify";

type RepeatMode = "off" | "all" | "one";

type PlayerState = {
  current: Song | null;
  queue: Song[];
  queueName: string;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  muted: boolean;
  shuffle: boolean;
  repeat: RepeatMode;
  favourites: string[];
  recent: string[];
  spotify: {
    track: Track | null;
    ready: boolean;
    error: string | null;
    autoplayBlocked: boolean;
    needsInteraction: boolean;
    registerController: (ctrl: SpotifyController) => void;
    unregisterController: () => void;
    emitPlaybackStarted: (track?: Track) => void;
    emitPlaybackPaused: (track?: Track) => void;
    emitPlaybackUpdate: (payload: {
      track?: Track;
      isPaused: boolean;
      positionMs: number;
      durationMs: number;
      shuffle?: boolean;
      repeatMode?: 0 | 1 | 2;
    }) => void;
    emitError: (msg: string) => void;
    requestReload: () => void;
    reloadRequestCount: number;
  };
  playSong: (song: Song, queue?: Song[], queueName?: string) => void;
  playQueue: (queue: Song[], queueName: string) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (sec: number) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  toggleFavourite: (id: string) => void;
};

const PlayerContext = createContext<PlayerState | null>(null);

const DU_TRENDING_QUEUE_NAME = "DU Trending";

const trackToSong = (track: Track | null | undefined): Song | null => {
  if (!track) return null;
  const cover =
    track.album?.images?.[0]?.url ??
    track.album?.images?.[1]?.url ??
    PLAYLIST_COVER;
  return {
    id: track.id ?? `spotify-${track.uri}`,
    title: track.name || "Untitled",
    artist: track.artists?.map((a) => a.name).filter(Boolean).join(", ") || "Unknown artist",
    duration: 0,
    audio: "",
    categoryId: "trending",
    cover: typeof cover === "string" && cover.startsWith("http")
      ? `url("${cover}") center/cover no-repeat`
      : cover,
  };
};

export function PlayerProvider({ children }: { children: ReactNode }) {
  const controllerRef = useRef<SpotifyController | null>(null);
  const [spotifyReady, setSpotifyReady] = useState(false);
  const [spotifyError, setSpotifyError] = useState<string | null>(null);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [needsInteraction, setNeedsInteraction] = useState(true);
  const [reloadRequestCount, setReloadRequestCount] = useState(0);

  const [current, setCurrent] = useState<Song | null>(null);
  const [queue, setQueue] = useState<Song[]>([]);
  const [queueName, setQueueName] = useState<string>(DU_TRENDING_QUEUE_NAME);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>("all");
  const [favourites, setFavourites] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [lastTrackUri, setLastTrackUri] = useState<string | null>(null);

  const registerController = useCallback((ctrl: SpotifyController) => {
    controllerRef.current = ctrl;
    setSpotifyReady(true);
    setSpotifyError(null);
  }, []);

  const unregisterController = useCallback(() => {
    controllerRef.current = null;
    setSpotifyReady(false);
  }, []);

  const emitError = useCallback((msg: string) => {
    setSpotifyError(msg);
  }, []);

  const requestReload = useCallback(() => {
    setSpotifyError(null);
    setAutoplayBlocked(false);
    setNeedsInteraction(true);
    setReloadRequestCount((c) => c + 1);
  }, []);

  const emitPlaybackStarted = useCallback((track?: Track) => {
    setIsPlaying(true);
    setNeedsInteraction(false);
    setAutoplayBlocked(false);
    if (track && track.uri !== lastTrackUri) {
      setLastTrackUri(track.uri);
      const s = trackToSong(track);
      if (s) {
        setCurrent(s);
        setRecent((r) => [s.id, ...r.filter((id) => id !== s.id)].slice(0, 12));
      }
    } else if (!current && track) {
      const s = trackToSong(track);
      if (s) {
        setCurrent(s);
        setRecent((r) => [s.id, ...r.filter((id) => id !== s.id)].slice(0, 12));
      }
    }
    setDuration((prev) => prev || Math.max(0, (track as any)?.duration_ms || 0));
  }, [current, lastTrackUri]);

  const emitPlaybackPaused = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const emitPlaybackUpdate = useCallback(
    (payload: {
      track?: Track;
      isPaused: boolean;
      positionMs: number;
      durationMs: number;
      shuffle?: boolean;
      repeatMode?: 0 | 1 | 2;
    }) => {
      const { track, isPaused, positionMs, durationMs, repeatMode } = payload;
      const playing = !isPaused;
      setProgress(Math.max(0, positionMs / 1000));
      if (durationMs > 0) setDuration(durationMs / 1000);
      if (typeof payload.shuffle === "boolean") setShuffle(payload.shuffle);
      if (repeatMode !== undefined) {
        setRepeat(repeatMode === 0 ? "off" : repeatMode === 2 ? "all" : "one");
      }
      if (track && (track.uri !== lastTrackUri || !current)) {
        setLastTrackUri(track.uri);
        const s = trackToSong(track);
        if (s) {
          setCurrent(s);
          setRecent((r) => [s.id, ...r.filter((id) => id !== s.id)].slice(0, 12));
        }
      }
      if (playing && !isPlaying) {
        setIsPlaying(true);
        setNeedsInteraction(false);
        setAutoplayBlocked(false);
      } else if (!playing && isPlaying) {
        setIsPlaying(false);
      }
    },
    [current, isPlaying, lastTrackUri],
  );

  const toggle = useCallback(async () => {
    const ctrl = controllerRef.current;
    console.groupCollapsed("[player.tsx] toggle() called — user clicked custom Play button");
    console.log("  controller exists:", !!ctrl, "| currently isPlaying:", isPlaying);
    if (!ctrl) {
      console.warn("  ⚠ No Spotify EmbedController registered yet — cannot play");
      console.warn("    → Will show autoplay-blocked UI + ask user to tap Spotify window");
      console.groupEnd();
      setAutoplayBlocked(true);
      setNeedsInteraction(true);
      return;
    }
    try {
      if (isPlaying) {
        console.log("  → calling ctrl.pause()");
        await ctrl.pause();
        setIsPlaying(false);
        console.log("  ✓ pause() OK");
      } else {
        setNeedsInteraction(false);
        try {
          console.log("  → calling ctrl.resume() [1st attempt]");
          await ctrl.resume();
          console.log("  ✓ resume() OK — Spotify should be playing now");
        } catch (resumeErr: unknown) {
          const resumeMsg = resumeErr instanceof Error ? resumeErr.message : String(resumeErr);
          console.warn("  resume() threw:", resumeMsg);
          try {
            console.log("  → calling ctrl.play() [fallback 2nd attempt]");
            await ctrl.play();
            console.log("  ✓ play() OK — Spotify should be playing now");
          } catch (playErr: unknown) {
            const playMsg = playErr instanceof Error ? playErr.message : String(playErr);
            console.error("  ✗ ctrl.play() ALSO FAILED:", playMsg);
            console.error("    → This is browser autoplay-block / Spotify requiring a click INSIDE the iframe.");
            console.error("    → Fix: user must click the native green Play button inside the Spotify iframe first.");
            setAutoplayBlocked(true);
            setIsPlaying(false);
          }
        }
      }
    } catch (outerErr: unknown) {
      const msg = outerErr instanceof Error ? outerErr.message : String(outerErr);
      console.error("[player.tsx] toggle() outer catch:", msg);
    } finally {
      console.groupEnd();
    }
  }, [isPlaying]);

  const next = useCallback(async () => {
    try {
      await controllerRef.current?.nextTrack();
    } catch {
      // ignore
    }
  }, []);

  const prev = useCallback(async () => {
    try {
      await controllerRef.current?.previousTrack();
    } catch {
      // ignore
    }
  }, []);

  const seek = useCallback(async (sec: number) => {
    setProgress(sec);
    try {
      await controllerRef.current?.seek(Math.floor(sec * 1000));
    } catch {
      // ignore
    }
  }, []);

  const setVolume = useCallback(
    async (v: number) => {
      setVolumeState(v);
      if (v > 0) setMuted(false);
      try {
        await controllerRef.current?.setVolume(muted ? 0 : Math.max(0, Math.min(1, v)));
      } catch {
        // ignore
      }
    },
    [muted],
  );

  const toggleMute = useCallback(async () => {
    const next = !muted;
    setMuted(next);
    try {
      await controllerRef.current?.setVolume(next ? 0 : Math.max(0, volume));
    } catch {
      // ignore
    }
  }, [muted, volume]);

  const toggleShuffle = useCallback(async () => {
    const next = !shuffle;
    setShuffle(next);
    try {
      await controllerRef.current?.setShuffle(next);
    } catch {
      // ignore
    }
  }, [shuffle]);

  const cycleRepeat = useCallback(async () => {
    setRepeat((r) => {
      const next: RepeatMode = r === "off" ? "all" : r === "all" ? "one" : "off";
      const mode = next === "off" ? 0 : next === "all" ? 2 : 1;
      controllerRef.current?.setRepeat(mode as 0 | 1 | 2).catch(() => {});
      return next;
    });
  }, []);

  const toggleFavourite = useCallback((id: string) => {
    setFavourites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [id, ...f]));
  }, []);

  const playSong = useCallback((_song: Song, nextQueue?: Song[], name?: string) => {
    if (nextQueue?.length) setQueue(nextQueue);
    if (name) setQueueName(name);
    setNeedsInteraction(true);
  }, []);

  const playQueue = useCallback((nextQueue: Song[], name: string) => {
    if (nextQueue.length) setQueue(nextQueue);
    setQueueName(name);
    setNeedsInteraction(true);
  }, []);

  const value = useMemo<PlayerState>(
    () => ({
      current,
      queue,
      queueName,
      isPlaying,
      progress,
      duration,
      volume,
      muted,
      shuffle,
      repeat,
      favourites,
      recent,
      spotify: {
        track: current
          ? ({
              uri: `local:${current.id}`,
              id: current.id,
              type: "track",
              mediaType: "audio",
              name: current.title,
              isPlayable: true,
              album: {
                uri: "",
                name: queueName,
                images: [],
              },
              artists: current.artist.split(",").map((name) => ({ uri: "", name: name.trim() })),
            } as Track)
          : null,
        ready: spotifyReady,
        error: spotifyError,
        autoplayBlocked,
        needsInteraction,
        registerController,
        unregisterController,
        emitPlaybackStarted,
        emitPlaybackPaused,
        emitPlaybackUpdate,
        emitError,
        requestReload,
        reloadRequestCount,
      },
      playSong,
      playQueue,
      toggle,
      next,
      prev,
      seek,
      setVolume,
      toggleMute,
      toggleShuffle,
      cycleRepeat,
      toggleFavourite,
    }),
    [
      current,
      queue,
      queueName,
      isPlaying,
      progress,
      duration,
      volume,
      muted,
      shuffle,
      repeat,
      favourites,
      recent,
      spotifyReady,
      spotifyError,
      autoplayBlocked,
      needsInteraction,
      registerController,
      unregisterController,
      emitPlaybackStarted,
      emitPlaybackPaused,
      emitPlaybackUpdate,
      emitError,
      requestReload,
      reloadRequestCount,
      playSong,
      playQueue,
      toggle,
      next,
      prev,
      seek,
      setVolume,
      toggleMute,
      toggleShuffle,
      cycleRepeat,
      toggleFavourite,
    ],
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used inside PlayerProvider");
  return ctx;
}

export const favouriteSongs = (ids: string[]) =>
  ids.map(getSong).filter(Boolean) as Song[];
