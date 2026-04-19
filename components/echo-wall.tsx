"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useLanguage } from "@/components/language-provider";
import { getVisitorMessages, submitVisitorMessage } from "@/lib/actions";
import type { VisitorMessage } from "@/lib/database.types";

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
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Form state
  const [showForm, setShowForm] = useState(false);
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
    yourMessage: lang === "zh" ? "想说的话..." : "Your message...",
    leaveEcho: lang === "zh" ? "留下回声" : "Leave an echo",
    send: lang === "zh" ? "发送" : "Send",
    sending: lang === "zh" ? "发送中..." : "Sending...",
    thankYou: lang === "zh" ? "谢谢！审核后会显示。" : "Thank you! Will appear after review.",
    noMessages: lang === "zh" ? "等待第一个声音..." : "Awaiting the first voice...",
    anonymous: lang === "zh" ? "匿名" : "Anonymous",
    stayAnonymous: lang === "zh" ? "匿名发送" : "Stay anonymous",
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
    
    const numRows = 4; // Number of horizontal lanes
    return messages.map((msg, index) => ({
      ...msg,
      row: index % numRows,
      speed: 25 + Math.random() * 15, // 25-40 seconds to cross
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
    for (let i = 0; i < 20; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 40 + Math.random() * 80,
        speed: 0.08 + Math.random() * 0.12,
        opacity: 0.015 + Math.random() * 0.025,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;
    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.008;

      particles.forEach((p) => {
        const pulseFactor = 0.5 + 0.5 * Math.sin(time + p.phase);
        const currentOpacity = p.opacity * (0.6 + 0.4 * pulseFactor);
        
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
        setShowForm(false);
      }, 3000);
    } else {
      setError(lang === "zh" ? "发送失败，请重试" : "Failed, please retry");
    }
    
    setSubmitting(false);
  };

  return (
    <section className="relative mt-10 overflow-hidden">
      {/* Misty horizontal bar with danmu */}
      <div 
        ref={containerRef}
        className="relative rounded-2xl border border-foreground/[0.06] bg-gradient-to-r from-foreground/[0.01] via-primary/[0.02] to-foreground/[0.01] overflow-hidden"
        style={{ minHeight: "200px" }}
      >
        {/* Canvas fog effect */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full pointer-events-none"
        />
        
        {/* Gradient overlays for edges - creates fogged glass effect */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none" />

        {/* Content */}
        <div className="relative z-[5] py-4 px-6">
          {/* Header row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
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
                <h2 className="text-xs font-medium text-foreground/80">{t.title}</h2>
                <p className="text-[9px] text-muted-foreground/50">{t.subtitle}</p>
              </div>
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] transition-all ${
                showForm 
                  ? "bg-foreground/10 text-foreground/70" 
                  : "bg-primary/10 text-primary hover:bg-primary/20"
              }`}
            >
              {showForm ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  <span>{lang === "zh" ? "关闭" : "Close"}</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  <span>{t.leaveEcho}</span>
                </>
              )}
            </button>
          </div>

          {/* Collapsible form */}
          {showForm && (
            <div className="mb-4 rounded-xl border border-foreground/8 bg-card/40 p-3 backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-300">
              {submitted ? (
                <div className="flex items-center gap-2 text-xs text-primary">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{t.thankYou}</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                  <div className="flex flex-wrap gap-2">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t.yourName}
                      maxLength={30}
                      disabled={isAnonymous}
                      className={`w-24 rounded-lg border border-foreground/8 bg-background/50 px-2.5 py-1.5 text-[11px] text-foreground placeholder:text-muted-foreground/40 focus:border-primary/30 focus:outline-none ${isAnonymous ? "opacity-50" : ""}`}
                    />
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t.yourMessage}
                      maxLength={200}
                      className="min-w-[180px] flex-1 rounded-lg border border-foreground/8 bg-background/50 px-2.5 py-1.5 text-[11px] text-foreground placeholder:text-muted-foreground/40 focus:border-primary/30 focus:outline-none"
                      required
                    />
                    <button
                      type="submit"
                      disabled={submitting || !message.trim()}
                      className="rounded-lg bg-primary/20 px-3 py-1.5 text-[10px] font-medium text-primary transition-colors hover:bg-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submitting ? t.sending : t.send}
                    </button>
                  </div>
                  {/* Anonymous toggle */}
                  <label className="flex items-center gap-2 cursor-pointer self-start">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="h-3 w-3 rounded border-foreground/20 text-primary focus:ring-primary/30"
                    />
                    <span className="text-[10px] text-muted-foreground/60">{t.stayAnonymous}</span>
                  </label>
                  {error && <p className="text-[10px] text-red-500">{error}</p>}
                </form>
              )}
            </div>
          )}
        </div>

        {/* Danmu area - floating messages */}
        <div className="relative h-32 overflow-hidden">
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
          {!loading && danmuMessages.map((msg, index) => (
            <DanmuItem key={msg.id} message={msg} index={index} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Individual danmu message component
function DanmuItem({ 
  message, 
  index, 
  lang 
}: { 
  message: DanmuMessage; 
  index: number; 
  lang: string;
}) {
  const rowHeight = 28; // Height per row
  const topOffset = 8 + (message.row * rowHeight);
  
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
    <div
      className="danmu-message absolute whitespace-nowrap"
      style={{
        top: `${topOffset}px`,
        animationDuration: `${message.speed}s`,
        animationDelay: `${message.delay}s`,
      }}
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-foreground/[0.04] bg-card/30 px-3 py-1.5 backdrop-blur-sm transition-all hover:bg-card/50 hover:border-foreground/10">
        <span className="text-[10px] leading-none text-foreground/70 max-w-[200px] truncate">
          {message.message}
        </span>
        <span className="text-[8px] text-muted-foreground/40">
          — {message.name}
        </span>
        <span className="text-[7px] text-muted-foreground/30">
          {formatDate(message.created_at)}
        </span>
      </div>

      <style jsx>{`
        .danmu-message {
          animation: danmu-float linear infinite;
          right: -400px;
        }
        @keyframes danmu-float {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100vw - 400px));
          }
        }
      `}</style>
    </div>
  );
}
