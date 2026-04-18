"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import { translations } from "@/lib/translations";

export default function AboutPage() {
  const { lang, t } = useLanguage();
  const aboutT = translations.about;

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content - Two Columns */}
      <div className="px-6 py-10 md:px-12 md:py-14">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col gap-12 md:flex-row md:gap-16">
            
            {/* Left Sidebar: Photo, Name, Connect */}
            <aside className="shrink-0 md:w-56">
              {/* Portrait */}
              <div className="mb-5 overflow-hidden rounded-lg border border-foreground/10">
                <div className="flex aspect-square items-center justify-center bg-secondary/30">
                  <span className="font-serif text-6xl text-muted-foreground/30">E</span>
                </div>
              </div>

              {/* Name & Title */}
              <div className="mb-5 text-center md:text-left">
                <h1 className="mb-1 font-serif text-2xl font-light text-foreground">
                  Echo Chen
                </h1>
                <p className="mb-0.5 text-sm font-medium text-primary">
                  {aboutT.graduateResearcher[lang]}
                </p>
                <p className="text-xs text-muted-foreground">
                  {aboutT.department[lang]}
                </p>
              </div>

              {/* Connect Icons */}
              <div className="mb-6 flex justify-center gap-2.5 md:justify-start">
                <a 
                  href="mailto:echo@example.com" 
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/10 text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
                  title="Email"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </a>
                <a 
                  href="#" 
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/10 text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
                  title="GitHub"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                </a>
                <a 
                  href="#" 
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/10 text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
                  title="Google Scholar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                </a>
                <a 
                  href="#" 
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/10 text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
                  title="LinkedIn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
                <a 
                  href="#" 
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/10 text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
                  title="CV"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                </a>
              </div>

              {/* Research Interests */}
              <div className="mb-6">
                <h2 className="mb-3 font-serif text-sm font-medium text-foreground">
                  {aboutT.researchInterests[lang]}
                </h2>
                <ul className="space-y-1">
                  {aboutT.interests[lang].map((interest, i) => (
                    <li key={i} className="text-sm text-muted-foreground">{interest}</li>
                  ))}
                </ul>
              </div>

              {/* Explore More */}
              <div>
                <h2 className="mb-3 font-serif text-sm font-medium text-foreground">
                  {aboutT.explore[lang]}
                </h2>
                <div className="flex flex-col gap-2">
                  <Link 
                    href="/research"
                    className="flex items-center justify-center rounded-md border border-foreground/12 bg-card/40 px-3 py-2 text-sm text-foreground transition-all hover:border-primary/30 hover:bg-primary/8 hover:text-primary"
                  >
                    {aboutT.researchJourney[lang]}
                  </Link>
                  <Link 
                    href="/projects"
                    className="flex items-center justify-center rounded-md border border-foreground/12 bg-card/40 px-3 py-2 text-sm text-foreground transition-all hover:border-primary/30 hover:bg-primary/8 hover:text-primary"
                  >
                    {translations.nav.projects[lang]}
                  </Link>
                  <Link 
                    href="/diary"
                    className="flex items-center justify-center rounded-md border border-foreground/12 bg-card/40 px-3 py-2 text-sm text-foreground transition-all hover:border-primary/30 hover:bg-primary/8 hover:text-primary"
                  >
                    {aboutT.soundDiary[lang]}
                  </Link>
                  <Link 
                    href="/blog"
                    className="flex items-center justify-center rounded-md border border-foreground/12 bg-card/40 px-3 py-2 text-sm text-foreground transition-all hover:border-primary/30 hover:bg-primary/8 hover:text-primary"
                  >
                    {aboutT.writing[lang]}
                  </Link>
                </div>
              </div>
            </aside>

            {/* Right Content: Conversational About */}
            <div className="flex-1">
              {/* About - Main narrative */}
              <section className="pb-8">
                <h2 className="mb-5 font-serif text-2xl font-light text-foreground">
                  {aboutT.title[lang]}
                </h2>
                <div className="space-y-4 text-base leading-relaxed text-foreground/85">
                  <p>
                    {aboutT.greeting[lang]}{" "}
                    <a href="#" className="text-primary hover:underline">{aboutT.advisorName[lang]}</a>。
                    {aboutT.greetingEnd[lang]}
                  </p>
                </div>
              </section>

              {/* Divider */}
              <div className="mb-8 h-px bg-foreground/10" aria-hidden="true" />

              {/* Research Interests - In my own words */}
              <section className="pb-6">
                <h2 className="mb-4 font-serif text-lg font-light text-foreground">
                  {aboutT.whatICareAbout[lang]}
                </h2>
                <div className="space-y-3 text-sm leading-relaxed text-foreground/80">
                  <p>{aboutT.curiosity[lang]}</p>
                  <ul className="ml-4 space-y-1.5 text-muted-foreground">
                    {aboutT.questions[lang].map((question, i) => (
                      <li key={i}>• {question}</li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Experience & Current Direction */}
              <section className="pb-8">
                <h2 className="mb-4 font-serif text-lg font-light text-foreground">
                  {aboutT.whereFrom[lang]}
                </h2>
                <div className="space-y-3 text-sm leading-relaxed text-foreground/80">
                  <p>{aboutT.background[lang]}</p>
                  <p>{aboutT.currentWork[lang]}</p>
                </div>
              </section>

              {/* Divider */}
              <div className="mb-8 h-px bg-foreground/10" aria-hidden="true" />

              {/* Personal Touch */}
              <section className="pb-8">
                <h2 className="mb-4 font-serif text-lg font-light text-foreground">
                  {aboutT.beyondLab[lang]}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {aboutT.personalLife[lang]}
                </p>
              </section>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
