import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { paSections } from "@/data/projects";
import source from "@/data/portfolio-source.json";
import { ProjectDetail } from "@/components/project-detail";

export function generateStaticParams() { return paSections.map((section) => ({ slug: "pa-flrtrx", section })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string; section: string }> }): Promise<Metadata> {
  const { section } = await params;
  return { title: `${source[section as keyof typeof source]?.title || "Section not found"} — PA-FLRTRX — Echo’s Garden` };
}
export default async function Page({ params }: { params: Promise<{ slug: string; section: string }> }) {
  const { slug, section } = await params;
  if (slug !== "pa-flrtrx" || !paSections.some((id) => id === section)) notFound();
  return <ProjectDetail slug={slug} section={section} />;
}
