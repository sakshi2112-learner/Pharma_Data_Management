import { useEffect, useMemo, useState } from "react";

type Heart = {
  left: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
  opacity: number;
  hue: number;
};

function seededHearts(count: number): Heart[] {
  const hearts: Heart[] = [];
  for (let i = 0; i < count; i++) {
    hearts.push({
      left: Math.random() * 100,
      size: 10 + Math.random() * 22,
      delay: Math.random() * 12,
      duration: 8 + Math.random() * 10,
      drift: (Math.random() - 0.5) * 160,
      opacity: 0.45 + Math.random() * 0.45,
      hue: 350 + Math.random() * 20,
    });
  }
  return hearts;
}

export function FallingHearts({ count = 26 }: { count?: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const hearts = useMemo(() => seededHearts(count), [count]);
  if (!mounted) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {hearts.map((h, i) => (
        <svg
          key={i}
          className="heart-sprite"
          viewBox="0 0 24 24"
          width={h.size}
          height={h.size}
          style={{
            left: `${h.left}%`,
            animationDelay: `${h.delay}s`,
            animationDuration: `${h.duration}s`,
            ["--drift" as string]: `${h.drift}px`,
            ["--heart-opacity" as string]: h.opacity,
          }}
        >
          <path
            d="M12 21s-7.5-4.6-9.7-9.3C.8 7.9 3.4 4 7 4c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.6 0 6.2 3.9 4.7 7.7C19.5 16.4 12 21 12 21z"
            fill={`oklch(0.6 0.2 ${h.hue})`}
          />
        </svg>
      ))}
    </div>
  );
}
