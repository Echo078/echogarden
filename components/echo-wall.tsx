"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useLanguage } from "@/components/language-provider";
import { getVisitorMessages, submitVisitorMessage } from "@/lib/actions";
import type { VisitorMessage } from "@/lib/database.types";
import { Button } from "@/components/ui/button";

interface DanmuMessage extends VisitorMessage {
  row: number;
  speed: number;
  delay: number;
}

export function EchoWall() {
  const { lang } = useLanguage();
  const [messages, setMessages] = useState<VisitorMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Form state
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = {
    title: lang === "zh" ? "回声墙" : "Echo Wall",
    subtitle: lang === "zh" ? "花园里的轻语" : "Whispers in the garden",
    yourName: lang === "zh" ? "你的名字" : "Your name",
    yourMessage: lang === "zh" ? "留下你的声音..." : "Leave your voice...",
    send: lang === "zh" ? "发送" : "Send",
    sending: lang === "zh" ? "发送中..." : "Sending...",
    thankYou: lang === "zh" ? "谢谢！审核后会显示。" : "Thank you! Will appear after review.",
    noMessages: lang === "zh" ? "等待第一个声音..." : "Awaiting the first voice...",
    anonymous: lang === "zh" ? "匿名" : "Anonymous",
    stayAnonymous: lang === "zh" ? "匿名发送" : "Stay anonymous",
    formTitle: lang === "zh" ? "留言" : "Leave a Message",
    formDesc: lang === "zh" ? "你的声音会在这里回响" : "Your voice will echo here",
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

  // Prepare danmu messages with staggered rows and speeds
  const danmuMessages = useMemo<DanmuMessage[]>(() => {
    if (messages.length === 0) return [];
    
    const numRows = 2; // 2 horizontal lanes for compact height
    return messages.map((msg, index) => ({
      ...msg,
      row: index % numRows,
      speed: 28 + Math.random() * 18, // 28-46 seconds to cross
      delay: (index * 3) + Math.random() * 2, // Stagger start times
    }));
  }, [messages]);

  // Misty fog effect on canvas
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

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    // Fog particles
    interface FogParticle {
      x: number;
      y: number;
      radius: number;
      speed: number;
      opacity: number;
      phase: number;
    }

    const particles: FogParticle[] = [];
    for (let i = 0; i < 15; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 30 + Math.random() * 60,
        speed: 0.05 + Math.random() * 0.1,
        opacity: 0.02 + Math.random() * 0.03,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;
    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.006;

      particles.forEach((p) => {
        const pulseFactor = 0.5 + 0.5 * Math.sin(time + p.phase);
        const currentOpacity = p.opacity * (0.5 + 0.5 * pulseFactor);
        
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        gradient.addColorStop(0, `rgba(180, 200, 190, ${currentOpacity})`);
        gradient.addColorStop(0.5, `rgba(180, 200, 190, ${currentOpacity * 0.4})`);
        gradient.addColorStop(1, `rgba(180, 200, 190, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        p.x += p.speed;
        if (p.x > width + p.radius) {
          p.x = -p.radius;
          p.y = Math.random() * height;
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

    const displayName = isAnonymous ? t.anonymous : (name.trim() || t.anonymous);
    const result = await submitVisitorMessage(displayName, message.trim());
    
    if (result.success) {
      setSubmitted(true);
      setName("");
      setMessage("");
      setIsAnonymous(false);
      setTimeout(() => {
        setSubmitted(false);
      }, 4000);
    } else {
      setError(lang === "zh" ? "发送失败，请重试" : "Failed, please retry");
    }
    
    setSubmitting(false);
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return lang === "zh" 
      ? `${month}.${day}` 
      : `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][month-1]} ${day}`;
  };

  return (
    <section className="mt-12">
      {/* Section header */}
      <div className="mb-5 flex items-center gap-4">
        <h2 className="font-serif text-base font-normal text-foreground">
          {t.title}
        </h2>
        <div className="h-px flex-1 bg-foreground/10" aria-hidden="true" />
      </div>

      {/* Split layout: Left = Danmu Wall, Right = Input Form */}
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        
        {/* Left: Animated Message Wall with Mist - compact horizontal strip */}
        <div className="relative flex-1 lg:flex-[2] overflow-hidden rounded-lg border border-foreground/[0.06] bg-gradient-to-r from-foreground/[0.01] via-primary/[0.02] to-foreground/[0.01]" style={{ minHeight: "120px", maxHeight: "140px" }}>
          {/* Canvas fog effect */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full pointer-events-none"
          />
          
          {/* Gradient overlays for edges - creates fogged glass effect */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none" />

          {/* Header */}
          <div className="relative z-[5] px-4 pt-2.5 pb-1">
            <p className="text-[8px] uppercase tracking-wider text-muted-foreground/40">
              {t.subtitle}
            </p>
          </div>

          {/* Danmu area - floating messages - compact */}
          <div className="relative h-20 overflow-hidden">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground/40">
                  <div className="h-3 w-3 animate-spin rounded-full border border-primary/20 border-t-primary/60" />
                  <span>{lang === "zh" ? "加载中..." : "Loading..."}</span>
                </div>
              </div>
            )}

            {!loading && messages.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-[11px] italic text-muted-foreground/30">
                  {t.noMessages}
                </p>
              </div>
            )}

            {/* Floating danmu messages */}
            {!loading && danmuMessages.map((msg) => {
              const rowHeight = 32;
              const topOffset = 4 + (msg.row * rowHeight);
              
              return (
                <div
                  key={msg.id}
                  className="danmu-message absolute whitespace-nowrap"
                  style={{
                    top: `${topOffset}px`,
                    animationDuration: `${msg.speed}s`,
                    animationDelay: `${msg.delay}s`,
                  }}
                >
                  <div className="inline-flex items-center gap-2 rounded-full border border-foreground/[0.04] bg-card/30 px-3 py-1.5 backdrop-blur-sm">
                    <span className="text-[10px] leading-none text-foreground/70 max-w-[180px] truncate">
                      {msg.message}
                    </span>
                    <span className="text-[8px] text-muted-foreground/40">
                      — {msg.name}
                    </span>
                    <span className="text-[7px] text-muted-foreground/25">
                      {formatDate(msg.created_at)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <style jsx>{`
            .danmu-message {
              animation: danmu-float linear infinite;
              right: -350px;
            }
            @keyframes danmu-float {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(calc(-100% - 100vw));
              }
            }
          `}</style>
        </div>

        {/* Right: Clean Input Form */}
        <div className="lg:flex-1 rounded-xl border border-foreground/8 bg-card/40 p-5 backdrop-blur-sm">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-foreground/80 mb-1">
              {t.formTitle}
            </h3>
            <p className="text-[10px] text-muted-foreground/50">
              {t.formDesc}
            </p>
          </div>

          {submitted ? (
            <div className="flex items-center gap-2 rounded-lg bg-primary/10 p-4 text-sm text-primary">
              <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{t.thankYou}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Name input */}
              <div>
                <label className="mb-1 block text-[10px] font-medium text-muted-foreground/60">
                  {t.yourName}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.yourName}
                  maxLength={30}
                  disabled={isAnonymous}
                  className={`w-full rounded-lg border border-foreground/10 bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/30 focus:outline-none transition-colors ${isAnonymous ? "opacity-50 cursor-not-allowed" : ""}`}
                />
              </div>

              {/* Anonymous toggle */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-foreground/20 text-primary focus:ring-primary/30"
                />
                <span className="text-[11px] text-muted-foreground/60">{t.stayAnonymous}</span>
              </label>

              {/* Message textarea */}
              <div>
                <label className="mb-1 block text-[10px] font-medium text-muted-foreground/60">
                  {lang === "zh" ? "留言" : "Message"}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t.yourMessage}
                  maxLength={200}
                  rows={3}
                  className="w-full resize-none rounded-lg border border-foreground/10 bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/30 focus:outline-none transition-colors"
                  required
                />
                <p className="mt-1 text-right text-[9px] text-muted-foreground/40">
                  {message.length}/200
                </p>
              </div>

              {/* Error message */}
              {error && (
                <p className="text-[11px] text-red-500">{error}</p>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                disabled={submitting || !message.trim()}
                className="w-full"
                size="sm"
              >
                {submitting ? t.sending : t.send}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
