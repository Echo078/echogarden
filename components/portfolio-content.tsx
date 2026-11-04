"use client";

import { useState } from "react";
import { useLanguage } from "@/components/language-provider";

export type PortfolioBlock = {
  type: string;
  text?: string;
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  videoId?: string;
  title?: string;
};

export function YouTubeVideo({ videoId, title }: { videoId: string; title: string }) {
  const { isZh } = useLanguage();
  return (
    <figure className="my-8 min-w-0">
      <iframe
        className="aspect-video w-full rounded-lg border border-foreground/10 bg-secondary/30"
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
      <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>{title}</span>
        <a href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-primary">
          {isZh ? "在 YouTube 观看 ↗" : "Watch on YouTube ↗"}
        </a>
      </figcaption>
    </figure>
  );
}

export function SoundCloudTrack({ url, title }: { url: string; title: string }) {
  const { isZh } = useLanguage();
  return (
    <div className="my-6 min-w-0">
      <iframe title={`${title} — SoundCloud`} className="h-[166px] w-full rounded-lg border border-foreground/10" loading="lazy" allow="autoplay" src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%234c7550&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&visual=false`} />
      <a href={url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs text-primary underline underline-offset-4">
        {isZh ? "在 SoundCloud 收听 ↗" : "Listen on SoundCloud ↗"}
      </a>
    </div>
  );
}

export function PortfolioImage({ block }: { block: PortfolioBlock }) {
  const [failed, setFailed] = useState(false);
  const { isZh } = useLanguage();
  if (failed) return <p className="my-6 rounded-lg border border-foreground/10 p-5 text-sm text-muted-foreground">{isZh ? "图片暂时无法显示，请查看页面下方的原始来源。" : "Image unavailable. Please use the original source linked below."}</p>;
  return (
    <figure className="my-7 overflow-hidden rounded-lg border border-foreground/10 bg-card/50">
      <a href={block.src} target="_blank" rel="noreferrer" aria-label={`${isZh ? "查看原图" : "Open full image"}: ${block.alt}`}>
        <img src={block.src} alt={block.alt || "Original portfolio figure"} width={block.width} height={block.height} loading="lazy" decoding="async" onError={() => setFailed(true)} className="mx-auto h-auto max-w-full" />
      </a>
      <figcaption className="border-t border-foreground/8 px-4 py-2 text-[11px] leading-relaxed text-muted-foreground">
        {block.alt} <span className="ml-2 text-primary">{isZh ? "点击放大 ↗" : "Open full size ↗"}</span>
      </figcaption>
    </figure>
  );
}

export function PortfolioContent({ blocks }: { blocks: PortfolioBlock[] }) {
  return (
    <div className="min-w-0 break-words">
      {blocks.map((block, i) => {
        if (block.type === "heading") return <h2 key={i} className="mb-5 mt-12 scroll-mt-20 border-b border-foreground/10 pb-3 font-serif text-2xl font-normal">{block.text}</h2>;
        if (block.type === "image") return <PortfolioImage key={i} block={block} />;
        if (block.type === "youtube") return <YouTubeVideo key={i} videoId={block.videoId!} title={block.title!} />;
        return <p key={i} className="my-5 whitespace-pre-line text-sm leading-7 text-foreground/80">{block.text}</p>;
      })}
    </div>
  );
}
