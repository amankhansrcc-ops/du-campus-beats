/**
 * MUSIC = global. Categories, playlists and songs are never tied to a college.
 * Swap `audio` / `cover` for uploaded files later, or hydrate these same
 * shapes from a database table without touching the UI.
 *
 * Suggested schema when moving to a backend:
 *   songs(id, title, artist, duration, audio_url, cover_url, category_id)
 *   categories(id, name, blurb)
 *   playlists(id, name, description, cover_url)
 *   playlist_songs(playlist_id, song_id, position)
 *   colleges(id, name, background_url)   -- visual only
 */

export type Song = {
  id: string;
  title: string;
  artist: string;
  /** seconds */
  duration: number;
  audio: string;
  categoryId: string;
  /** CSS gradient used as artwork until real cover art is uploaded. */
  cover: string;
};

export type Category = {
  id: string;
  name: string;
  blurb: string;
};

export type Playlist = {
  id: string;
  name: string;
  description: string;
  cover: string;
  songIds: string[];
};

const demo = (n: number) =>
  `https://www.soundhelix.com/examples/audio/SoundHelix-Song-${n}.mp3`;

const g = (a: string, b: string) => `linear-gradient(135deg, ${a}, ${b})`;

export const categories: Category[] = [
  { id: "trending", name: "Trending", blurb: "On repeat across campus right now" },
  { id: "hiphop", name: "Hip-Hop", blurb: "Bars from Delhi and beyond" },
  { id: "bollywood", name: "Bollywood", blurb: "Metro rides and hostel nights" },
  { id: "punjabi", name: "Punjabi", blurb: "North Campus after-party fuel" },
  { id: "lofi", name: "Lo-Fi", blurb: "Slow beats for slow afternoons" },
  { id: "rap", name: "Rap", blurb: "Cyphers, freestyles, storytelling" },
  { id: "indie", name: "Indie", blurb: "The sound of small venues" },
  { id: "rnb", name: "R&B", blurb: "Smooth, late, unhurried" },
  { id: "pop", name: "Pop", blurb: "Loud, bright, everywhere" },
  { id: "rock", name: "Rock", blurb: "Amps up, windows open" },
  { id: "electronic", name: "Electronic", blurb: "Synths for the walk home" },
  { id: "classical", name: "Classical", blurb: "Ragas between lectures" },
  { id: "ghazal", name: "Ghazal", blurb: "Poetry with a pulse" },
  { id: "chill", name: "Chill", blurb: "Nothing urgent" },
  { id: "study", name: "Study", blurb: "Library hours, focus mode" },
  { id: "latenight", name: "Late Night", blurb: "After 1 AM only" },
];

type Seed = [string, string, string, number, number];

const seeds: Seed[] = [
  // title, artist, categoryId, duration, audio index
  ["Chandni Chowk Bounce", "Rawal", "hiphop", 214, 1],
  ["North Campus Cypher", "Seedhe Maut", "hiphop", 246, 2],
  ["Metro Line Yellow", "Prabh Deep", "hiphop", 198, 3],
  ["Kamla Nagar", "MC Kode", "hiphop", 232, 4],
  ["Hostel Roof", "Yashraj", "hiphop", 205, 5],

  ["Sunday Morning Delhi", "Anuv Jain", "trending", 227, 6],
  ["Winter in Vijay Nagar", "Lifafa", "trending", 260, 7],
  ["Practical Exam Blues", "Tribe Mama Marykali", "trending", 189, 8],
  ["Fresher's Night", "Ritviz", "trending", 221, 9],
  ["Attendance Shortage", "Peter Cat Recording Co.", "trending", 254, 10],

  ["Hawa Mein Baatein", "Arijit Singh", "bollywood", 243, 11],
  ["Chhat Pe Raat", "Shreya Ghoshal", "bollywood", 236, 12],
  ["Rickshaw Romance", "Pritam", "bollywood", 218, 13],
  ["Dilli Meri Jaan", "Amit Trivedi", "bollywood", 249, 14],
  ["Last Bus Home", "Jasleen Royal", "bollywood", 207, 15],

  ["Patiala Nights", "Diljit Dosanjh", "punjabi", 212, 16],
  ["Mustard Fields", "AP Dhillon", "punjabi", 195, 1],
  ["Bhangra in the Quad", "Karan Aujla", "punjabi", 228, 2],
  ["Pind Se Dilli", "Sidhu Style", "punjabi", 240, 3],
  ["Chandigarh Detour", "Shubh", "punjabi", 203, 4],

  ["Library 4 PM", "Kaagaz", "lofi", 184, 5],
  ["Rainy Ridge", "Slowlight", "lofi", 176, 6],
  ["Chai Break Loop", "Tape Room", "lofi", 191, 7],
  ["Dust and Sunlight", "Beat Bazaar", "lofi", 168, 8],
  ["Empty Classroom", "Mono Mango", "lofi", 202, 9],

  ["Ink on Notebook", "Dee MC", "rap", 209, 10],
  ["Rooftop Freestyle", "Raftaar", "rap", 233, 11],
  ["Delhi 6 Diaries", "Kr$na", "rap", 251, 12],

  ["Paperback Summer", "The Local Train", "indie", 244, 13],
  ["Model Town Tapes", "Parekh & Singh", "indie", 231, 14],
  ["Second Year", "When Chai Met Toast", "indie", 216, 15],

  ["Slow Reply", "Zaeden", "rnb", 199, 16],
  ["Velvet Corridor", "Aditi Ramesh", "rnb", 224, 1],
  ["Midnight Mess", "Sanjeeta", "rnb", 187, 2],

  ["Neon Fest", "Armaan Malik", "pop", 193, 3],
  ["Crowd Surf", "Lisa Mishra", "pop", 205, 4],

  ["Amp in the Common Room", "Parikrama", "rock", 268, 5],
  ["Distortion Society", "Indian Ocean", "rock", 289, 6],

  ["Hauz Khas 3 AM", "Nucleya", "electronic", 214, 7],
  ["Synth Ridge", "Sandunes", "electronic", 236, 8],

  ["Raag for Morning Class", "Kaushiki Chakraborty", "classical", 302, 9],
  ["Sitar at Sunset", "Niladri Kumar", "classical", 318, 10],

  ["Shaam Ke Baad", "Jagjit Singh", "ghazal", 274, 11],
  ["Adhoori Baat", "Talat Aziz", "ghazal", 259, 12],

  ["Nothing Due Today", "Osho Jain", "chill", 213, 13],
  ["Lawn Nap", "Taba Chake", "chill", 226, 14],

  ["Deadline Focus", "Study Loop", "study", 240, 15],
  ["Silent Reading Room", "Paper Piano", "study", 232, 16],

  ["1 AM Mess Talk", "Prateek Kuhad", "latenight", 247, 1],
  ["Last Train Out", "Aswekeepsearching", "latenight", 271, 2],
];

