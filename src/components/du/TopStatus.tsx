import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

const fmtCount = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}K` : `${n}`);

export function TopStatus() {
  const [time, setTime] = useState("");
  const [listeners, setListeners] = useState(500);

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-IN", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      );
    tick();
    const t = setInterval(tick, 20_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setListeners((n) => {
        const drift = Math.round((Math.random() - 0.45) * 18);
        return Math.min(1480, Math.max(320, n + drift));
      });
    }, 3200);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="pointer-events-auto flex items-start justify-between gap-3 px-4 pt-4 sm:px-8 sm:pt-7">
      <div className="glass flex items-center gap-2 rounded-full px-3.5 py-2 text-[11px] tracking-wide sm:text-xs">
        <span className="tabular-nums text-foreground/85">{time}</span>
        <span className="opacity-40">•</span>
        <span className="relative flex size-1.5">
          <span className="absolute inset-0 animate-ping rounded-full bg-accent" />
          <span className="relative size-1.5 rounded-full bg-accent" />
        </span>
        <span className="tabular-nums text-muted-foreground">
          {fmtCount(listeners)} listening
        </span>
      </div>

      <a
        href="#support"
        onClick={(e) => e.preventDefault()}
        className="glass flex items-center gap-2 rounded-full px-3.5 py-2 text-[11px] font-medium tracking-wide transition-colors hover:bg-foreground/[0.12] sm:text-xs"
      >
        <Heart className="size-3.5 text-accent" />
        Support us
      </a>
    </header>
  );
}
