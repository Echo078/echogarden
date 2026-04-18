"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { projects, domains, projectTypes, allSkills } from "@/data/projects";

// Domain color mapping
const domainColors: Record<string, string> = {
  mechanical: "bg-amber-100/60 text-amber-800/70 border-amber-200/50",
  hardware: "bg-sky-100/60 text-sky-800/70 border-sky-200/50",
  software: "bg-violet-100/60 text-violet-800/70 border-violet-200/50",
  acoustic: "bg-emerald-100/60 text-emerald-800/70 border-emerald-200/50",
};

const projectTypeColors: Record<string, string> = {
  course: "bg-secondary/40 text-muted-foreground/70",
  hackathon: "bg-secondary/40 text-muted-foreground/70",
  personal: "bg-secondary/40 text-muted-foreground/70",
  research: "bg-secondary/40 text-muted-foreground/70",
};

export default function ProjectsPage() {
  const [activeDomains, setActiveDomains] = useState<string[]>([]);
  const [activeTypes, setActiveTypes] = useState<string[]>([]);
  const [activeSkills, setActiveSkills] = useState<string[]>([]);

  // Get skills that appear in projects
  const usedSkills = useMemo(() => {
    const skillSet = new Set<string>();
    projects.forEach((p) => p.skills.forEach((s) => skillSet.add(s)));
    return allSkills.filter((s) => skillSet.has(s));
  }, []);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Domain filter
      if (activeDomains.length > 0 && !project.domains.some((d) => activeDomains.includes(d))) {
        return false;
      }
      // Type filter
      if (activeTypes.length > 0 && !activeTypes.includes(project.projectType)) {
        return false;
      }
      // Skills filter
      if (activeSkills.length > 0 && !project.skills.some((s) => activeSkills.includes(s))) {
        return false;
      }
      return true;
    });
  }, [activeDomains, activeTypes, activeSkills]);

  const toggleDomain = (domain: string) => {
    setActiveDomains((prev) =>
      prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain]
    );
  };

  const toggleType = (type: string) => {
    setActiveTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleSkill = (skill: string) => {
    setActiveSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const clearAllFilters = () => {
    setActiveDomains([]);
    setActiveTypes([]);
    setActiveSkills([]);
  };

  const hasActiveFilters = activeDomains.length > 0 || activeTypes.length > 0 || activeSkills.length > 0;

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 py-10 md:px-12 md:py-14">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/"
            className="mb-12 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
          >
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
              aria-hidden="true"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            <span>Return</span>
          </Link>

          <div className="flex items-end justify-between">
            <div>
              <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">
                Project Archive
              </p>
              <h1 className="mb-4 font-serif text-4xl font-light tracking-tight text-foreground md:text-5xl">
                Projects
              </h1>
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                Cross-disciplinary work spanning mechanical, hardware, software, and acoustic domains.
              </p>
            </div>
            <p className="hidden text-right text-sm text-muted-foreground md:block">
              <span className="font-serif text-3xl font-light text-foreground">
                {projects.length}
              </span>
              <br />
              projects
            </p>
          </div>
        </div>
      </header>

      {/* Filter Bar */}
      <section className="px-6 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-xl border border-foreground/10 bg-card/50 px-6 py-5 shadow-sm backdrop-blur-sm md:px-8 md:py-6">
            {/* Filter Header */}
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary/60"
                >
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                <span className="font-serif text-sm font-medium text-foreground">
                  Filter Projects
                </span>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-1.5 rounded-full border border-foreground/10 px-3 py-1 text-xs text-muted-foreground transition-all hover:border-foreground/20 hover:bg-secondary/30 hover:text-foreground"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                  Clear all
                </button>
              )}
            </div>

            {/* Filter Groups in a horizontal layout */}
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-8">
              {/* Domain Filters */}
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                  Domain
                </span>
                <div className="flex flex-wrap gap-2">
                  {domains.map((domain) => (
                    <button
                      key={domain.id}
                      onClick={() => toggleDomain(domain.id)}
                      className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                        activeDomains.includes(domain.id)
                          ? domainColors[domain.id] + " shadow-sm"
                          : "border-foreground/8 bg-background/50 text-muted-foreground hover:border-foreground/15 hover:bg-background"
                      }`}
                    >
                      <span className={activeDomains.includes(domain.id) ? "opacity-80" : "opacity-50"}>{domain.icon}</span>
                      {domain.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="hidden h-16 w-px bg-foreground/8 lg:block" />

              {/* Project Type Filters */}
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                  Type
                </span>
                <div className="flex flex-wrap gap-2">
                  {projectTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => toggleType(type.id)}
                      className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                        activeTypes.includes(type.id)
                          ? "border-primary/40 bg-primary/15 text-primary shadow-sm"
                          : "border-foreground/8 bg-background/50 text-muted-foreground hover:border-foreground/15 hover:bg-background"
                      }`}
                    >
                      <span className={activeTypes.includes(type.id) ? "opacity-80" : "opacity-50"}>{type.icon}</span>
                      {type.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="hidden h-16 w-px bg-foreground/8 lg:block" />

              {/* Skills Filters */}
              <div className="flex flex-1 flex-col gap-2">
                <span className="font-mono text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                  Skills
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {usedSkills.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`rounded-md px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider transition-all ${
                        activeSkills.includes(skill)
                          ? "bg-primary/20 text-primary shadow-sm"
                          : "bg-secondary/40 text-muted-foreground/70 hover:bg-secondary/60 hover:text-muted-foreground"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Active filters summary */}
            {hasActiveFilters && (
              <div className="mt-5 flex items-center gap-2 border-t border-foreground/6 pt-4">
                <span className="text-xs text-muted-foreground/60">Active:</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeDomains.map((d) => (
                    <span key={d} className={`rounded-full border px-2 py-0.5 text-[10px] ${domainColors[d]}`}>
                      {domains.find((dom) => dom.id === d)?.name}
                    </span>
                  ))}
                  {activeTypes.map((t) => (
                    <span key={t} className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
                      {projectTypes.find((type) => type.id === t)?.name}
                    </span>
                  ))}
                  {activeSkills.map((s) => (
                    <span key={s} className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] text-primary">
                      {s}
                    </span>
                  ))}
                </div>
                <span className="ml-auto font-mono text-xs text-muted-foreground/50">
                  {filteredProjects.length} results
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="px-6 py-12 md:px-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          {/* Results count */}
          <div className="mb-8 flex items-center gap-4">
            <h2 className="font-serif text-base font-normal italic text-muted-foreground">
              {hasActiveFilters ? "Filtered Results" : "All Projects"}
            </h2>
            <div className="h-px flex-1 bg-foreground/10" aria-hidden="true" />
            <span className="font-mono text-xs text-muted-foreground/50">
              {filteredProjects.length}
            </span>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => {
              const projectTypeInfo = projectTypes.find((t) => t.id === project.projectType);

              return (
                <article
                  key={project.id}
                  className="group flex flex-col rounded-lg border border-foreground/8 bg-card/40 p-5 transition-all hover:border-foreground/12 hover:bg-card/60 hover:shadow-md"
                >
                  {/* Visual marker area */}
                  <div className="mb-4 flex h-24 items-center justify-center rounded-md bg-secondary/20">
                    <div className="flex gap-2">
                      {project.domains.map((domain) => {
                        const domainInfo = domains.find((d) => d.id === domain);
                        return (
                          <span
                            key={domain}
                            className="text-2xl opacity-30"
                            title={domainInfo?.name}
                          >
                            {domainInfo?.icon}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Header */}
                  <div className="mb-2 flex items-center gap-2">
                    <span className="font-mono text-[10px] text-muted-foreground/50">
                      {project.year}
                    </span>
                    <span className="text-muted-foreground/30">·</span>
                    <span className={`rounded px-1.5 py-0.5 text-[9px] uppercase tracking-wider ${projectTypeColors[project.projectType]}`}>
                      {projectTypeInfo?.name}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 font-serif text-lg font-normal leading-snug text-foreground transition-colors group-hover:text-primary">
                    {project.title}
                  </h3>

                  {/* Summary */}
                  <p className="mb-4 flex-1 text-xs leading-relaxed text-muted-foreground/70">
                    {project.summary}
                  </p>

                  {/* Domain tags */}
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {project.domains.map((domain) => {
                      const domainInfo = domains.find((d) => d.id === domain);
                      return (
                        <span
                          key={domain}
                          className={`rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-wider ${domainColors[domain]}`}
                        >
                          {domainInfo?.name}
                        </span>
                      );
                    })}
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1">
                    {project.skills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="rounded bg-secondary/30 px-1.5 py-0.5 text-[8px] uppercase tracking-wider text-muted-foreground/50"
                      >
                        {skill}
                      </span>
                    ))}
                    {project.skills.length > 4 && (
                      <span className="px-1 text-[8px] text-muted-foreground/40">
                        +{project.skills.length - 4}
                      </span>
                    )}
                  </div>

                  {/* View indicator */}
                  <div className="mt-4 flex items-center gap-1.5 text-[10px] text-muted-foreground/40 transition-all group-hover:gap-2 group-hover:text-primary/70">
                    <span className="font-serif italic">View details</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="9"
                      height="9"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-0.5"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Empty state */}
          {filteredProjects.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="font-serif text-base italic text-muted-foreground/50">
                No projects match the current filters
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-4 text-xs text-muted-foreground/60 underline underline-offset-2 transition-colors hover:text-muted-foreground"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Footer */}
          <footer className="mt-20 flex items-center justify-center gap-6 text-xs uppercase tracking-widest text-muted-foreground/40">
            <span>Cross-disciplinary work</span>
            <span className="h-px w-10 bg-foreground/10" aria-hidden="true" />
            <span>Est. 2023</span>
          </footer>
        </div>
      </section>
    </main>
  );
}
