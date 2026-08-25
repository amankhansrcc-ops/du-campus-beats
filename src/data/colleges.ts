import bgDu from "@/assets/bg-du.jpg";
import bgSrcc from "@/assets/bg-srcc.jpg";
import bgHindu from "@/assets/bg-hindu.jpg";
import bgHansraj from "@/assets/bg-hansraj.jpg";
import bgMiranda from "@/assets/bg-miranda.jpg";
import bgLsr from "@/assets/bg-lsr.jpg";
import bgCampus from "@/assets/bg-campus.jpg";

/**
 * COLLEGES = visual theme only.
 * A college controls the background image + displayed name. It never
 * affects categories, playlists or the queue.
 *
 * To add a college later: drop an image in src/assets (or point `background`
 * at any URL) and append an entry here. Nothing else needs to change.
 */
export type College = {
  id: string;
  name: string;
  short: string;
  /** Any image URL — local import or remote/uploaded URL. */
  background: string;
  /** Optional accent tint used for the ambient glow. */
  tint?: string;
};

export const colleges: College[] = [
  { id: "du", name: "University of Delhi", short: "DU", background: bgDu, tint: "28 80% 55%" },
  { id: "srcc", name: "SRCC", short: "SRCC", background: bgSrcc, tint: "215 70% 60%" },
  { id: "hindu", name: "Hindu College", short: "Hindu", background: bgHindu, tint: "40 60% 60%" },
  { id: "hansraj", name: "Hansraj College", short: "Hansraj", background: bgHansraj, tint: "10 70% 58%" },
  { id: "miranda", name: "Miranda House", short: "Miranda", background: bgMiranda, tint: "20 65% 55%" },
  { id: "lsr", name: "Lady Shri Ram College", short: "LSR", background: bgLsr, tint: "45 70% 60%" },
  { id: "ramjas", name: "Ramjas College", short: "Ramjas", background: bgCampus, tint: "210 55% 60%" },
  { id: "kmc", name: "Kirori Mal College", short: "KMC", background: bgCampus, tint: "200 50% 58%" },
  { id: "venky", name: "Sri Venkateswara College", short: "Venky", background: bgCampus, tint: "160 45% 55%" },
  { id: "stephens", name: "St. Stephen's College", short: "Stephen's", background: bgHindu, tint: "35 60% 58%" },
  { id: "gargi", name: "Gargi College", short: "Gargi", background: bgLsr, tint: "300 40% 60%" },
  { id: "jmc", name: "Jesus and Mary College", short: "JMC", background: bgMiranda, tint: "25 60% 58%" },
  { id: "sscbs", name: "Shaheed Sukhdev College of Business Studies", short: "SSCBS", background: bgSrcc, tint: "220 60% 60%" },
];

export const defaultCollege = colleges[0]!;
