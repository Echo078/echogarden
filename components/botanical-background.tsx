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

    // More visible colors
    const stemColor = "rgba(75, 100, 70, 0.5)";
    const leafColors = [
      "rgba(80, 115, 75, 0.45)",
      "rgba(70, 105, 65, 0.48)",
      "rgba(90, 120, 85, 0.42)",
      "rgba(65, 100, 62, 0.46)",
    ];
    const flowerColors = [
      "rgba(220, 190, 175, 0.55)",  // soft cream
      "rgba(210, 170, 180, 0.52)",  // soft rose
      "rgba(190, 180, 205, 0.50)",  // soft lavender
      "rgba(215, 200, 165, 0.53)",  // soft yellow
      "rgba(200, 175, 190, 0.50)",  // soft pink
    ];

    interface Stem {
      x: number;
      baseY: number;
      height: number;
      curve: number;
      phase: number;
      leaves: Leaf[];
      flower: Flower | null;
      layer: number; // 0 = back, 1 = mid, 2 = front
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
      width: number;
    }

    interface Butterfly {
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      wingPhase: number;
      speed: number;
      size: number;
      color: string;
      wingColor: string;
    }

    interface Bee {
      x: number;
      y: number;
      angle: number;
      orbitRadius: number;
      orbitSpeed: number;
      centerX: number;
      centerY: number;
      size: number;
      wingPhase: number;
    }

    let stems: Stem[] = [];
    let rainLines: RainLine[] = [];
    let butterflies: Butterfly[] = [];
    let bees: Bee[] = [];

    const initializeElements = () => {
      stems = [];
      
      // Create more stems distributed across different layers
      const stemCount = Math.floor(width / 70) + 8;
      
      for (let i = 0; i < stemCount; i++) {
        const layer = Math.floor(Math.random() * 3); // 0, 1, or 2
        const x = (i / stemCount) * width + (Math.random() - 0.5) * 100;
        
        // Different heights based on layer
        const baseHeight = layer === 0 
          ? 150 + Math.random() * 200 
          : layer === 1 
            ? 200 + Math.random() * 300 
            : 280 + Math.random() * 350;
        
        // Create leaves along the stem
        const leaves: Leaf[] = [];
        const leafCount = 2 + Math.floor(Math.random() * 5);
        for (let j = 0; j < leafCount; j++) {
          leaves.push({
            offsetY: 0.15 + (j / leafCount) * 0.65,
            side: j % 2 === 0 ? -1 : 1,
            size: (layer === 2 ? 20 : 12) + Math.random() * 18,
            angle: (Math.random() - 0.5) * 0.6,
            color: leafColors[Math.floor(Math.random() * leafColors.length)],
          });
        }

        // More flowers
        const hasFlower = Math.random() > 0.3;
        const flower: Flower | null = hasFlower ? {
          size: (layer === 2 ? 12 : 8) + Math.random() * 14,
          petalCount: 5 + Math.floor(Math.random() * 4),
          color: flowerColors[Math.floor(Math.random() * flowerColors.length)],
          innerColor: "rgba(200, 180, 130, 0.5)",
        } : null;

        stems.push({
          x,
          baseY: height + 30,
          height: baseHeight,
          curve: (Math.random() - 0.5) * 50,
          phase: Math.random() * Math.PI * 2,
          leaves,
          flower,
          layer,
        });
      }

      // Sort by layer so back ones draw first
      stems.sort((a, b) => a.layer - b.layer);

      // Gentle rain lines - smaller and slower
      rainLines = [];
      const rainCount = Math.floor(width / 12);
      
      for (let i = 0; i < rainCount; i++) {
        rainLines.push({
          x: Math.random() * width,
          y: Math.random() * height * 2 - height,
          length: 30 + Math.random() * 50,
          speed: 1.5 + Math.random() * 1.5,
          opacity: 0.15 + Math.random() * 0.15,
          width: 0.5 + Math.random() * 0.5,
        });
      }

      // Create butterflies
      butterflies = [];
      const butterflyCount = 3 + Math.floor(Math.random() * 3);
      const butterflyColors = [
        { body: "rgba(180, 140, 100, 0.7)", wing: "rgba(230, 210, 180, 0.5)" },
        { body: "rgba(160, 130, 110, 0.7)", wing: "rgba(220, 200, 220, 0.5)" },
        { body: "rgba(140, 120, 100, 0.7)", wing: "rgba(200, 220, 210, 0.5)" },
      ];
      
      for (let i = 0; i < butterflyCount; i++) {
        const colors = butterflyColors[Math.floor(Math.random() * butterflyColors.length)];
        butterflies.push({
          x: Math.random() * width,
          y: 100 + Math.random() * (height * 0.5),
          targetX: Math.random() * width,
          targetY: 100 + Math.random() * (height * 0.5),
          wingPhase: Math.random() * Math.PI * 2,
          speed: 0.15 + Math.random() * 0.2,
          size: 8 + Math.random() * 6,
          color: colors.body,
          wingColor: colors.wing,
        });
      }

      // Create bees
      bees = [];
      const beeCount = 2 + Math.floor(Math.random() * 2);
      
      for (let i = 0; i < beeCount; i++) {
        const centerX = width * 0.2 + Math.random() * width * 0.6;
        const centerY = height * 0.2 + Math.random() * height * 0.3;
        bees.push({
          x: centerX,
          y: centerY,
          angle: Math.random() * Math.PI * 2,
          orbitRadius: 30 + Math.random() * 50,
          orbitSpeed: 0.006 + Math.random() * 0.004,
          centerX,
          centerY,
          size: 5 + Math.random() * 3,
          wingPhase: Math.random() * Math.PI * 2,
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
      color: string,
      opacity: number
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.globalAlpha = opacity;
      
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        size * 0.3, -size * 0.18,
        size * 0.8, -size * 0.12,
        size, 0
      );
      ctx.bezierCurveTo(
        size * 0.8, size * 0.12,
        size * 0.3, size * 0.18,
        0, 0
      );
      ctx.fill();
      
      // Leaf vein
      ctx.strokeStyle = "rgba(60, 80, 55, 0.3)";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(2, 0);
      ctx.lineTo(size * 0.85, 0);
      ctx.stroke();
      
      ctx.restore();
    };

    // Draw a flower
    const drawFlower = (
      x: number,
      y: number,
      flower: Flower,
      sway: number,
      opacity: number
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(sway * 0.04);
      ctx.globalAlpha = opacity;

      const petalSize = flower.size;
      for (let i = 0; i < flower.petalCount; i++) {
        const angle = (i / flower.petalCount) * Math.PI * 2;
        ctx.save();
        ctx.rotate(angle);
        
        ctx.fillStyle = flower.color;
        ctx.beginPath();
        ctx.ellipse(petalSize * 0.6, 0, petalSize, petalSize * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      }

      ctx.fillStyle = flower.innerColor;
      ctx.beginPath();
      ctx.arc(0, 0, flower.size * 0.35, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // Draw a butterfly
    const drawButterfly = (butterfly: Butterfly) => {
      ctx.save();
      ctx.translate(butterfly.x, butterfly.y);
      
      const dx = butterfly.targetX - butterfly.x;
      const flyAngle = Math.atan2(0, dx);
      ctx.rotate(flyAngle);

      const wingFlap = Math.sin(butterfly.wingPhase) * 0.6;
      const size = butterfly.size;

      // Wings
      ctx.fillStyle = butterfly.wingColor;
      
      // Left wing
      ctx.save();
      ctx.rotate(-0.3 + wingFlap);
      ctx.beginPath();
      ctx.ellipse(-size * 0.5, 0, size * 1.2, size * 0.8, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      
      // Right wing
      ctx.save();
      ctx.rotate(0.3 - wingFlap);
      ctx.beginPath();
      ctx.ellipse(size * 0.5, 0, size * 1.2, size * 0.8, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Body
      ctx.fillStyle = butterfly.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.2, size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // Draw a bee
    const drawBee = (bee: Bee) => {
      ctx.save();
      ctx.translate(bee.x, bee.y);

      const wingFlap = Math.sin(bee.wingPhase * 8) * 0.4;
      const size = bee.size;

      // Wings
      ctx.fillStyle = "rgba(200, 210, 220, 0.4)";
      ctx.save();
      ctx.rotate(-0.5 + wingFlap);
      ctx.beginPath();
      ctx.ellipse(-size * 0.4, -size * 0.3, size * 0.8, size * 0.4, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      
      ctx.save();
      ctx.rotate(0.5 - wingFlap);
      ctx.beginPath();
      ctx.ellipse(size * 0.4, -size * 0.3, size * 0.8, size * 0.4, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Body - yellow with stripes
      ctx.fillStyle = "rgba(220, 190, 80, 0.7)";
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.5, size * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Stripes
      ctx.strokeStyle = "rgba(60, 50, 30, 0.5)";
      ctx.lineWidth = size * 0.15;
      ctx.beginPath();
      ctx.moveTo(-size * 0.4, 0);
      ctx.lineTo(size * 0.4, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-size * 0.3, size * 0.35);
      ctx.lineTo(size * 0.3, size * 0.35);
      ctx.stroke();

      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const wind = Math.sin(time * 0.25) * 2;

      // Draw stems with leaves and flowers
      stems.forEach((stem) => {
        const layerOpacity = stem.layer === 0 ? 0.6 : stem.layer === 1 ? 0.8 : 1;
        const sway = Math.sin(time * 0.4 + stem.phase) * 10 + wind * 2;
        
        const topX = stem.x + stem.curve + sway;
        const topY = stem.baseY - stem.height;
        const midX = stem.x + stem.curve * 0.5 + sway * 0.5;
        const midY = stem.baseY - stem.height * 0.5;

        // Stem
        ctx.globalAlpha = layerOpacity;
        ctx.strokeStyle = stemColor;
        ctx.lineWidth = stem.layer === 2 ? 2.5 : stem.layer === 1 ? 2 : 1.5;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(stem.x, stem.baseY);
        ctx.quadraticCurveTo(midX, midY, topX, topY);
        ctx.stroke();

        // Leaves
        stem.leaves.forEach((leaf) => {
          const leafProgress = leaf.offsetY;
          const leafX = stem.x + (topX - stem.x) * leafProgress + (sway * leafProgress * 0.3);
          const leafY = stem.baseY - stem.height * leafProgress;
          const leafSway = Math.sin(time * 0.5 + stem.phase + leaf.offsetY * 2) * 0.12;
          
          drawLeaf(
            leafX,
            leafY,
            leaf.size,
            leaf.angle + leaf.side * (0.45 + leafSway),
            leaf.color,
            layerOpacity
          );
        });

        // Flower
        if (stem.flower) {
          drawFlower(topX, topY - 6, stem.flower, sway, layerOpacity);
        }
        
        ctx.globalAlpha = 1;
      });

      // Draw butterflies
      butterflies.forEach((butterfly) => {
        drawButterfly(butterfly);
        
        // Update butterfly position - gentle floating
        const dx = butterfly.targetX - butterfly.x;
        const dy = butterfly.targetY - butterfly.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 10) {
          // Pick new target
          butterfly.targetX = Math.random() * width;
          butterfly.targetY = 80 + Math.random() * (height * 0.5);
        } else {
          butterfly.x += (dx / dist) * butterfly.speed;
          butterfly.y += (dy / dist) * butterfly.speed + Math.sin(time * 2 + butterfly.wingPhase) * 0.5;
        }
        
        butterfly.wingPhase += 0.08;
      });

      // Draw bees
      bees.forEach((bee) => {
        drawBee(bee);
        
        // Update bee - orbit around a point
        bee.angle += bee.orbitSpeed;
        bee.x = bee.centerX + Math.cos(bee.angle) * bee.orbitRadius;
        bee.y = bee.centerY + Math.sin(bee.angle * 0.7) * bee.orbitRadius * 0.6;
        
        // Slowly move orbit center
        bee.centerX += Math.sin(time * 0.05 + bee.angle) * 0.08;
        bee.centerY += Math.cos(time * 0.04 + bee.angle) * 0.06;
        
        // Keep in bounds
        if (bee.centerX < 50) bee.centerX = 50;
        if (bee.centerX > width - 50) bee.centerX = width - 50;
        if (bee.centerY < 50) bee.centerY = 50;
        if (bee.centerY > height * 0.6) bee.centerY = height * 0.6;
        
        bee.wingPhase += 0.3;
      });

      // Draw rain - more visible thin lines
      rainLines.forEach((rain) => {
        const gradient = ctx.createLinearGradient(
          rain.x, rain.y,
          rain.x + 2, rain.y + rain.length
        );
        gradient.addColorStop(0, `rgba(140, 160, 165, 0)`);
        gradient.addColorStop(0.1, `rgba(140, 160, 165, ${rain.opacity})`);
        gradient.addColorStop(0.9, `rgba(140, 160, 165, ${rain.opacity})`);
        gradient.addColorStop(1, `rgba(140, 160, 165, 0)`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = rain.width;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(rain.x, rain.y);
        ctx.lineTo(rain.x + 2, rain.y + rain.length);
        ctx.stroke();

        rain.y += rain.speed;

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
