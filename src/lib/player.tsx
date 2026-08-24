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
import { songs, getSong, type Song } from "@/data/music";

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

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [current, setCurrent] = useState<Song | null>(null);
  const [queue, setQueue] = useState<Song[]>(songs);
  const [queueName, setQueueName] = useState("DU Trending");
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>("all");
  const [favourites, setFavourites] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    const el = new Audio();
    el.preload = "metadata";
    audioRef.current = el;

    const onTime = () => setProgress(el.currentTime);
    const onMeta = () => setDuration(el.duration || 0);
    const onEnd = () => endedRef.current();
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("ended", onEnd);
    return () => {
      el.pause();
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("ended", onEnd);
    };
  }, []);

  useEffect(() => {
    const el = audioRef.current;
    if (el) {
      el.volume = volume;
      el.muted = muted;
    }
  }, [volume, muted]);

  const load = useCallback((song: Song, autoplay = true) => {
    const el = audioRef.current;
    setCurrent(song);
    setProgress(0);
    setDuration(song.duration);
    setRecent((r) => [song.id, ...r.filter((id) => id !== song.id)].slice(0, 12));
    if (!el) return;
    el.src = song.audio;
    if (autoplay) {
      el.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, []);

  const playSong = useCallback(
    (song: Song, nextQueue?: Song[], name?: string) => {
      if (nextQueue?.length) setQueue(nextQueue);
      if (name) setQueueName(name);
      load(song);
    },
    [load],
  );

  const playQueue = useCallback(
    (nextQueue: Song[], name: string) => {
      if (!nextQueue.length) return;
      setQueue(nextQueue);
      setQueueName(name);
      load(nextQueue[0]);
    },
    [load],
  );

  const step = useCallback(
    (dir: 1 | -1) => {
      if (!queue.length) return;
      if (shuffle && dir === 1) {
        const pick = queue[Math.floor(Math.random() * queue.length)];
        load(pick);
        return;
      }
      const idx = current ? queue.findIndex((s) => s.id === current.id) : -1;
      const nextIdx = (idx + dir + queue.length) % queue.length;
      load(queue[nextIdx]);
    },
    [queue, current, shuffle, load],
  );

  const endedRef = useRef<() => void>(() => {});
  endedRef.current = () => {
    const el = audioRef.current;
    if (repeat === "one" && el && current) {
      el.currentTime = 0;
      void el.play();
      return;
    }
    if (repeat === "off") {
      const idx = current ? queue.findIndex((s) => s.id === current.id) : -1;
      if (idx === queue.length - 1) {
        setIsPlaying(false);
        return;
      }
    }
    step(1);
  };

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (!current) {
      load(queue[0] ?? songs[0]);
      return;
    }
    if (el.paused) {
      el.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      el.pause();
      setIsPlaying(false);
    }
  }, [current, queue, load]);

  const seek = useCallback((sec: number) => {
    const el = audioRef.current;
    setProgress(sec);
    if (el && Number.isFinite(el.duration)) el.currentTime = sec;
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
      playSong,
      playQueue,
      toggle,
      next: () => step(1),
      prev: () => step(-1),
      seek,
      setVolume: (v: number) => {
        setVolumeState(v);
        if (v > 0) setMuted(false);
      },
      toggleMute: () => setMuted((m) => !m),
      toggleShuffle: () => setShuffle((s) => !s),
      cycleRepeat: () =>
        setRepeat((r) => (r === "off" ? "all" : r === "all" ? "one" : "off")),
      toggleFavourite: (id: string) =>
        setFavourites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [id, ...f])),
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
      playSong,
      playQueue,
      toggle,
      seek,
      step,
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
