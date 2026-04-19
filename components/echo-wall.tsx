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
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Horizontal scroll for messages
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const t = {
    title: lang === "zh" ? "回声墙" : "Echo Wall",
    subtitle: lang === "zh" ? "花园里的轻语" : "Whispers in the garden",
    yourName: lang === "zh" ? "你的名字" : "Your name",
    yourMessage: lang === "zh" ? "想说的话..." : "Your message...",
    leaveEcho: lang === "zh" ? "留下回声" : "Leave an echo",
    send: lang === "zh" ? "发送" : "Send",
    sending: lang === "zh" ? "发送中..." : "Sending...",
    thankYou: lang === "zh" ? "谢谢！审核后会显示。" : "Thank you! Will appear after review.",
    noMessages: lang === "zh" ? "等待第一个声音..." : "Awaiting the first voice...",
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
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 30 + Math.random() * 60,
        speed: 0.1 + Math.random() * 0.2,
        opacity: 0.02 + Math.random() * 0.04,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;
    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.01;

      // Draw soft fog particles
      particles.forEach((p) => {
        const pulseFactor = 0.5 + 0.5 * Math.sin(time + p.phase);
        const currentOpacity = p.opacity * (0.7 + 0.3 * pulseFactor);
        
        // Create gradient for soft edge
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        gradient.addColorStop(0, `rgba(180, 200, 190, ${currentOpacity})`);
        gradient.addColorStop(0.5, `rgba(180, 200, 190, ${currentOpacity * 0.5})`);
        gradient.addColorStop(1, `rgba(180, 200, 190, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Slowly drift
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

  // Drag to scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 1.5;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

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
      setTimeout(() => {
        setSubmitted(false);
        setShowForm(false);
      }, 3000);
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
    <section className="relative mt-10 overflow-hidden">
      {/* Misty horizontal bar */}
      <div className="relative rounded-2xl border border-foreground/[0.06] bg-gradient-to-r from-foreground/[0.01] via-primary/[0.02] to-foreground/[0.01]">
        {/* Canvas fog effect */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full pointer-events-none"
        />
        
        {/* Gradient overlays for edges */}
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        {/* Content */}
        <div className="relative z-[5] py-5 px-6">
          {/* Header row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* Echo icon */}
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary/70"
                >
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" x2="12" y1="19" y2="22" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-medium text-foreground/80">{t.title}</h2>
                <p className="text-[10px] text-muted-foreground/50">{t.subtitle}</p>
              </div>
            </div>

            {/* Add echo button */}
            <button
              onClick={() => setShowForm(!showForm)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-all ${
                showForm 
                  ? "bg-foreground/10 text-foreground/70" 
                  : "bg-primary/10 text-primary hover:bg-primary/20"
              }`}
            >
              {showForm ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  <span>{lang === "zh" ? "关闭" : "Close"}</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  <span>{t.leaveEcho}</span>
                </>
              )}
            </button>
          </div>

          {/* Collapsible form */}
          {showForm && (
            <div className="mb-4 rounded-xl border border-foreground/8 bg-card/40 p-4 backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-300">
              {submitted ? (
                <div className="flex items-center gap-2 text-sm text-primary">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{t.thankYou}</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-wrap gap-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.yourName}
                    maxLength={30}
                    className="w-28 rounded-lg border border-foreground/8 bg-background/50 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary/30 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t.yourMessage}
                    maxLength={200}
                    className="min-w-[200px] flex-1 rounded-lg border border-foreground/8 bg-background/50 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary/30 focus:outline-none"
                    required
                  />
                  <button
                    type="submit"
                    disabled={submitting || !message.trim()}
                    className="rounded-lg bg-primary/20 px-4 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? t.sending : t.send}
                  </button>
                  {error && <p className="w-full text-xs text-red-500">{error}</p>}
                </form>
              )}
            </div>
          )}

          {/* Horizontal scrolling messages */}
          <div 
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-1 cursor-grab active:cursor-grabbing"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {loading && (
              <div className="flex items-center gap-2 py-2 text-xs text-muted-foreground/40">
                <div className="h-3 w-3 animate-spin rounded-full border border-primary/20 border-t-primary/60" />
                <span>{lang === "zh" ? "加载中..." : "Loading..."}</span>
              </div>
            )}

            {!loading && messages.length === 0 && (
              <p className="py-2 text-xs italic text-muted-foreground/40">
                {t.noMessages}
              </p>
            )}

            {!loading && messages.map((msg, index) => (
              <div
                key={msg.id}
                className="group flex-shrink-0 rounded-lg border border-foreground/[0.04] bg-card/20 px-4 py-3 backdrop-blur-sm transition-all hover:border-foreground/10 hover:bg-card/40"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  maxWidth: '280px',
                }}
              >
                <p className="mb-2 text-xs leading-relaxed text-foreground/70">
                  &ldquo;{msg.message}&rdquo;
                </p>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground/40">
                  <span className="font-medium text-muted-foreground/60">{msg.name}</span>
                  <span>·</span>
                  <span>{formatDate(msg.created_at)}</span>
                </div>
              </div>
            ))}

            {/* Spacer for scroll */}
            {!loading && messages.length > 0 && <div className="w-4 flex-shrink-0" />}
          </div>
        </div>
      </div>

      {/* Hide scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
