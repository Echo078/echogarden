"use client";

import { useEffect, useRef } from "react";

export function BotanicalBackground() {
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
      width = window.innerWidth;
      height = document.documentElement.scrollHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      initializeElements();
    };

    // Soft sage green palette
    const stemColor = "rgba(90, 115, 85, 0.35)";
    const leafColors = [
      "rgba(95, 125, 90, 0.25)",
      "rgba(85, 115, 80, 0.28)",
      "rgba(100, 130, 95, 0.22)",
      "rgba(80, 110, 78, 0.26)",
    ];
    const flowerColors = [
      "rgba(205, 180, 165, 0.35)",  // soft cream
      "rgba(195, 170, 175, 0.32)",  // soft rose
      "rgba(180, 175, 190, 0.30)",  // soft lavender
      "rgba(200, 185, 160, 0.33)",  // soft yellow
    ];

    interface Stem {
      x: number;
      baseY: number;
      height: number;
      curve: number;
      phase: number;
      leaves: Leaf[];
      flower: Flower | null;
    }

    interface Leaf {
      offsetY: number;
      side: number;
      size: number;
      angle: number;
      color: string;
    }

    interface Flower {
      size: number;
      petalCount: number;
      color: string;
      innerColor: string;
    }

    interface RainLine {
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
    }

    let stems: Stem[] = [];
    let rainLines: RainLine[] = [];

    const initializeElements = () => {
      stems = [];
      
      // Create elegant stems with leaves and flowers
      const stemCount = Math.floor(width / 100) + 4;
      
      for (let i = 0; i < stemCount; i++) {
        const x = (i / stemCount) * width + (Math.random() - 0.5) * 80;
        const baseHeight = 120 + Math.random() * 200;
        
        // Create leaves along the stem
        const leaves: Leaf[] = [];
        const leafCount = 2 + Math.floor(Math.random() * 4);
        for (let j = 0; j < leafCount; j++) {
          leaves.push({
            offsetY: 0.2 + (j / leafCount) * 0.6,
            side: j % 2 === 0 ? -1 : 1,
            size: 15 + Math.random() * 20,
            angle: (Math.random() - 0.5) * 0.5,
            color: leafColors[Math.floor(Math.random() * leafColors.length)],
          });
        }

        // Some stems have flowers
        const hasFlower = Math.random() > 0.4;
        const flower: Flower | null = hasFlower ? {
          size: 8 + Math.random() * 12,
          petalCount: 5 + Math.floor(Math.random() * 3),
          color: flowerColors[Math.floor(Math.random() * flowerColors.length)],
          innerColor: "rgba(180, 160, 120, 0.4)",
        } : null;

        stems.push({
          x,
          baseY: height + 20,
          height: baseHeight,
          curve: (Math.random() - 0.5) * 40,
          phase: Math.random() * Math.PI * 2,
          leaves,
          flower,
        });
      }

      // Create rain lines - thin continuous vertical lines
      rainLines = [];
      const rainCount = Math.floor(width / 20);
      
      for (let i = 0; i < rainCount; i++) {
        rainLines.push({
          x: Math.random() * width,
          y: Math.random() * height * 2 - height,
          length: 40 + Math.random() * 80,
          speed: 3 + Math.random() * 2,
          opacity: 0.06 + Math.random() * 0.08,
        });
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let time = 0;
    let animationId: number;

    // Draw a leaf shape
    const drawLeaf = (
      x: number,
      y: number,
      size: number,
      angle: number,
      color: string
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      
      ctx.fillStyle = color;
      ctx.beginPath();
      
      // Elegant oval leaf shape
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        size * 0.3, -size * 0.15,
        size * 0.8, -size * 0.1,
        size, 0
      );
      ctx.bezierCurveTo(
        size * 0.8, size * 0.1,
        size * 0.3, size * 0.15,
        0, 0
      );
      ctx.fill();
      
      // Subtle leaf vein
      ctx.strokeStyle = color.replace(/[\d.]+\)$/, "0.15)");
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(size * 0.8, 0);
      ctx.stroke();
      
      ctx.restore();
    };

    // Draw a simple flower
    const drawFlower = (
      x: number,
      y: number,
      flower: Flower,
      sway: number
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(sway * 0.05);

      // Draw petals
      const petalSize = flower.size;
      for (let i = 0; i < flower.petalCount; i++) {
        const angle = (i / flower.petalCount) * Math.PI * 2;
        ctx.save();
        ctx.rotate(angle);
        
        ctx.fillStyle = flower.color;
        ctx.beginPath();
        ctx.ellipse(petalSize * 0.6, 0, petalSize, petalSize * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      }

      // Flower center
      ctx.fillStyle = flower.innerColor;
      ctx.beginPath();
      ctx.arc(0, 0, flower.size * 0.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Gentle wind
      const wind = Math.sin(time * 0.3) * 1.5;

      // Draw stems with leaves and flowers
      stems.forEach((stem) => {
        const sway = Math.sin(time * 0.5 + stem.phase) * 8 + wind * 2;
        
        // Calculate stem curve points
        const topX = stem.x + stem.curve + sway;
        const topY = stem.baseY - stem.height;
        const midX = stem.x + stem.curve * 0.5 + sway * 0.5;
        const midY = stem.baseY - stem.height * 0.5;

        // Draw stem
        ctx.strokeStyle = stemColor;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(stem.x, stem.baseY);
        ctx.quadraticCurveTo(midX, midY, topX, topY);
        ctx.stroke();

        // Draw leaves
        stem.leaves.forEach((leaf) => {
          const leafProgress = leaf.offsetY;
          const leafX = stem.x + (topX - stem.x) * leafProgress + (sway * leafProgress * 0.3);
          const leafY = stem.baseY - stem.height * leafProgress;
          const leafSway = Math.sin(time * 0.6 + stem.phase + leaf.offsetY * 2) * 0.15;
          
          drawLeaf(
            leafX,
            leafY,
            leaf.size,
            leaf.angle + leaf.side * (0.4 + leafSway),
            leaf.color
          );
        });

        // Draw flower at top
        if (stem.flower) {
          drawFlower(topX, topY - 5, stem.flower, sway);
        }
      });

      // Draw rain - thin continuous lines
      ctx.lineCap = "round";
      rainLines.forEach((rain) => {
        const gradient = ctx.createLinearGradient(
          rain.x, rain.y,
          rain.x, rain.y + rain.length
        );
        gradient.addColorStop(0, `rgba(160, 175, 170, 0)`);
        gradient.addColorStop(0.15, `rgba(160, 175, 170, ${rain.opacity})`);
        gradient.addColorStop(0.85, `rgba(160, 175, 170, ${rain.opacity})`);
        gradient.addColorStop(1, `rgba(160, 175, 170, 0)`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(rain.x, rain.y);
        ctx.lineTo(rain.x, rain.y + rain.length);
        ctx.stroke();

        // Move rain down
        rain.y += rain.speed;

        // Reset when off screen
        if (rain.y > height + rain.length) {
          rain.y = -rain.length;
          rain.x = Math.random() * width;
        }
      });

      time += 0.016;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    const resizeObserver = new ResizeObserver(() => {
      const newHeight = document.documentElement.scrollHeight;
      if (Math.abs(newHeight - height) > 100) {
        resizeCanvas();
      }
    });
    resizeObserver.observe(document.body);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ top: 0, left: 0 }}
      aria-hidden="true"
    />
  );
}
