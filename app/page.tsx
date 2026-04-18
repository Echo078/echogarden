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
  {
    href: "/cv",
    title: "CV",
    points: ["Education", "Experience", "Publications"],
  },
];

export default function HomePage() {
  const recentUpdates = updates.slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Botanical Animation */}
      <section className="relative overflow-hidden">
        {/* Botanical Scene */}
        <div className="absolute inset-0 h-[500px] md:h-[550px]">
          <BotanicalScene />
        </div>

        {/* Hero Content */}
        <div className="relative px-6 pb-16 pt-12 md:px-12 md:pb-24 md:pt-16">
          <div className="mx-auto max-w-4xl">
            <header className="mb-8">
              <p className="mb-6 text-xs uppercase tracking-widest text-muted-foreground/70">
                A space for sound, research & growing ideas
              </p>
              <h1 className="mb-6 font-serif text-4xl font-light tracking-tight text-foreground md:text-5xl lg:text-6xl">
                Hello, welcome to
                <br />
                <span className="italic">Echo Garden</span>
              </h1>
              <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
                A quiet digital garden where research meets creation. Here you will find 
                daily sound improvisations, essays on listening, technical notes, and 
                traces of ongoing inquiry into sonic interaction and embodied computing.
              </p>
            </header>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="px-6 pb-16 md:px-12 md:pb-24">
        <div className="mx-auto max-w-5xl">
          {/* Two Column Layout */}
          <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
            {/* Left Column: Explore + Audio */}
            <div className="lg:col-span-2">
              {/* Explore the Garden */}
              <section className="mb-12">
                <div className="mb-6 flex items-center gap-4">
                  <h2 className="font-serif text-lg font-normal text-foreground">
                    Explore the Garden
                  </h2>
                  <div className="h-px flex-1 bg-foreground/10" aria-hidden="true" />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {gardenPages.map((page) => (
                    <Link
                      key={page.href}
                      href={page.href}
                      className="group rounded-lg border border-foreground/8 bg-card/30 p-4 transition-all hover:border-primary/20 hover:bg-card/50"
                    >
                      <h3 className="mb-2 font-serif text-base font-medium text-foreground transition-colors group-hover:text-primary">
                        {page.title}
                      </h3>
                      <ul className="space-y-0.5">
                        {page.points.map((point, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-2 text-xs text-muted-foreground/70"
                          >
                            <span className="h-0.5 w-0.5 rounded-full bg-current" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Random Audio Player */}
              <section>
                <div className="mb-6 flex items-center gap-4">
                  <h2 className="font-serif text-lg font-normal text-foreground">
                    Listen to a Random Specimen
                  </h2>
                  <div className="h-px flex-1 bg-foreground/10" aria-hidden="true" />
                </div>
                <div className="max-w-md">
                  <RandomAudioPlayer />
                </div>
              </section>
            </div>

            {/* Right Column: Recent Updates */}
            <div>
              <section>
                <div className="mb-6 flex items-center gap-4">
                  <h2 className="font-serif text-lg font-normal text-foreground">
                    Recent Updates
                  </h2>
                  <div className="h-px flex-1 bg-foreground/10 lg:hidden" aria-hidden="true" />
                </div>

                <div className="space-y-4">
                  {recentUpdates.map((update) => (
                    <div
                      key={update.id}
                      className="border-l-2 border-foreground/8 pl-4"
                    >
                      <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60">
                        {formatUpdateDate(update.date)}
                      </p>
                      <p className="text-sm leading-relaxed text-foreground/80">
                        {update.content}
                      </p>
                    </div>
                  ))}
                </div>

                {/* View all link */}
                <div className="mt-6">
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/70 transition-colors hover:text-primary"
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
      <footer className="border-t border-foreground/6 px-6 py-8 md:px-12">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <p className="text-xs text-muted-foreground/60">
            Ongoing collection
          </p>
          <p className="text-xs text-muted-foreground/60">
            Est. 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
