import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

interface ConstellationStar {
  x: number;
  y: number;
  group: number; // which submission lights this up
}

interface ConstellationLine {
  from: number;
  to: number;
  group: number;
}

// 5 constellation groups, each unlocked by a new submission
const CONSTELLATION_STARS: ConstellationStar[] = [
  // Group 0 — always visible (seed stars, dim)
  { x: 0.15, y: 0.12, group: 0 },
  { x: 0.82, y: 0.2, group: 0 },
  // Group 1 — first submission
  { x: 0.25, y: 0.08, group: 1 },
  { x: 0.32, y: 0.18, group: 1 },
  { x: 0.2, y: 0.25, group: 1 },
  // Group 2
  { x: 0.48, y: 0.1, group: 2 },
  { x: 0.55, y: 0.06, group: 2 },
  { x: 0.6, y: 0.15, group: 2 },
  // Group 3
  { x: 0.42, y: 0.22, group: 3 },
  { x: 0.52, y: 0.28, group: 3 },
  { x: 0.38, y: 0.32, group: 3 },
  // Group 4
  { x: 0.68, y: 0.1, group: 4 },
  { x: 0.75, y: 0.16, group: 4 },
  { x: 0.72, y: 0.26, group: 4 },
  // Group 5
  { x: 0.28, y: 0.38, group: 5 },
  { x: 0.35, y: 0.42, group: 5 },
  { x: 0.45, y: 0.38, group: 5 },
  { x: 0.4, y: 0.46, group: 5 },
];

const CONSTELLATION_LINES: ConstellationLine[] = [
  // Group 1 — triangle
  { from: 2, to: 3, group: 1 },
  { from: 3, to: 4, group: 1 },
  { from: 4, to: 0, group: 1 },  // connect to seed
  { from: 0, to: 2, group: 1 },
  // Group 2 — arc
  { from: 5, to: 6, group: 2 },
  { from: 6, to: 7, group: 2 },
  { from: 5, to: 3, group: 2 }, // bridge
  // Group 3 — bridge
  { from: 8, to: 9, group: 3 },
  { from: 9, to: 10, group: 3 },
  { from: 8, to: 7, group: 3 },
  { from: 8, to: 3, group: 3 },
  // Group 4 — right cluster
  { from: 11, to: 12, group: 4 },
  { from: 12, to: 13, group: 4 },
  { from: 11, to: 1, group: 4 },
  { from: 12, to: 9, group: 4 },
  // Group 5 — bottom formation
  { from: 14, to: 15, group: 5 },
  { from: 15, to: 16, group: 5 },
  { from: 16, to: 17, group: 5 },
  { from: 17, to: 15, group: 5 },
  { from: 14, to: 10, group: 5 },
];

const BG_STAR_COUNT = 40;
const BONUS_STARS_PER_ENTRY = 12;
const MAX_EXTRA_STARS = 80;

export function StarField({
  width,
  height,
  entryCount = 0,
}: {
  width: number;
  height: number;
  entryCount?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const bgStarsRef = useRef<Star[]>([]);
  const bonusStarsRef = useRef<Star[]>([]);
  const prevEntryCount = useRef(0);
  // Track constellation reveal progress with animation
  const revealProgress = useRef<number[]>(new Array(6).fill(0));

  // Generate base background stars
  useEffect(() => {
    bgStarsRef.current = Array.from({ length: BG_STAR_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.65,
      size: Math.random() * 1.2 + 0.3,
      opacity: Math.random() * 0.25 + 0.15,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));
  }, [width, height]);

  // Add bonus stars when entryCount increases
  useEffect(() => {
    if (entryCount > prevEntryCount.current) {
      const newStars = entryCount - prevEntryCount.current;
      const count = Math.min(
        newStars * BONUS_STARS_PER_ENTRY,
        MAX_EXTRA_STARS - bonusStarsRef.current.length
      );
      for (let i = 0; i < count; i++) {
        bonusStarsRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height * 0.6,
          size: Math.random() * 1.8 + 0.5,
          opacity: 0, // will fade in
          twinkleSpeed: Math.random() * 0.025 + 0.008,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }
      prevEntryCount.current = entryCount;
    }
  }, [entryCount, width, height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let t = 0;

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.016;

      const activeGroup = Math.min(entryCount, 5);

      // Animate reveal progress
      for (let g = 0; g <= 5; g++) {
        const target = g <= activeGroup ? 1 : 0;
        revealProgress.current[g] += (target - revealProgress.current[g]) * 0.03;
      }

      // Draw background stars
      bgStarsRef.current.forEach((star) => {
        const twinkle =
          Math.sin(t * star.twinkleSpeed * 60 + star.twinkleOffset) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 200, 240, ${star.opacity * twinkle})`;
        ctx.fill();
      });

      // Draw bonus stars (fade in)
      bonusStarsRef.current.forEach((star) => {
        star.opacity = Math.min(star.opacity + 0.008, 0.55 + Math.random() * 0.2);
        const twinkle =
          Math.sin(t * star.twinkleSpeed * 60 + star.twinkleOffset) * 0.35 + 0.65;
        const alpha = star.opacity * twinkle;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 220, 255, ${alpha})`;
        ctx.fill();

        // Glow for larger bonus stars
        if (star.size > 1.3) {
          const grad = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.size * 3
          );
          grad.addColorStop(0, `rgba(160, 200, 255, ${0.18 * alpha})`);
          grad.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }
      });

      // Draw constellation lines
      CONSTELLATION_LINES.forEach((line) => {
        const progress = revealProgress.current[line.group];
        if (progress < 0.01) return;

        const from = CONSTELLATION_STARS[line.from];
        const to = CONSTELLATION_STARS[line.to];
        const fx = from.x * width;
        const fy = from.y * height;
        const tx = to.x * width;
        const ty = to.y * height;

        // Animated line draw
        const ex = fx + (tx - fx) * progress;
        const ey = fy + (ty - fy) * progress;

        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = `rgba(140, 190, 255, ${0.28 * progress})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      // Draw constellation stars
      CONSTELLATION_STARS.forEach((star, i) => {
        const progress = revealProgress.current[star.group];
        if (progress < 0.01) return;

        const x = star.x * width;
        const y = star.y * height;
        const twinkle = Math.sin(t * 0.8 + i * 0.7) * 0.2 + 0.8;
        const alpha = progress * twinkle;

        // Outer glow
        const glowSize = 6 + progress * 4;
        const glow = ctx.createRadialGradient(x, y, 0, x, y, glowSize);
        glow.addColorStop(0, `rgba(160, 210, 255, ${0.35 * alpha})`);
        glow.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(x, y, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Star dot
        const dotSize = 1.5 + progress * 1.2;
        ctx.beginPath();
        ctx.arc(x, y, dotSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210, 235, 255, ${0.9 * alpha})`;
        ctx.fill();
      });

      // Subtle water ripple at bottom
      const rippleY = height * 0.68;
      for (let i = 0; i < 3; i++) {
        const scale = 1 + i * 0.3;
        const alpha =
          (0.05 - i * 0.012) * (Math.sin(t * 1.2 + i * 1.5) * 0.3 + 0.7);
        ctx.beginPath();
        ctx.ellipse(
          width * 0.5,
          rippleY,
          width * 0.35 * scale,
          12 * scale,
          0,
          0,
          Math.PI * 2
        );
        ctx.strokeStyle = `rgba(100, 160, 255, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [width, height, entryCount]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
      }}
    />
  );
}
