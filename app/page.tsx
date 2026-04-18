import Link from "next/link";
import { BotanicalBackground } from "@/components/botanical-background";
import { RandomAudioPlayer } from "@/components/random-audio-player";
import { TypingText } from "@/components/typing-text";
import { updates, formatUpdateDate } from "@/data/updates";

const gardenPages = [
  {
    href: "/about",
    title: "About",
    points: ["Who I am", "Research interests", "Background"],
  },
  {
    href: "/research",
    title: "Research",
    points: ["Sonic interaction", "Embodied computing", "Current focus"],
  },
  {
    href: "/projects",
    title: "Projects",
    points: ["Cross-disciplinary work", "Prototypes", "Experiments"],
  },
  {
    href: "/diary",
    title: "Music Specimens",
    points: ["Daily improvisations", "Sound notes", "Piano pieces"],
  },
  {
    href: "/blog",
    title: "Blog",
    points: ["Essays", "Reflections", "Collected fragments"],
  },
  {
    href: "/knowledge",
    title: "Knowledge",
    points: ["Reference notes", "Formulas", "Learning traces"],
  },
];

export default function HomePage() {
  const recentUpdates = updates.slice(0, 4);

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
                <header className="rounded-xl bg-background/60 p-6 backdrop-blur-md md:bg-transparent md:p-0 md:backdrop-blur-none">
                  <p className="mb-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
                    A space for sound, research & growing ideas
                  </p>
                  <h1 className="mb-4 font-serif text-2xl font-light tracking-tight text-foreground md:text-3xl">
                    <TypingText 
                      text="Hello, welcome to Echo Garden" 
                      typingSpeed={70}
                      deletingSpeed={40}
                      pauseDuration={3000}
                    />
                  </h1>
                  <p className="max-w-md text-sm leading-relaxed text-foreground/75">
                    A quiet digital garden where research meets creation. Here you will find 
                    daily sound improvisations, essays on listening, and traces of inquiry 
                    into sonic interaction and embodied computing.
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
                      Explore the Garden
                    </h2>
                    <div className="h-px flex-1 bg-foreground/10" aria-hidden="true" />
                  </div>

                  {/* 3-column grid with glass cards */}
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {gardenPages.map((page) => (
                      <Link
                        key={page.href}
                        href={page.href}
                        className="group rounded-lg border border-foreground/8 bg-card/40 p-4 backdrop-blur-sm transition-all hover:border-primary/20 hover:bg-card/60 hover:shadow-sm"
                      >
                        <h3 className="mb-2 font-serif text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                          {page.title}
                        </h3>
                        <ul className="space-y-1">
                          {page.points.map((point, i) => (
                            <li
                              key={i}
                              className="flex items-center gap-2 text-[10px] text-muted-foreground/60"
                            >
                              <span className="h-px w-2 bg-current opacity-50" />
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
                <section className="rounded-xl bg-card/30 p-5 backdrop-blur-sm">
                  <div className="mb-5 flex items-center gap-4">
                    <h2 className="font-serif text-base font-normal text-foreground">
                      Recent Updates
                    </h2>
                    <div className="h-px flex-1 bg-foreground/8 lg:hidden" aria-hidden="true" />
                  </div>

                  <div className="space-y-4">
                    {recentUpdates.map((update) => (
                      <div
                        key={update.id}
                        className="border-l-2 border-foreground/10 pl-4 transition-colors hover:border-primary/30"
                      >
                        <p className="mb-1 font-mono text-[9px] uppercase tracking-wider text-muted-foreground/50">
                          {formatUpdateDate(update.date)}
                        </p>
                        <p className="text-xs leading-relaxed text-foreground/70">
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
                      <span>View all updates</span>
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
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-foreground/5 bg-background/50 px-6 py-6 backdrop-blur-sm md:px-12">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <p className="text-[10px] text-muted-foreground/50">
              Ongoing collection
            </p>
            <p className="text-[10px] text-muted-foreground/50">
              Est. 2024
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
