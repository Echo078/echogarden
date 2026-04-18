"use client";

import { useEffect, useRef } from "react";

export function BotanicalScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Colors
    const colors = {
      stem: ["rgba(74, 103, 65, 0.35)", "rgba(85, 115, 72, 0.30)", "rgba(68, 95, 60, 0.32)"],
      leaf: ["rgba(90, 125, 78, 0.28)", "rgba(100, 135, 88, 0.25)", "rgba(80, 115, 70, 0.26)"],
      branch: ["rgba(110, 95, 80, 0.20)", "rgba(100, 85, 70, 0.18)"],
      flower: ["rgba(200, 185, 170, 0.25)", "rgba(190, 175, 160, 0.22)"],
    };

    // Elegant plant structures
    interface Plant {
      x: number;
      baseY: number;
      height: number;
      type: "stem" | "branch" | "grass";
      phase: number;
      speed: number;
      color: string;
      thickness: number;
      segments: number;
      leaves: { t: number; side: number; length: number; width: number }[];
      hasFlower: boolean;
      flowerPetals: number;
    }

    // Rain drops
    interface RainDrop {
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
    }

    const plants: Plant[] = [];
    const rainDrops: RainDrop[] = [];

    const createPlants = () => {
      plants.length = 0;
      const count = Math.floor(width / 45) + 5;

      for (let i = 0; i < count; i++) {
        const x = (i / count) * width + (Math.random() - 0.5) * 30;
        const type = Math.random() > 0.7 ? "branch" : Math.random() > 0.4 ? "stem" : "grass";
        const heightBase = type === "branch" ? 150 : type === "stem" ? 100 : 60;
        const plantHeight = heightBase + Math.random() * 80;

        const leaves: { t: number; side: number; length: number; width: number }[] = [];
        const leafCount = type === "grass" ? 0 : 2 + Math.floor(Math.random() * 4);
        for (let j = 0; j < leafCount; j++) {
          leaves.push({
            t: 0.2 + Math.random() * 0.6,
            side: Math.random() > 0.5 ? 1 : -1,
            length: 12 + Math.random() * 18,
            width: 4 + Math.random() * 6,
          });
        }

        plants.push({
          x,
          baseY: height,
          height: plantHeight,
          type,
          phase: Math.random() * Math.PI * 2,
          speed: 0.15 + Math.random() * 0.2,
          color: type === "branch" 
            ? colors.branch[Math.floor(Math.random() * colors.branch.length)]
            : colors.stem[Math.floor(Math.random() * colors.stem.length)],
          thickness: type === "branch" ? 1.5 : type === "stem" ? 1 : 0.5,
          segments: 12,
          leaves,
          hasFlower: type === "stem" && Math.random() > 0.65,
          flowerPetals: 5 + Math.floor(Math.random() * 3),
        });
      }

      // Sort by height for depth
      plants.sort((a, b) => a.height - b.height);
    };

    const createRain = () => {
      rainDrops.length = 0;
      const count = Math.floor((width * height) / 8000);
      for (let i = 0; i < count; i++) {
        rainDrops.push({
          x: Math.random() * width,
          y: Math.random() * height,
          length: 8 + Math.random() * 15,
          speed: 2 + Math.random() * 3,
          opacity: 0.03 + Math.random() * 0.06,
        });
      }
    };

    createPlants();
    createRain();

    let time = 0;
    let animationId: number;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw rain
      rainDrops.forEach((drop) => {
        ctx.strokeStyle = `rgba(180, 190, 185, ${drop.opacity})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - 1, drop.y + drop.length);
        ctx.stroke();

        // Update rain position
        drop.y += drop.speed;
        drop.x -= 0.3;
        if (drop.y > height + 20) {
          drop.y = -drop.length;
          drop.x = Math.random() * width;
        }
      });

      // Draw plants
      plants.forEach((plant) => {
        // Calculate curve points with gentle sway
        const points: { x: number; y: number }[] = [];
        for (let i = 0; i <= plant.segments; i++) {
          const t = i / plant.segments;
          const y = plant.baseY - t * plant.height;
          // Organic sway - increases toward top, with slight wind direction
          const windOffset = Math.sin(time * 0.3) * 3;
          const sway = Math.sin(time * plant.speed + plant.phase + t * 1.8) * t * t * 15 + windOffset * t;
          const x = plant.x + sway;
          points.push({ x, y });
        }

        // Draw main stem/branch with tapering
        ctx.strokeStyle = plant.color;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        for (let i = 0; i < points.length - 1; i++) {
          const t = i / (points.length - 1);
          ctx.lineWidth = plant.thickness * (1 - t * 0.7);
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[i + 1].x, points[i + 1].y);
          ctx.stroke();
        }

        // Draw elegant leaves
        plant.leaves.forEach((leaf) => {
          const idx = Math.floor(leaf.t * plant.segments);
          const point = points[Math.min(idx, points.length - 1)];
          const nextPoint = points[Math.min(idx + 1, points.length - 1)];

          const stemAngle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x);
          const leafSway = Math.sin(time * plant.speed * 1.2 + leaf.t * 4) * 0.1;
          const baseAngle = stemAngle + (leaf.side > 0 ? -Math.PI / 2.5 : Math.PI / 2.5) + leafSway;

          // Draw elegant curved leaf
          ctx.fillStyle = colors.leaf[Math.floor(Math.random() * colors.leaf.length)];
          ctx.beginPath();
          const lx = point.x;
          const ly = point.y;
          const tipX = lx + Math.cos(baseAngle) * leaf.length;
          const tipY = ly + Math.sin(baseAngle) * leaf.length;

          // Bezier curves for organic leaf shape
          const cp1x = lx + Math.cos(baseAngle - 0.3) * leaf.length * 0.5;
          const cp1y = ly + Math.sin(baseAngle - 0.3) * leaf.length * 0.5;
          const cp2x = lx + Math.cos(baseAngle + 0.3) * leaf.length * 0.5;
          const cp2y = ly + Math.sin(baseAngle + 0.3) * leaf.length * 0.5;

          ctx.moveTo(lx, ly);
          ctx.quadraticCurveTo(cp1x, cp1y, tipX, tipY);
          ctx.quadraticCurveTo(cp2x, cp2y, lx, ly);
          ctx.fill();

          // Delicate leaf vein
          ctx.strokeStyle = "rgba(60, 85, 55, 0.08)";
          ctx.lineWidth = 0.3;
          ctx.beginPath();
          ctx.moveTo(lx, ly);
          ctx.lineTo(tipX, tipY);
          ctx.stroke();
        });

        // Draw delicate flowers
        if (plant.hasFlower) {
          const tip = points[points.length - 1];
          const flowerColor = colors.flower[Math.floor(Math.random() * colors.flower.length)];

          // Petals
          for (let p = 0; p < plant.flowerPetals; p++) {
            const angle = (p / plant.flowerPetals) * Math.PI * 2 + time * 0.05;
            const petalLength = 6 + Math.sin(time * 0.5 + p) * 1;

            ctx.fillStyle = flowerColor;
            ctx.beginPath();
            const px = tip.x + Math.cos(angle) * 3;
            const py = tip.y + Math.sin(angle) * 3;
            const endX = tip.x + Math.cos(angle) * petalLength;
            const endY = tip.y + Math.sin(angle) * petalLength;

            ctx.ellipse(
              (px + endX) / 2,
              (py + endY) / 2,
              petalLength / 2,
              2.5,
              angle,
              0,
              Math.PI * 2
            );
            ctx.fill();
          }

          // Center
          ctx.fillStyle = "rgba(180, 165, 140, 0.3)";
          ctx.beginPath();
          ctx.arc(tip.x, tip.y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Floating dew particles
      for (let i = 0; i < 12; i++) {
        const angle = time * 0.08 + i * 0.8;
        const radius = 50 + Math.sin(time * 0.1 + i) * 30;
        const cx = width * 0.3 + Math.cos(angle) * radius + i * width * 0.05;
        const cy = height * 0.4 + Math.sin(angle * 0.7) * radius * 0.5;
        const size = 1 + Math.sin(time * 0.3 + i * 1.5) * 0.5;
        const alpha = 0.15 + Math.sin(time * 0.4 + i) * 0.08;

        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(cx, cy, size, 0, Math.PI * 2);
        ctx.fill();
      }

      time += 0.012;
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
      className="absolute inset-0 h-full w-full"
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    />
  );
}
