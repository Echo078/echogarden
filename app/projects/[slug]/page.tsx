import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { ProjectDetail } from "@/components/project-detail";

export function generateStaticParams() { return projects.map(({ id }) => ({ slug: id })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.id === slug);
  return { title: `${project?.title || "Project not found"} — Echo’s Garden`, description: project?.summary };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!projects.some((p) => p.id === slug)) notFound();
  return <ProjectDetail slug={slug} />;
}
