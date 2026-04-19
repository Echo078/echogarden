"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/components/language-provider";
import { getVisitorMessages, submitVisitorMessage } from "@/lib/actions";
import type { VisitorMessage } from "@/lib/database.types";

export function EchoWall() {
  const { lang } = useLanguage();
  const [messages, setMessages] = useState<VisitorMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Form state
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Auto-scroll state for messages
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const t = {
    title: lang === "zh" ? "回声墙" : "Echo Wall",
    subtitle: lang === "zh" ? "来自花园访客的呢喃" : "Whispers from garden visitors",
    yourName: lang === "zh" ? "你的名字" : "Your name",
    yourMessage: lang === "zh" ? "想说的话..." : "Your message...",
    leaveEcho: lang === "zh" ? "留下回声" : "Leave an echo",
    send: lang === "zh" ? "发送" : "Send",
    sending: lang === "zh" ? "发送中..." : "Sending...",
    thankYou: lang === "zh" ? "谢谢！审核通过后会显示在这里。" : "Thank you! It will appear here after review.",
    noMessages: lang === "zh" ? "雨滴落在玻璃上，等待第一个声音..." : "Rain falls on glass, awaiting the first voice...",
    anonymous: lang === "zh" ? "匿名" : "Anonymous",
  };

  // Load messages on mount
  useEffect(() => {
    async function loadMessages() {
      const result = await getVisitorMessages();
      if (result.data) {
        setMessages(result.data);
      }
      setLoading(false);
    }
    loadMessages();
  }, []);

  // Cycle through messages
  useEffect(() => {
    if (messages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [messages.length]);

  // Rain effect on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();
    window.addEventListener("resize", resize);

    // Rain drops
    interface Drop {
      x: number;
      y: number;
      speed: number;
      length: number;
      opacity: number;
    }

    const drops: Drop[] = [];
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    // Initialize drops
    for (let i = 0; i < 60; i++) {
      drops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 0.8 + Math.random() * 1.2,
        length: 15 + Math.random() * 25,
        opacity: 0.1 + Math.random() * 0.2,
      });
    }

    // Water droplets on glass effect
    interface Droplet {
      x: number;
      y: number;
      radius: number;
      opacity: number;
    }

    const droplets: Droplet[] = [];
    for (let i = 0; i < 25; i++) {
      droplets.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 2 + Math.random() * 6,
        opacity: 0.05 + Math.random() * 0.1,
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw water droplets on glass
      droplets.forEach((droplet) => {
        ctx.beginPath();
        ctx.arc(droplet.x, droplet.y, droplet.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 210, 205, ${droplet.opacity})`;
        ctx.fill();
        
        // Subtle highlight
        ctx.beginPath();
        ctx.arc(droplet.x - droplet.radius * 0.3, droplet.y - droplet.radius * 0.3, droplet.radius * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${droplet.opacity * 0.5})`;
        ctx.fill();
      });

      // Draw falling rain
      drops.forEach((drop) => {
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x + 1, drop.y + drop.length);
        ctx.strokeStyle = `rgba(180, 195, 190, ${drop.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Move drop
        drop.y += drop.speed;

        // Reset drop when it falls off screen
        if (drop.y > height) {
          drop.y = -drop.length;
          drop.x = Math.random() * width;
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    setError(null);

    const result = await submitVisitorMessage(
      name.trim() || t.anonymous,
      message.trim()
    );
    
    if (result.success) {
      setSubmitted(true);
      setName("");
      setMessage("");
      setTimeout(() => setSubmitted(false), 4000);
    } else {
      setError(lang === "zh" ? "发送失败，请重试" : "Failed to send, please try again");
    }
    
    setSubmitting(false);
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return lang === "zh" ? `${month}月${day}日` : `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][month-1]} ${day}`;
  };

  const visibleMessages = messages.slice(0, 5);
  const currentMessage = messages[currentMessageIndex];

  return (
    <section className="relative mt-8 overflow-hidden rounded-2xl border border-foreground/10">
      {/* Rainy glass background */}
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] via-primary/[0.03] to-foreground/[0.02]" />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full opacity-70"
      />
      
      {/* Content */}
      <div className="relative flex flex-col gap-6 p-6 md:flex-row md:items-start md:gap-10 md:p-8">
        
        {/* Left: Messages display */}
        <div className="flex-1">
          {/* Header */}
          <div className="mb-5">
            <h2 className="mb-1 font-serif text-lg font-light text-foreground">
              {t.title}
            </h2>
            <p className="text-xs text-muted-foreground/60">
              {t.subtitle}
            </p>
          </div>

          {/* Message carousel */}
          <div className="min-h-[100px]">
            {loading && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground/50">
                <div className="h-3 w-3 animate-spin rounded-full border border-primary/30 border-t-primary" />
                <span>{lang === "zh" ? "加载中..." : "Loading..."}</span>
              </div>
            )}

            {!loading && messages.length === 0 && (
              <p className="text-sm italic text-muted-foreground/40">
                {t.noMessages}
              </p>
            )}

            {!loading && messages.length > 0 && currentMessage && (
              <div
                key={currentMessage.id}
                className="animate-in fade-in slide-in-from-bottom-2 duration-500"
              >
                <div className="mb-3 rounded-lg border border-foreground/5 bg-card/30 p-4 backdrop-blur-sm">
                  <p className="mb-3 text-sm leading-relaxed text-foreground/80">
                    &ldquo;{currentMessage.message}&rdquo;
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground/50">
                    <span className="font-medium">{currentMessage.name}</span>
                    <span className="text-foreground/10">•</span>
                    <span>{formatDate(currentMessage.created_at)}</span>
                  </div>
                </div>
                
                {/* Message indicators */}
                {messages.length > 1 && (
                  <div className="flex items-center justify-center gap-1.5">
                    {visibleMessages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentMessageIndex(idx)}
                        className={`h-1 rounded-full transition-all ${
                          idx === currentMessageIndex
                            ? "w-4 bg-primary/40"
                            : "w-1 bg-foreground/10 hover:bg-foreground/20"
                        }`}
                        aria-label={`Go to message ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Form */}
        <div className="w-full md:w-72">
          <div className="rounded-xl border border-foreground/8 bg-card/40 p-4 backdrop-blur-sm">
            <p className="mb-3 text-xs font-medium text-foreground/70">
              {t.leaveEcho}
            </p>

            {submitted ? (
              <div className="rounded-lg bg-primary/10 p-3 text-center">
                <svg 
                  className="mx-auto mb-2 h-5 w-5 text-primary"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-xs text-primary/80">{t.thankYou}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.yourName}
                  maxLength={30}
                  className="w-full rounded-lg border border-foreground/8 bg-background/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/30 focus:outline-none"
                />
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t.yourMessage}
                  maxLength={200}
                  rows={3}
                  className="w-full resize-none rounded-lg border border-foreground/8 bg-background/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/30 focus:outline-none"
                  required
                />

                {error && (
                  <p className="text-xs text-red-500">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting || !message.trim()}
                  className="w-full rounded-lg bg-primary/15 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/25 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? t.sending : t.send}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
