"use client";

import Link from "next/link";
import source from "@/data/portfolio-source.json";
import { projects, domains, paSections } from "@/data/projects";
import { useLanguage } from "@/components/language-provider";
import { PortfolioContent } from "@/components/portfolio-content";

export function ProjectDetail({ slug, section }: { slug: string; section?: string }) {
  const { isZh } = useLanguage();
  const project = projects.find((p) => p.id === slug)!;
  const page = source[(section || slug) as keyof typeof source];
  const index = projects.indexOf(project);
  const nextProject = projects[(index + 1) % projects.length];

  return (
    <div className="min-h-screen bg-background px-6 py-8 md:px-12 md:py-12">
      <article className="mx-auto max-w-4xl">
        <nav aria-label={isZh ? "面包屑" : "Breadcrumb"} className="mb-10 flex flex-wrap gap-x-3 gap-y-2 text-xs text-muted-foreground">
          <Link href="/projects" className="hover:text-primary">← {isZh ? "全部作品" : "All projects"}</Link>
          {section && <><span>/</span><Link href={`/projects/${slug}`} className="hover:text-primary">{project.title}</Link></>}
        </nav>
        <header className="mb-10 border-b border-foreground/10 pb-8">
          <p className="mb-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">{project.period}</p>
          <h1 className="mb-6 break-words font-serif text-3xl font-light leading-tight tracking-tight sm:text-4xl md:text-5xl">{section ? page.title : project.title}</h1>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">{project.summary}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.domains.map((domain) => <span key={domain} className="rounded-full border border-primary/15 bg-card/50 px-3 py-1 text-xs text-primary">{domains.find((d) => d.id === domain)?.name}</span>)}
            {project.skills.map((skill) => <span key={skill} className="rounded bg-secondary/50 px-2 py-1 text-[11px] text-muted-foreground">{skill}</span>)}
          </div>
          {project.resources.length > 0 && <div className="mt-7 flex flex-wrap gap-3">{project.resources.map((resource) => <a key={resource.href} href={resource.href} target="_blank" rel="noreferrer" className="rounded-md border border-primary/20 bg-card/60 px-4 py-2.5 text-xs text-primary transition-colors hover:bg-secondary/60">{resource.label} ↗</a>)}</div>}
        </header>
        {slug === "pa-flrtrx" && <nav aria-label={isZh ? "技术章节" : "Technical sections"} className="mb-10 grid gap-2 sm:grid-cols-2">
          {paSections.map((id, i) => <Link key={id} href={`/projects/pa-flrtrx/${id}`} aria-current={section === id ? "page" : undefined} className={`rounded-lg border px-4 py-3 text-sm transition-colors hover:border-primary/40 ${section === id ? "border-primary/40 bg-primary/10 text-primary" : "border-foreground/10 bg-card/40"}`}><span className="mr-3 font-mono text-xs text-muted-foreground">0{i + 1}</span>{source[id].title} →</Link>)}
        </nav>}
        <p className="mb-8 text-xs leading-6 text-muted-foreground">{isZh ? "以下保留旧作品集的英文原文和原始图片；其中的进行中状态与计划反映当时记录。" : "Original portfolio text and figures follow. In-progress statements and next steps reflect the original record."}</p>
        {slug === "dance-after-work" && <p className="mb-8 text-sm leading-7 text-muted-foreground">{isZh ? "旧详情页仅提供代码仓库，项目介绍取自旧站分类页。可从上方 GitHub 链接查看代码；演示图片与视频待补充。" : "The original detail page links to the code repository. The overview above comes from its category page. Demo images and video are not available in the original portfolio."}</p>}
        <PortfolioContent blocks={page.blocks} />
        <footer className="mt-14 border-t border-foreground/10 pt-6">
          <a href={page.sourceUrl} target="_blank" rel="noreferrer" className="text-xs text-primary underline underline-offset-4">{isZh ? "旧作品集原始页面 ↗" : "Original portfolio page ↗"}</a>
          <div className="mt-10 flex flex-wrap justify-between gap-5 text-sm"><Link href="/projects" className="text-muted-foreground hover:text-primary">← {isZh ? "返回作品" : "Back to projects"}</Link><Link href={`/projects/${nextProject.id}`} className="text-primary">{nextProject.title} →</Link></div>
        </footer>
      </article>
    </div>
  );
}
