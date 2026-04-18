import Link from "next/link";
import { BotanicalScene } from "@/components/botanical-scene";
import { RandomAudioPlayer } from "@/components/random-audio-player";
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
    <div className="min-h-screen bg-background">
      {/* Hero Section - Botanical + Audio integrated */}
      <section className="relative overflow-hidden">
        {/* Botanical Scene with Rain */}
        <div className="absolute inset-0 h-[420px] md:h-[460px]">
          <BotanicalScene />
          {/* Soft gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
        </div>

        {/* Hero Content - Two columns */}
        <div className="relative px-6 pb-12 pt-10 md:px-12 md:pb-16 md:pt-12">
          <div className="mx-auto max-w-5xl">
            <div className="grid items-start gap-8 md:grid-cols-5 md:gap-12">
              {/* Left: Welcome Text */}
              <div className="md:col-span-3">
                <header>
                  <p className="mb-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
                    A space for sound, research & growing ideas
                  </p>
                  <h1 className="mb-4 font-serif text-2xl font-light tracking-tight text-foreground md:text-3xl">
                    Hello, welcome to{" "}
                    <span className="italic">Echo Garden</span>
                  </h1>
                  <p className="max-w-md text-sm leading-relaxed text-muted-foreground/80">
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
        </div>
      </section>

      {/* Main Content */}
      <div className="px-6 pb-16 md:px-12 md:pb-24">
        <div className="mx-auto max-w-5xl">
          {/* Two Column Layout */}
          <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
            {/* Left: Explore */}
            <div className="lg:col-span-2">
              {/* Explore the Garden */}
              <section>
                <div className="mb-5 flex items-center gap-4">
                  <h2 className="font-serif text-base font-normal text-foreground">
                    Explore the Garden
                  </h2>
                  <div className="h-px flex-1 bg-foreground/8" aria-hidden="true" />
                </div>

                {/* 3-column grid */}
                <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {gardenPages.map((page) => (
                    <Link
                      key={page.href}
                      href={page.href}
                      className="group rounded-lg border border-foreground/6 bg-card/25 p-3.5 transition-all hover:border-primary/15 hover:bg-card/40"
                    >
                      <h3 className="mb-1.5 font-serif text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                        {page.title}
                      </h3>
                      <ul className="space-y-0.5">
                        {page.points.map((point, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60"
                          >
                            <span className="h-0.5 w-0.5 rounded-full bg-current opacity-60" />
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
              <section>
                <div className="mb-5 flex items-center gap-4">
                  <h2 className="font-serif text-base font-normal text-foreground">
                    Recent Updates
                  </h2>
                  <div className="h-px flex-1 bg-foreground/8 lg:hidden" aria-hidden="true" />
                </div>

                <div className="space-y-3.5">
                  {recentUpdates.map((update) => (
                    <div
                      key={update.id}
                      className="border-l border-foreground/8 pl-3.5"
                    >
                      <p className="mb-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground/50">
                        {formatUpdateDate(update.date)}
                      </p>
                      <p className="text-xs leading-relaxed text-foreground/75">
                        {update.content}
                      </p>
                    </div>
                  ))}
                </div>

                {/* View all link */}
                <div className="mt-5">
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-1 text-[10px] text-muted-foreground/60 transition-colors hover:text-primary"
                  >
                    <span>View all updates</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="8"
                      height="8"
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
      <footer className="border-t border-foreground/5 px-6 py-6 md:px-12">
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
  );
}
