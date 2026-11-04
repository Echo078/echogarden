"use client";

import Link from "next/link";
import { BotanicalBackground } from "@/components/botanical-background";
import { RandomAudioPlayer } from "@/components/random-audio-player";
import { TypingText } from "@/components/typing-text";
import { EchoWall } from "@/components/echo-wall";
import { updates, formatUpdateDate } from "@/data/updates";
import { useLanguage } from "@/components/language-provider";
import { translations } from "@/lib/translations";

export default function HomePage() {
  const { lang, t } = useLanguage();
  const recentUpdates = updates.slice(0, 4);

  // Get garden pages with translations
  const gardenPages = [
    {
      href: "/about",
      title: translations.gardenPages.about.title[lang],
      points: translations.gardenPages.about.points[lang],
    },
    {
      href: "/research",
      title: translations.gardenPages.research.title[lang],
      points: translations.gardenPages.research.points[lang],
    },
    {
      href: "/projects",
      title: translations.gardenPages.projects.title[lang],
      points: translations.gardenPages.projects.points[lang],
    },
    {
      href: "/music",
      title: lang === "zh" ? "音乐" : "Music",
      points: lang === "zh" ? ["钢琴演奏", "录音、混音与母带制作"] : ["Piano performance", "Recording, mixing & mastering"],
    },
    {
      href: "/blog",
      title: translations.gardenPages.blog.title[lang],
      points: translations.gardenPages.blog.points[lang],
    },
    {
      href: "/knowledge",
      title: translations.gardenPages.knowledge.title[lang],
      points: translations.gardenPages.knowledge.points[lang],
    },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Full-page botanical background with rain */}
      <BotanicalBackground />

      {/* Content layer */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="px-6 pb-12 pt-10 md:px-12 md:pb-16 md:pt-14">
          <div className="mx-auto max-w-5xl">
            <div className="grid items-start gap-10 md:grid-cols-5 md:gap-12">
              {/* Left: Welcome Text */}
              <div className="md:col-span-3">
                <header className="rounded-xl bg-background/70 p-6 backdrop-blur-lg md:bg-background/50 md:p-6 md:backdrop-blur-md">
                  <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/60">
                    {t("home.tagline")}
                  </p>
                  <h1 className="mb-5 font-serif text-2xl font-normal tracking-tight text-foreground md:text-3xl">
                    <TypingText 
                      text={t("home.welcome")} 
                      typingSpeed={70}
                      deletingSpeed={40}
                      pauseDuration={3000}
                    />
                  </h1>
                  <p className="max-w-md text-[15px] leading-[1.7] text-foreground/85">
                    {t("home.description")}
                  </p>
                </header>
              </div>

              {/* Right: Audio Player */}
              <div className="md:col-span-2">
                <RandomAudioPlayer />
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="px-6 pb-16 md:px-12 md:pb-24">
          <div className="mx-auto max-w-5xl">
            {/* Two Column Layout */}
            <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
              {/* Left: Explore */}
              <div className="lg:col-span-2">
                <section>
                  <div className="mb-5 flex items-center gap-4">
                    <h2 className="font-serif text-base font-normal text-foreground">
                      {t("home.exploreTitle")}
                    </h2>
                    <div className="h-px flex-1 bg-foreground/10" aria-hidden="true" />
                  </div>

                  {/* 3-column grid with glass cards - improved readability */}
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {gardenPages.map((page) => (
                      <Link
                        key={page.href}
                        href={page.href}
                        className="group rounded-lg border border-foreground/10 bg-card/50 p-4 backdrop-blur-md transition-all hover:border-primary/25 hover:bg-card/70 hover:shadow-md"
                      >
                        <h3 className="mb-2 font-serif text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                          {page.title}
                        </h3>
                        <ul className="space-y-1.5">
                          {page.points.map((point, i) => (
                            <li
                              key={i}
                              className="flex items-center gap-2 text-[11px] text-foreground/60"
                            >
                              <span className="h-px w-2 bg-current opacity-60" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </Link>
                    ))}
                  </div>
                </section>
              </div>

              {/* Right: Recent Updates */}
              <div>
                <section className="rounded-xl bg-card/50 p-5 backdrop-blur-md">
                  <div className="mb-5 flex items-center gap-4">
                    <h2 className="font-serif text-base font-semibold text-foreground">
                      {t("home.recentUpdates")}
                    </h2>
                    <div className="h-px flex-1 bg-foreground/10 lg:hidden" aria-hidden="true" />
                  </div>

                  <div className="space-y-4">
                    {recentUpdates.map((update) => (
                      <div
                        key={update.id}
                        className="border-l-2 border-foreground/15 pl-4 transition-colors hover:border-primary/40"
                      >
                        <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-foreground/50">
                          {formatUpdateDate(update.date)}
                        </p>
                        <p className="text-[13px] leading-relaxed text-foreground/80">
                          {update.content}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* View all link */}
                  <div className="mt-5 pt-4 border-t border-foreground/6">
                    <Link
                      href="/blog"
                      className="inline-flex items-center gap-1.5 text-[10px] text-muted-foreground/60 transition-colors hover:text-primary"
                    >
                      <span>{t("home.viewAllUpdates")}</span>
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
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </section>
              </div>
            </div>

            {/* Full-width Echo Wall Section */}
            <EchoWall />
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-foreground/5 bg-background/50 px-6 py-6 backdrop-blur-sm md:px-12">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <p className="text-[10px] text-muted-foreground/50">
              {t("home.ongoingCollection")}
            </p>
            <p className="text-[10px] text-muted-foreground/50">
              {t("home.established")}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
