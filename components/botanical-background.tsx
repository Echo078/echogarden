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

    // Colors - warm ivory and sage green palette
    const colors = {
      stem: [
        "rgba(95, 125, 85, 0.55)",
        "rgba(85, 115, 75, 0.50)",
        "rgba(75, 105, 68, 0.52)",
        "rgba(100, 130, 90, 0.48)",
      ],
      leaf: [
        "rgba(110, 145, 95, 0.45)",
        "rgba(100, 135, 88, 0.42)",
        "rgba(90, 125, 80, 0.40)",
        "rgba(120, 150, 100, 0.38)",
      ],
      branch: [
        "rgba(130, 115, 100, 0.35)",
        "rgba(120, 105, 90, 0.32)",
        "rgba(110, 95, 80, 0.30)",
      ],
      flower: [
        "rgba(220, 200, 180, 0.40)",
        "rgba(210, 190, 170, 0.38)",
        "rgba(230, 210, 190, 0.35)",
        "rgba(200, 180, 160, 0.42)",
      ],
      flowerCenter: "rgba(180, 160, 130, 0.45)",
      rain: "rgba(170, 185, 180, 0.12)",
      dew: "rgba(255, 255, 255, 0.25)",
    };

    // Plant structures
    interface Plant {
      x: number;
      baseY: number;
      height: number;
      type: "branch" | "stem" | "grass" | "fern";
      phase: number;
      speed: number;
      color: string;
      thickness: number;
      segments: number;
      leaves: { t: number; side: number; length: number; width: number; angle: number }[];
      hasFlower: boolean;
      flowerSize: number;
      flowerPetals: number;
      depth: number; // For layering
    }

    // Rain drops
    interface RainDrop {
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
      wind: number;
    }

    // Dew particles
    interface DewParticle {
      x: number;
      y: number;
      size: number;
      phase: number;
      speed: number;
    }

    let plants: Plant[] = [];
    let rainDrops: RainDrop[] = [];
    let dewParticles: DewParticle[] = [];

    const initializeElements = () => {
      // Create plants distributed across the page
      plants = [];
      const plantCount = Math.floor((width * height) / 15000) + 30;

      for (let i = 0; i < plantCount; i++) {
        const x = Math.random() * width;
        const baseY = Math.random() * height * 0.95 + height * 0.05;
        const depth = Math.random(); // 0 = far, 1 = close
        const typeRoll = Math.random();
        const type = typeRoll > 0.75 ? "branch" : typeRoll > 0.45 ? "stem" : typeRoll > 0.2 ? "grass" : "fern";

        const baseHeight = type === "branch" ? 180 : type === "stem" ? 120 : type === "fern" ? 100 : 70;
        const heightVariation = baseHeight * (0.5 + depth * 0.8);
        const plantHeight = heightVariation + Math.random() * 60;

        // Create leaves
        const leaves: Plant["leaves"][] = [];
        const leafCount = type === "grass" ? 0 : type === "fern" ? 8 + Math.floor(Math.random() * 6) : 3 + Math.floor(Math.random() * 5);
        
        for (let j = 0; j < leafCount; j++) {
          leaves.push({
            t: type === "fern" ? 0.1 + (j / leafCount) * 0.8 : 0.15 + Math.random() * 0.7,
            side: type === "fern" ? (j % 2 === 0 ? 1 : -1) : (Math.random() > 0.5 ? 1 : -1),
            length: (type === "fern" ? 15 : 18) + Math.random() * 20 * depth,
            width: 5 + Math.random() * 8,
            angle: -0.3 + Math.random() * 0.6,
          });
        }

        plants.push({
          x,
          baseY,
          height: plantHeight,
          type,
          phase: Math.random() * Math.PI * 2,
          speed: 0.12 + Math.random() * 0.18,
          color: type === "branch"
            ? colors.branch[Math.floor(Math.random() * colors.branch.length)]
            : colors.stem[Math.floor(Math.random() * colors.stem.length)],
          thickness: (type === "branch" ? 2.5 : type === "stem" ? 1.5 : type === "fern" ? 1.2 : 0.8) * (0.5 + depth * 0.8),
          segments: 16,
          leaves,
          hasFlower: type === "stem" && Math.random() > 0.5,
          flowerSize: 8 + Math.random() * 6,
          flowerPetals: 5 + Math.floor(Math.random() * 4),
          depth,
        });
      }

      // Sort by depth for proper layering
      plants.sort((a, b) => a.depth - b.depth);

      // Create rain drops
      rainDrops = [];
      const rainCount = Math.floor((width * height) / 4000);
      for (let i = 0; i < rainCount; i++) {
        rainDrops.push({
          x: Math.random() * width * 1.2,
          y: Math.random() * height,
          length: 12 + Math.random() * 25,
          speed: 4 + Math.random() * 6,
          opacity: 0.06 + Math.random() * 0.08,
          wind: 0.5 + Math.random() * 0.5,
        });
      }

      // Create dew particles
      dewParticles = [];
      const dewCount = Math.floor((width * height) / 20000) + 15;
      for (let i = 0; i < dewCount; i++) {
        dewParticles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: 1.5 + Math.random() * 3,
          phase: Math.random() * Math.PI * 2,
          speed: 0.02 + Math.random() * 0.03,
        });
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let time = 0;
    let animationId: number;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Global wind factor
      const windStrength = Math.sin(time * 0.15) * 0.5 + Math.sin(time * 0.08) * 0.3;

      // Draw rain first (background layer)
      ctx.lineCap = "round";
      rainDrops.forEach((drop) => {
        const gradient = ctx.createLinearGradient(drop.x, drop.y, drop.x - drop.wind * 3, drop.y + drop.length);
        gradient.addColorStop(0, `rgba(170, 185, 180, 0)`);
        gradient.addColorStop(0.3, `rgba(170, 185, 180, ${drop.opacity})`);
        gradient.addColorStop(1, `rgba(170, 185, 180, ${drop.opacity * 0.3})`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - drop.wind * 3, drop.y + drop.length);
        ctx.stroke();

        // Update rain position
        drop.y += drop.speed;
        drop.x -= drop.wind;
        if (drop.y > height + 30) {
          drop.y = -drop.length - Math.random() * 100;
          drop.x = Math.random() * width * 1.2;
        }
      });

      // Draw plants
      plants.forEach((plant) => {
        const depthFactor = 0.3 + plant.depth * 0.7;

        // Calculate curve points with organic sway
        const points: { x: number; y: number }[] = [];
        for (let i = 0; i <= plant.segments; i++) {
          const t = i / plant.segments;
          const y = plant.baseY - t * plant.height;
          
          // Multi-frequency sway for organic movement
          const primarySway = Math.sin(time * plant.speed + plant.phase + t * 2) * t * t * 20;
          const secondarySway = Math.sin(time * plant.speed * 1.7 + plant.phase * 0.5 + t * 3) * t * t * 8;
          const windSway = windStrength * t * t * 12;
          
          const x = plant.x + primarySway + secondarySway + windSway;
          points.push({ x, y });
        }

        // Draw main stem with tapering
        for (let i = 0; i < points.length - 1; i++) {
          const t = i / (points.length - 1);
          const thickness = plant.thickness * (1 - t * 0.75);
          
          ctx.strokeStyle = plant.color;
          ctx.lineWidth = thickness;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[i + 1].x, points[i + 1].y);
          ctx.stroke();
        }

        // Draw leaves
        plant.leaves.forEach((leaf) => {
          const idx = Math.floor(leaf.t * (points.length - 1));
          const point = points[idx];
          const nextPoint = points[Math.min(idx + 1, points.length - 1)];
          
          // Calculate leaf angle based on stem direction
          const stemAngle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x);
          const leafSway = Math.sin(time * plant.speed * 1.3 + leaf.t * 5 + plant.phase) * 0.12;
          const baseAngle = stemAngle + (leaf.side > 0 ? -Math.PI / 2.2 : Math.PI / 2.2) + leaf.angle + leafSway;

          // Draw elegant curved leaf
          const leafColor = colors.leaf[Math.floor(Math.random() * colors.leaf.length)];
          ctx.fillStyle = leafColor;
          
          const lx = point.x;
          const ly = point.y;
          const tipX = lx + Math.cos(baseAngle) * leaf.length * depthFactor;
          const tipY = ly + Math.sin(baseAngle) * leaf.length * depthFactor;

          // Bezier curves for organic leaf shape
          ctx.beginPath();
          ctx.moveTo(lx, ly);
          
          const cp1x = lx + Math.cos(baseAngle - 0.35) * leaf.length * 0.6 * depthFactor;
          const cp1y = ly + Math.sin(baseAngle - 0.35) * leaf.length * 0.6 * depthFactor;
          const cp2x = lx + Math.cos(baseAngle + 0.35) * leaf.length * 0.6 * depthFactor;
          const cp2y = ly + Math.sin(baseAngle + 0.35) * leaf.length * 0.6 * depthFactor;

          ctx.quadraticCurveTo(cp1x, cp1y, tipX, tipY);
          ctx.quadraticCurveTo(cp2x, cp2y, lx, ly);
          ctx.fill();

          // Leaf vein
          ctx.strokeStyle = "rgba(60, 85, 55, 0.12)";
          ctx.lineWidth = 0.4;
          ctx.beginPath();
          ctx.moveTo(lx, ly);
          ctx.lineTo(tipX, tipY);
          ctx.stroke();
        });

        // Draw flowers
        if (plant.hasFlower && points.length > 0) {
          const tip = points[points.length - 1];
          const flowerColor = colors.flower[Math.floor(Math.random() * colors.flower.length)];
          const petalSize = plant.flowerSize * depthFactor;

          // Petals
          for (let p = 0; p < plant.flowerPetals; p++) {
            const angle = (p / plant.flowerPetals) * Math.PI * 2 + time * 0.03;
            const petalSway = Math.sin(time * 0.5 + p * 0.8) * 0.8;
            
            ctx.fillStyle = flowerColor;
            ctx.beginPath();
            
            const petalLength = petalSize + petalSway;
            const centerX = tip.x + Math.cos(angle) * 2;
            const centerY = tip.y + Math.sin(angle) * 2;
            const endX = tip.x + Math.cos(angle) * petalLength;
            const endY = tip.y + Math.sin(angle) * petalLength;

            ctx.ellipse(
              (centerX + endX) / 2,
              (centerY + endY) / 2,
              petalLength / 2,
              petalSize / 4,
              angle,
              0,
              Math.PI * 2
            );
            ctx.fill();
          }

          // Flower center
          ctx.fillStyle = colors.flowerCenter;
          ctx.beginPath();
          ctx.arc(tip.x, tip.y, petalSize * 0.25, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw dew particles (floating luminous dots)
      dewParticles.forEach((dew) => {
        const pulse = Math.sin(time * dew.speed * 10 + dew.phase) * 0.5 + 0.5;
        const alpha = 0.15 + pulse * 0.2;
        const size = dew.size * (0.8 + pulse * 0.4);

        // Gentle floating motion
        const floatX = Math.sin(time * 0.1 + dew.phase) * 15;
        const floatY = Math.sin(time * 0.07 + dew.phase * 1.3) * 10;

        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(dew.x + floatX, dew.y + floatY, size, 0, Math.PI * 2);
        ctx.fill();

        // Soft glow
        const gradient = ctx.createRadialGradient(
          dew.x + floatX, dew.y + floatY, 0,
          dew.x + floatX, dew.y + floatY, size * 3
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.3})`);
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(dew.x + floatX, dew.y + floatY, size * 3, 0, Math.PI * 2);
        ctx.fill();
      });

      time += 0.016;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    // Handle scroll to update canvas height
    const handleScroll = () => {
      const newHeight = document.documentElement.scrollHeight;
      if (Math.abs(newHeight - height) > 100) {
        resizeCanvas();
      }
    };

    const resizeObserver = new ResizeObserver(handleScroll);
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
