import { useEffect, useRef, useState } from "react";
import type { College } from "@/data/colleges";

/**
 * Crossfades between college backgrounds. Purely visual — it knows nothing
 * about music state.
 */
export function BackgroundManager({ college }: { college: College }) {
  const [layers, setLayers] = useState([{ key: college.id, src: college.background }]);
  const prev = useRef(college.id);

  useEffect(() => {
    if (prev.current === college.id) return;
    prev.current = college.id;
    setLayers((l) => [...l.slice(-1), { key: college.id, src: college.background }]);
    const t = setTimeout(() => {
      setLayers([{ key: college.id, src: college.background }]);
    }, 1400);
    return () => clearTimeout(t);
  }, [college]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      {layers.map((layer, i) => (
        <div
          key={layer.key + i}
          className="absolute inset-0 animate-bg-in bg-cover bg-center will-change-transform"
          style={{ backgroundImage: `url(${layer.src})`, animationDelay: i === 0 ? "0ms" : "0ms" }}
        >
          <div className="absolute inset-0 animate-drift bg-cover bg-center" />
        </div>
      ))}
      {/* readability + cinematic grading */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/45 to-background/95" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--vignette)_100%)]" />
      <div
        className="absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[120px]"
        style={{ background: `hsl(${college.tint ?? "28 80% 55%"} / 0.35)` }}
      />
      <div className="absolute inset-0 grain opacity-[0.18]" />
    </div>
  );
}
