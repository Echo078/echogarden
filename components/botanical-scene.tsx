"use client";

import { useEffect, useRef } from "react";

export function BotanicalScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Plant elements
    interface Stem {
      x: number;
      baseY: number;
      height: number;
      width: number;
      segments: number;
      phase: number;
      speed: number;
      color: string;
      hasFlower: boolean;
      flowerSize: number;
      flowerColor: string;
      leaves: { pos: number; side: number; size: number }[];
    }

    const stems: Stem[] = [];
    const colors = {
      stem: ["rgba(74, 103, 65, 0.6)", "rgba(85, 120, 75, 0.5)", "rgba(65, 95, 58, 0.55)"],
      leaf: ["rgba(90, 130, 80, 0.5)", "rgba(100, 140, 90, 0.45)", "rgba(80, 120, 70, 0.5)"],
      flower: ["rgba(180, 160, 140, 0.4)", "rgba(200, 180, 160, 0.35)", "rgba(170, 150, 130, 0.4)"],
    };

    // Create stems
    const createStems = () => {
      stems.length = 0;
      const rect = canvas.getBoundingClientRect();
      const count = Math.floor(rect.width / 60) + 3;

      for (let i = 0; i < count; i++) {
        const x = (i / count) * rect.width + (Math.random() - 0.5) * 40;
        const height = 80 + Math.random() * 120;
        const leaves: { pos: number; side: number; size: number }[] = [];
        const leafCount = 2 + Math.floor(Math.random() * 3);
        for (let j = 0; j < leafCount; j++) {
          leaves.push({
            pos: 0.3 + Math.random() * 0.5,
            side: Math.random() > 0.5 ? 1 : -1,
            size: 8 + Math.random() * 12,
          });
        }

        stems.push({
          x,
          baseY: rect.height,
          height,
          width: 1 + Math.random() * 1.5,
          segments: 8,
          phase: Math.random() * Math.PI * 2,
          speed: 0.3 + Math.random() * 0.4,
          color: colors.stem[Math.floor(Math.random() * colors.stem.length)],
          hasFlower: Math.random() > 0.6,
          flowerSize: 4 + Math.random() * 6,
          flowerColor: colors.flower[Math.floor(Math.random() * colors.flower.length)],
          leaves,
        });
      }
    };
    createStems();

    let animationId: number;
    let time = 0;

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Draw each stem
      stems.forEach((stem) => {
        ctx.strokeStyle = stem.color;
        ctx.lineWidth = stem.width;
        ctx.lineCap = "round";

        // Calculate stem curve points
        const points: { x: number; y: number }[] = [];
        for (let i = 0; i <= stem.segments; i++) {
          const t = i / stem.segments;
          const y = stem.baseY - t * stem.height;
          // Gentle sway - stronger at top
          const sway = Math.sin(time * stem.speed + stem.phase + t * 2) * t * 12;
          const x = stem.x + sway;
          points.push({ x, y });
        }

        // Draw stem
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          const prev = points[i - 1];
          const curr = points[i];
          const cpX = (prev.x + curr.x) / 2;
          const cpY = (prev.y + curr.y) / 2;
          ctx.quadraticCurveTo(prev.x, prev.y, cpX, cpY);
        }
        ctx.stroke();

        // Draw leaves
        stem.leaves.forEach((leaf) => {
          const idx = Math.floor(leaf.pos * stem.segments);
          const point = points[Math.min(idx, points.length - 1)];
          const nextPoint = points[Math.min(idx + 1, points.length - 1)];
          
          // Leaf angle follows stem
          const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x);
          const leafAngle = angle + (leaf.side * Math.PI / 3) + Math.sin(time * stem.speed + leaf.pos * 3) * 0.15;

          ctx.fillStyle = colors.leaf[Math.floor(Math.random() * colors.leaf.length)];
          ctx.beginPath();
          const lx = point.x;
          const ly = point.y;
          const ex = lx + Math.cos(leafAngle) * leaf.size;
          const ey = ly + Math.sin(leafAngle) * leaf.size;
          const cp1x = lx + Math.cos(leafAngle - 0.5) * leaf.size * 0.6;
          const cp1y = ly + Math.sin(leafAngle - 0.5) * leaf.size * 0.6;
          const cp2x = lx + Math.cos(leafAngle + 0.5) * leaf.size * 0.6;
          const cp2y = ly + Math.sin(leafAngle + 0.5) * leaf.size * 0.6;
          ctx.moveTo(lx, ly);
          ctx.quadraticCurveTo(cp1x, cp1y, ex, ey);
          ctx.quadraticCurveTo(cp2x, cp2y, lx, ly);
          ctx.fill();
        });

        // Draw flower
        if (stem.hasFlower) {
          const tip = points[points.length - 1];
          ctx.fillStyle = stem.flowerColor;
          for (let p = 0; p < 5; p++) {
            const pAngle = (p / 5) * Math.PI * 2 + time * 0.1;
            ctx.beginPath();
            ctx.ellipse(
              tip.x + Math.cos(pAngle) * stem.flowerSize * 0.5,
              tip.y + Math.sin(pAngle) * stem.flowerSize * 0.5,
              stem.flowerSize * 0.4,
              stem.flowerSize * 0.6,
              pAngle,
              0,
              Math.PI * 2
            );
            ctx.fill();
          }
          // Center
          ctx.fillStyle = "rgba(200, 180, 140, 0.5)";
          ctx.beginPath();
          ctx.arc(tip.x, tip.y, stem.flowerSize * 0.3, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Floating particles (pollen/dew)
      for (let i = 0; i < 8; i++) {
        const px = (Math.sin(time * 0.2 + i * 1.5) * 0.5 + 0.5) * rect.width;
        const py = (Math.cos(time * 0.15 + i * 2) * 0.3 + 0.4) * rect.height;
        const size = 1.5 + Math.sin(time + i) * 0.5;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.2 + Math.sin(time * 0.5 + i) * 0.1})`;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
      }

      time += 0.016;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full opacity-70"
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    />
  );
}
