"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPostBySlug } from "@/lib/actions";
import { useLanguage } from "@/components/language-provider";
import type { BlogPost } from "@/lib/database.types";

// Content renderer - handles both HTML (from Tiptap) and markdown
function renderContent(content: string): string {
  if (!content) return "";
  
  // Check if content is already HTML (from Tiptap editor)
  if (content.trim().startsWith("<")) {
    return content;
  }
  
  // Otherwise, treat as markdown
  let html = content;
  
  // Escape HTML
  html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  
  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-serif font-medium mt-6 mb-3 text-foreground">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-serif font-medium mt-8 mb-4 text-foreground">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-serif font-medium mt-8 mb-4 text-foreground">$1</h1>');
  
  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');
  html = html.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>');
  html = html.replace(/__(.+?)__/g, '<strong class="font-semibold">$1</strong>');
  html = html.replace(/_(.+?)_/g, '<em class="italic">$1</em>');
  
  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-foreground/5 rounded-lg p-4 my-4 overflow-x-auto font-mono text-sm"><code>$2</code></pre>');
  
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-foreground/10 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');
  
  // Blockquotes
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote class="border-l-2 border-primary/30 pl-4 my-4 italic text-muted-foreground">$1</blockquote>');
  
  // Unordered lists
  html = html.replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>');
  html = html.replace(/^\* (.+)$/gm, '<li class="ml-4 list-disc">$1</li>');
  
  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>');
  
  // Wrap consecutive list items
  html = html.replace(/(<li class="ml-4 list-disc">.+<\/li>\n?)+/g, '<ul class="my-4 space-y-1">$&</ul>');
  html = html.replace(/(<li class="ml-4 list-decimal">.+<\/li>\n?)+/g, '<ol class="my-4 space-y-1">$&</ol>');
  
  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr class="my-8 border-foreground/10" />');
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="my-6 rounded-lg max-w-full" />');
  
  // Paragraphs (split by double newlines)
  html = html.split(/\n\n+/).map(block => {
    // Don't wrap blocks that are already wrapped in HTML tags
    if (block.startsWith('<')) return block;
    if (block.trim() === '') return '';
    return `<p class="my-4 leading-relaxed text-foreground/80">${block.replace(/\n/g, '<br />')}</p>`;
  }).join('\n');
  
  return html;
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { t, lang } = useLanguage();
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    async function loadPost() {
      const data = await getBlogPostBySlug(slug);
      if (!data || !data.published) {
        setNotFoundState(true);
      } else {
        setPost(data);
      }
      setLoading(false);
    }
    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-1/3 rounded bg-foreground/10" />
            <div className="h-4 w-1/4 rounded bg-foreground/10" />
            <div className="mt-8 space-y-3">
              <div className="h-4 w-full rounded bg-foreground/10" />
              <div className="h-4 w-full rounded bg-foreground/10" />
              <div className="h-4 w-2/3 rounded bg-foreground/10" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (notFoundState || !post) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h1 className="font-serif text-2xl font-light text-foreground">
            {lang === "zh" ? "文章未找到" : "Post not found"}
          </h1>
          <p className="mt-4 text-muted-foreground">
            {lang === "zh" ? "这篇文章不存在或尚未发布。" : "This post doesn't exist or hasn't been published yet."}
          </p>
          <Link 
            href="/blog"
            className="mt-6 inline-block text-sm text-primary hover:underline"
          >
            {lang === "zh" ? "← 返回博客" : "← Back to blog"}
          </Link>
        </div>
      </div>
    );
  }

  // Format date consistently
  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    const months = lang === "zh" 
      ? ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
      : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${months[month - 1]} ${day}, ${year}`;
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <article className="mx-auto max-w-3xl px-6">
        {/* Back link */}
        <Link 
          href="/blog"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {lang === "zh" ? "返回博客" : "Back to blog"}
        </Link>

        {/* Header */}
        <header className="mb-10">
          <h1 className="font-serif text-3xl font-light leading-tight text-foreground md:text-4xl">
            {post.title}
          </h1>
          
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <time dateTime={post.date}>
              {formatDate(post.date)}
            </time>
            
            {post.tags && post.tags.length > 0 && (
              <>
                <span className="text-foreground/20">•</span>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="rounded-full bg-foreground/5 px-2.5 py-0.5 text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {post.excerpt && (
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Content */}
        <div 
          className="prose prose-neutral dark:prose-invert max-w-none blog-content"
          dangerouslySetInnerHTML={{ __html: renderContent(post.content || "") }}
        />
        
        {/* Image grid responsive styles */}
        <style jsx global>{`
          .blog-content .image-grid,
          .blog-content div[class*="image-grid"] {
            display: grid;
            gap: 0.5rem;
            margin: 1.5rem 0;
          }
          .blog-content .image-grid-2,
          .blog-content div[style*="repeat(2"] {
            grid-template-columns: repeat(2, 1fr);
          }
          .blog-content .image-grid-3,
          .blog-content div[style*="repeat(3"] {
            grid-template-columns: repeat(3, 1fr);
          }
          .blog-content .image-grid img,
          .blog-content div[class*="image-grid"] img {
            margin: 0 !important;
            width: 100%;
            height: auto;
            border-radius: 0.5rem;
            object-fit: cover;
          }
          @media (max-width: 640px) {
            .blog-content .image-grid,
            .blog-content div[class*="image-grid"] {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </article>
    </div>
  );
}
