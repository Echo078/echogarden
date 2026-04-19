"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { BotanicalBackground } from "@/components/botanical-background";
import { useLanguage } from "@/components/language-provider";
import { getEssayBySlug } from "@/lib/actions";
import type { Essay } from "@/lib/database.types";

export default function EssayDetailPage() {
  const params = useParams();
  const { lang } = useLanguage();
  const [essay, setEssay] = useState<Essay | null>(null);
  const [loading, setLoading] = useState(true);

  const slug = params.slug as string;

  useEffect(() => {
    async function load() {
      const data = await getEssayBySlug(slug);
      setEssay(data);
      setLoading(false);
    }
    if (slug) {
      load();
    }
  }, [slug]);

  // Format date consistently
  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number);
    const months = ["January", "February", "March", "April", "May", "June", 
                    "July", "August", "September", "October", "November", "December"];
    return `${months[month - 1]} ${day}, ${year}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!essay) {
    return (
      <div className="relative min-h-screen bg-background">
        <BotanicalBackground />
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
          <h1 className="mb-4 font-serif text-2xl text-foreground">
            {lang === "zh" ? "文章未找到" : "Essay Not Found"}
          </h1>
          <p className="mb-6 text-sm text-muted-foreground">
            {lang === "zh" 
              ? "这篇文章不存在或尚未发布。"
              : "This essay doesn't exist or hasn't been published yet."}
          </p>
          <Link
            href="/essays"
            className="text-sm text-primary hover:underline"
          >
            ← {lang === "zh" ? "返回文章列表" : "Back to essays"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background">
      <BotanicalBackground />

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-foreground/8 bg-background/60 backdrop-blur-md">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
            <Link
              href="/essays"
              className="text-xs text-muted-foreground/60 transition-colors hover:text-foreground"
            >
              ← {lang === "zh" ? "所有文章" : "All Essays"}
            </Link>
            <span className="text-xs text-muted-foreground/40">
              {formatDate(essay.date)}
            </span>
          </div>
        </header>

        <article className="mx-auto max-w-3xl px-6 py-12">
          {/* Title section */}
          <header className="mb-12 text-center">
            {essay.featured && (
              <span className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                Featured Essay
              </span>
            )}
            <h1 className="mb-4 font-serif text-3xl font-light leading-tight text-foreground md:text-4xl">
              {essay.title}
            </h1>
            {essay.subtitle && (
              <p className="mb-6 text-lg text-muted-foreground/80">
                {essay.subtitle}
              </p>
            )}
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground/50">
              <span>{formatDate(essay.date)}</span>
              {essay.reading_time_minutes && (
                <>
                  <span>•</span>
                  <span>{essay.reading_time_minutes} min read</span>
                </>
              )}
            </div>
            {essay.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {essay.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-foreground/5 px-3 py-1 text-xs text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Decorative divider */}
          <div className="mb-12 flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-foreground/10" />
            <div className="h-1.5 w-1.5 rounded-full bg-primary/30" />
            <div className="h-px w-12 bg-foreground/10" />
          </div>

          {/* Content */}
          <div 
            className="prose prose-sm max-w-none
              prose-headings:font-serif prose-headings:font-light prose-headings:text-foreground
              prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
              prose-p:text-foreground/80 prose-p:leading-relaxed
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-foreground prose-strong:font-medium
              prose-em:text-foreground/70
              prose-blockquote:border-l-primary/30 prose-blockquote:text-muted-foreground prose-blockquote:italic
              prose-code:bg-foreground/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-foreground/5 prose-pre:border prose-pre:border-foreground/10
              prose-img:rounded-lg
              prose-hr:border-foreground/10
              prose-ul:text-foreground/80 prose-ol:text-foreground/80
              prose-li:marker:text-primary/50"
            dangerouslySetInnerHTML={{ __html: essay.content }}
          />

          {/* Footer navigation */}
          <footer className="mt-16 border-t border-foreground/8 pt-8">
            <Link
              href="/essays"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              {lang === "zh" ? "返回文章列表" : "Back to all essays"}
            </Link>
          </footer>
        </article>
      </div>
    </div>
  );
}
