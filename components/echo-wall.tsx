"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/components/language-provider";
import { getVisitorMessages, submitVisitorMessage } from "@/lib/actions";
import type { VisitorMessage } from "@/lib/database.types";

export function EchoWall() {
  const { lang } = useLanguage();
  const [messages, setMessages] = useState<VisitorMessage[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = {
    title: lang === "zh" ? "回声墙" : "Echo Wall",
    subtitle: lang === "zh" ? "来自访客的声音" : "Voices from visitors",
    yourName: lang === "zh" ? "你的名字" : "Your name",
    yourMessage: lang === "zh" ? "想说的话" : "Your message",
    leaveMessage: lang === "zh" ? "留下你的回声" : "Leave your echo",
    send: lang === "zh" ? "发送" : "Send",
    sending: lang === "zh" ? "发送中..." : "Sending...",
    thankYou: lang === "zh" ? "谢谢你的留言！审核通过后会显示在这里。" : "Thank you! Your message will appear here after review.",
    noMessages: lang === "zh" ? "还没有留言，成为第一个吧..." : "No messages yet, be the first...",
    errorMessage: lang === "zh" ? "发送失败，请稍后再试" : "Failed to send, please try again",
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setSubmitting(true);
    setError(null);

    const result = await submitVisitorMessage(name.trim(), message.trim());
    
    if (result.success) {
      setSubmitted(true);
      setName("");
      setMessage("");
      // Reset after a few seconds
      setTimeout(() => setSubmitted(false), 5000);
    } else {
      setError(t.errorMessage);
    }
    
    setSubmitting(false);
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(lang === "zh" ? "zh-CN" : "en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <section className="rounded-xl border border-foreground/8 bg-card/30 p-5 backdrop-blur-sm">
      {/* Header */}
      <div className="mb-5">
        <h2 className="mb-1 font-serif text-base font-normal text-foreground">
          {t.title}
        </h2>
        <p className="text-[10px] text-muted-foreground/60">
          {t.subtitle}
        </p>
      </div>

      {/* Messages */}
      <div className="mb-5 max-h-40 space-y-3 overflow-y-auto pr-1">
        {loading && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground/50">
            <div className="h-3 w-3 animate-spin rounded-full border border-primary/30 border-t-primary" />
            <span>{lang === "zh" ? "加载中..." : "Loading..."}</span>
          </div>
        )}

        {!loading && messages.length === 0 && (
          <p className="text-xs italic text-muted-foreground/40">
            {t.noMessages}
          </p>
        )}

        {!loading && messages.map((msg) => (
          <div
            key={msg.id}
            className="border-l-2 border-foreground/8 pl-3 transition-colors hover:border-primary/25"
          >
            <div className="mb-0.5 flex items-baseline gap-2">
              <span className="text-xs font-medium text-foreground/80">
                {msg.name}
              </span>
              <span className="font-mono text-[8px] text-muted-foreground/40">
                {formatDate(msg.created_at)}
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground/70">
              {msg.message}
            </p>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="mb-4 h-px bg-foreground/6" />

      {/* Form */}
      {submitted ? (
        <div className="rounded-lg bg-primary/10 p-3 text-center">
          <p className="text-xs text-primary">
            {t.thankYou}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <p className="text-[10px] text-muted-foreground/50">
            {t.leaveMessage}
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.yourName}
              maxLength={30}
              className="w-24 shrink-0 rounded-md border border-foreground/10 bg-background/50 px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary/30 focus:outline-none focus:ring-1 focus:ring-primary/20"
              required
            />
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t.yourMessage}
              maxLength={150}
              className="flex-1 rounded-md border border-foreground/10 bg-background/50 px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary/30 focus:outline-none focus:ring-1 focus:ring-primary/20"
              required
            />
          </div>

          {error && (
            <p className="text-[10px] text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting || !name.trim() || !message.trim()}
            className="w-full rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? t.sending : t.send}
          </button>
        </form>
      )}
    </section>
  );
}
