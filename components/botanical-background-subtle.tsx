"use client";

import { useEffect, useRef } from "react";

interface Plant {
  x: number;
  baseY: number;
  stemHeight: number;
  phase: number;
  swaySpeed: number;
  swayAmount: number;
  leaves: { angle: number; length: number; side: number }[];
  hasFlower: boolean;
  flowerColor: string;
  opacity: number;
}

interface RainLine {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
}

export function BotanicalBackgroundSubtle() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let plants: Plant[] = [];
    let rainLines: RainLine[] = [];

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      initScene();
    };

    const initScene = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Sparse plants - only on edges and corners
      plants = [];
      const plantCount = Math.floor(w / 300) + 2;

      // Bottom left corner plants
      for (let i = 0; i < Math.ceil(plantCount / 3); i++) {
        plants.push(createPlant(
          30 + Math.random() * (w * 0.15),
          h,
          0.5 + Math.random() * 0.4
        ));
      }

      // Bottom right corner plants
      for (let i = 0; i < Math.ceil(plantCount / 3); i++) {
        plants.push(createPlant(
          w * 0.85 + Math.random() * (w * 0.15 - 30),
          h,
          0.5 + Math.random() * 0.4
        ));
      }

      // A few scattered along the bottom
      for (let i = 0; i < Math.ceil(plantCount / 4); i++) {
        plants.push(createPlant(
          w * 0.2 + Math.random() * (w * 0.6),
          h,
          0.3 + Math.random() * 0.3
        ));
      }

      // Rain lines - gentle drizzle
      rainLines = [];
      const rainCount = Math.floor((w * h) / 12000);
      for (let i = 0; i < rainCount; i++) {
        rainLines.push(createRainLine(w, h));
      }
    };

    const createPlant = (x: number, baseY: number, scale: number): Plant => {
      const stemHeight = (60 + Math.random() * 100) * scale;
      const leafCount = Math.floor(2 + Math.random() * 3);
      const leaves = [];

      for (let i = 0; i < leafCount; i++) {
        leaves.push({
          angle: 0.3 + Math.random() * 0.5,
          length: (15 + Math.random() * 20) * scale,
          side: Math.random() > 0.5 ? 1 : -1,
        });
      }

      const flowerColors = [
        "rgba(250, 245, 240, 0.5)",
        "rgba(230, 210, 200, 0.4)",
        "rgba(200, 180, 170, 0.4)",
      ];

      return {
        x,
        baseY,
        stemHeight,
        phase: Math.random() * Math.PI * 2,
        swaySpeed: 0.3 + Math.random() * 0.3,
        swayAmount: 2 + Math.random() * 3,
        leaves,
        hasFlower: Math.random() > 0.4,
        flowerColor: flowerColors[Math.floor(Math.random() * flowerColors.length)],
        opacity: 0.15 + Math.random() * 0.15,
      };
    };

    const createRainLine = (w: number, h: number): RainLine => ({
      x: Math.random() * w,
      y: Math.random() * h - h,
      length: 25 + Math.random() * 40,
      speed: 1.5 + Math.random() * 1,
      opacity: 0.08 + Math.random() * 0.12,
    });

    const drawPlant = (plant: Plant, time: number) => {
      const sway = Math.sin(time * plant.swaySpeed + plant.phase) * plant.swayAmount;
      const tipX = plant.x + sway;
      const tipY = plant.baseY - plant.stemHeight;

      ctx.save();
      ctx.globalAlpha = plant.opacity;

      // Stem
      ctx.beginPath();
      ctx.moveTo(plant.x, plant.baseY);
      ctx.quadraticCurveTo(
        plant.x + sway * 0.5,
        plant.baseY - plant.stemHeight * 0.5,
        tipX,
        tipY
      );
      ctx.strokeStyle = "rgba(120, 140, 110, 0.6)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Leaves
      plant.leaves.forEach((leaf, i) => {
        const leafY = plant.baseY - plant.stemHeight * (0.3 + i * 0.2);
        const leafSway = sway * (0.3 + i * 0.2);
        const stemX = plant.x + leafSway;

        ctx.beginPath();
        ctx.moveTo(stemX, leafY);
        ctx.quadraticCurveTo(
          stemX + leaf.side * leaf.length * 0.6,
          leafY - leaf.length * 0.3,
          stemX + leaf.side * leaf.length * Math.cos(leaf.angle),
          leafY - leaf.length * Math.sin(leaf.angle) * 0.5
        );
        ctx.strokeStyle = "rgba(100, 130, 90, 0.5)";
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Flower
      if (plant.hasFlower) {
        ctx.beginPath();
        ctx.arc(tipX, tipY, 4, 0, Math.PI * 2);
        ctx.fillStyle = plant.flowerColor;
        ctx.fill();
      }

      ctx.restore();
    };

    const drawRain = (h: number) => {
      rainLines.forEach((line) => {
        ctx.beginPath();
        ctx.moveTo(line.x, line.y);
        ctx.lineTo(line.x + 2, line.y + line.length);
        ctx.strokeStyle = `rgba(160, 175, 180, ${line.opacity})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });
    };

    const updateRain = (h: number) => {
      rainLines.forEach((line) => {
        line.y += line.speed;
        line.x += 0.3;
        if (line.y > h + 20) {
          line.y = -line.length - Math.random() * 100;
          line.x = Math.random() * window.innerWidth;
        }
      });
    };

    const animate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const time = Date.now() / 1000;

      ctx.clearRect(0, 0, w, h);

      // Draw rain
      drawRain(h);
      updateRain(h);

      // Draw plants
      plants.forEach((plant) => drawPlant(plant, time));

      animationId = requestAnimationFrame(animate);
    };

    resize();
    animate();

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10"
      aria-hidden="true"
    />
  );
}