const palettes = [
  ["#f2994a", "#8b2f1d"],
  ["#5a7fd6", "#131b3a"],
  ["#d95a8a", "#3b1230"],
  ["#4fb99f", "#123b34"],
  ["#e0b34f", "#4a2c0d"],
  ["#8f6ad6", "#241340"],
  ["#e05e4f", "#3a1010"],
  ["#4a9fd8", "#0f2740"],
];

export const songs: Song[] = seeds.map(([title, artist, categoryId, duration, audioIdx], i) => {
  const p = palettes[i % palettes.length]!;
  return {
    id: `s${i + 1}`,
    title,
    artist,
    categoryId,
    duration,
    audio: demo(audioIdx),
    cover: g(p[0]!, p[1]!),
  };
});

export const songsByCategory = (categoryId: string) =>
  songs.filter((s) => s.categoryId === categoryId);

const ids = (categoryId: string, n = 5) =>
  songsByCategory(categoryId).slice(0, n).map((s) => s.id);

export const playlists: Playlist[] = [
  {
    id: "du-trending",
    name: "DU Trending 2026",
    description: "The most played tracks across campus.",
    cover: g("#f2994a", "#7a2416"),
    songIds: ids("trending"),
  },
  {
    id: "after-hours",
    name: "DU After Hours",
    description: "The songs students play after midnight.",
    cover: g("#5a63d6", "#141033"),
    songIds: [...ids("latenight"), ...ids("rnb", 3)],
  },
  {
    id: "north-campus-bars",
    name: "North Campus Bars",
    description: "Hip-hop and rap doing the rounds in Kamla Nagar.",
    cover: g("#d95a4a", "#33100c"),
    songIds: [...ids("hiphop"), ...ids("rap", 3)],
  },
  {
    id: "library-hours",
    name: "Library Hours",
    description: "Low volume, high focus. Lo-fi and study loops.",
    cover: g("#4fb99f", "#0f312c"),
    songIds: [...ids("lofi"), ...ids("study", 2)],
  },
  {
    id: "fest-season",
    name: "Fest Season",
    description: "Punjabi, pop and everything the crowd screams back.",
    cover: g("#e0b34f", "#4a2708"),
    songIds: [...ids("punjabi"), ...ids("pop", 2)],
  },
  {
    id: "chai-and-ghazal",
    name: "Chai & Ghazal",
    description: "Slow evenings near the Ridge.",
    cover: g("#8f6ad6", "#221340"),
    songIds: [...ids("ghazal"), ...ids("classical", 2)],
  },
];

export const getSong = (id: string) => songs.find((s) => s.id === id);
export const playlistSongs = (p: Playlist) =>
  p.songIds.map(getSong).filter(Boolean) as Song[];

export const formatTime = (sec: number) => {
  if (!Number.isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};
