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

    // Soft watercolor palette - muted greens like the reference
    const colors = {
      treeTrunk: [
        "rgba(55, 65, 55, 0.25)",
        "rgba(45, 55, 45, 0.22)",
        "rgba(50, 60, 50, 0.20)",
      ],
      foliage: [
        "rgba(75, 105, 75, 0.18)",
        "rgba(85, 115, 80, 0.15)",
        "rgba(70, 100, 70, 0.16)",
        "rgba(80, 110, 78, 0.14)",
        "rgba(65, 95, 68, 0.17)",
      ],
      foliageDeep: [
        "rgba(55, 85, 55, 0.22)",
        "rgba(50, 80, 52, 0.20)",
        "rgba(45, 75, 48, 0.24)",
      ],
    };

    // Tree structures
    interface Tree {
      x: number;
      baseY: number;
      height: number;
      width: number;
      depth: number;
      sway: number;
      phase: number;
    }

    // Foliage clusters (like the dense canopy)
    interface FoliageCluster {
      x: number;
      y: number;
      radius: number;
      color: string;
      phase: number;
      depth: number;
    }

    // Rain lines (continuous vertical lines)
    interface RainLine {
      x: number;
      startY: number;
      length: number;
      speed: number;
      opacity: number;
    }

    let trees: Tree[] = [];
    let foliageClusters: FoliageCluster[] = [];
    let rainLines: RainLine[] = [];

    const initializeElements = () => {
      // Create a few tall trees on the sides
      trees = [];
      const treeCount = 3 + Math.floor(width / 400);
      
      for (let i = 0; i < treeCount; i++) {
        // Trees mostly on the edges, like the reference
        const side = i % 2 === 0;
        const xRange = width * 0.25;
        const x = side 
          ? Math.random() * xRange 
          : width - Math.random() * xRange;
        
        trees.push({
          x,
          baseY: height,
          height: height * (0.5 + Math.random() * 0.4),
          width: 25 + Math.random() * 40,
          depth: 0.3 + Math.random() * 0.7,
          sway: 0.3 + Math.random() * 0.4,
          phase: Math.random() * Math.PI * 2,
        });
      }

      // Create dense foliage clusters for the canopy effect
      foliageClusters = [];
      const clusterCount = Math.floor((width * height) / 8000);
      
      for (let i = 0; i < clusterCount; i++) {
        // Concentrate foliage in upper half and sides
        const isCanopy = Math.random() > 0.3;
        const y = isCanopy 
          ? Math.random() * height * 0.5
          : Math.random() * height;
        const x = Math.random() * width;
        
        // Use deeper colors in corners, lighter in center for depth
        const distFromCenter = Math.abs(x - width / 2) / (width / 2);
        const isDeep = distFromCenter > 0.5 || y < height * 0.3;
        const colorSet = isDeep ? colors.foliageDeep : colors.foliage;
        
        foliageClusters.push({
          x,
          y,
          radius: 30 + Math.random() * 60,
          color: colorSet[Math.floor(Math.random() * colorSet.length)],
          phase: Math.random() * Math.PI * 2,
          depth: 0.2 + Math.random() * 0.8,
        });
      }

      // Create continuous rain lines
      rainLines = [];
      const rainCount = Math.floor(width / 12); // Fewer, more visible lines
      
      for (let i = 0; i < rainCount; i++) {
        rainLines.push({
          x: Math.random() * width,
          startY: Math.random() * height,
          length: height * (0.15 + Math.random() * 0.35), // Long continuous lines
          speed: 2 + Math.random() * 2,
          opacity: 0.08 + Math.random() * 0.12,
        });
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let time = 0;
    let animationId: number;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Very subtle global wind
      const wind = Math.sin(time * 0.08) * 1.5;

      // Draw foliage clusters first (background layer)
      foliageClusters.forEach((cluster) => {
        const sway = Math.sin(time * 0.15 + cluster.phase) * 3 * cluster.depth;
        const x = cluster.x + sway + wind * cluster.depth;
        const y = cluster.y;
        
        // Soft, blurry circular shapes to mimic watercolor texture
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, cluster.radius);
        const baseColor = cluster.color;
        gradient.addColorStop(0, baseColor);
        gradient.addColorStop(0.5, baseColor.replace(/[\d.]+\)$/, `${parseFloat(baseColor.match(/[\d.]+\)$/)?.[0] || "0.15") * 0.6})`));
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, cluster.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw tree trunks
      trees.forEach((tree) => {
        const sway = Math.sin(time * 0.1 + tree.phase) * tree.sway * 8;
        
        // Tree trunk - vertical dark shapes
        const trunkColor = colors.treeTrunk[Math.floor(tree.depth * colors.treeTrunk.length)];
        ctx.fillStyle = trunkColor;
        
        // Draw trunk as a tall tapered shape
        ctx.beginPath();
        const topWidth = tree.width * 0.3;
        const topX = tree.x + sway;
        const bottomX = tree.x;
        
        ctx.moveTo(bottomX - tree.width / 2, tree.baseY);
        ctx.lineTo(bottomX + tree.width / 2, tree.baseY);
        ctx.lineTo(topX + topWidth / 2, tree.baseY - tree.height);
        ctx.lineTo(topX - topWidth / 2, tree.baseY - tree.height);
        ctx.closePath();
        ctx.fill();
      });

      // Draw rain lines - continuous vertical lines like the reference
      ctx.lineCap = "round";
      rainLines.forEach((rain) => {
        // Create a gradient for the rain line - fades at both ends
        const gradient = ctx.createLinearGradient(
          rain.x, rain.startY,
          rain.x, rain.startY + rain.length
        );
        gradient.addColorStop(0, `rgba(180, 195, 190, 0)`);
        gradient.addColorStop(0.1, `rgba(180, 195, 190, ${rain.opacity})`);
        gradient.addColorStop(0.9, `rgba(180, 195, 190, ${rain.opacity})`);
        gradient.addColorStop(1, `rgba(180, 195, 190, 0)`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(rain.x, rain.startY);
        ctx.lineTo(rain.x, rain.startY + rain.length);
        ctx.stroke();

        // Move rain down slowly
        rain.startY += rain.speed;
        
        // Reset when it goes off screen
        if (rain.startY > height) {
          rain.startY = -rain.length;
          rain.x = Math.random() * width;
        }
      });

      time += 0.016;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    // Handle document resize
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
