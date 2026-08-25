const BARS = 44;

export function AudioVisualizer({
  active,
  loading,
}: {
  active: boolean;
  loading?: boolean;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-end justify-center gap-[3px] px-1">
      {Array.from({ length: BARS }).map((_, i) => {
        const mid = Math.abs(i - (BARS - 1) / 2) / ((BARS - 1) / 2);
        return (
          <span
            key={i}
            className="w-[2px] rounded-full bg-accent-soft"
            style={{
              height: `${8 + (1 - mid) * 46}%`,
              opacity: active
                ? 0.25 + (1 - mid) * 0.55
                : loading
                ? 0.18 + (1 - mid) * 0.3
                : 0.12,
              animation: active
                ? `eq ${620 + (i % 7) * 130}ms ease-in-out ${i * 37}ms infinite alternate`
                : loading
                ? `wave-loading 1.2s ease-in-out ${i * 80}ms infinite`
                : "none",
            }}
          />
        );
      })}
    </div>
  );
}

export function PulseGlow({ active }: { active: boolean }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 rounded-full blur-3xl transition-opacity duration-700"
      style={{
        background: "radial-gradient(circle, hsl(var(--glow) / 0.55), transparent 65%)",
        opacity: active ? 1 : 0.25,
        animation: active ? "pulse-soft 3.2s ease-in-out infinite" : "none",
      }}
    />
  );
}
