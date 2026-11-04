"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import { PortfolioContent, PortfolioImage, SoundCloudTrack, YouTubeVideo } from "@/components/portfolio-content";
import source from "@/data/portfolio-source.json";
import { musicWorks } from "@/data/music";

export function MusicPages({ section }: { section?: "piano-performance" | "music-production" }) {
  const { isZh } = useLanguage();
  const title = section === "piano-performance" ? (isZh ? "钢琴演奏" : "Piano Performance") : section === "music-production" ? (isZh ? "音乐制作" : "Music Production") : (isZh ? "音乐" : "Music");
  const page = source[section || "echos-music"];
  return (
    <div className="min-h-screen bg-background px-6 py-8 md:px-12 md:py-12">
      <div className={`mx-auto ${section ? "max-w-4xl" : "max-w-6xl"}`}>
        {section && <Link href="/music" className="mb-10 inline-block text-xs text-muted-foreground hover:text-primary">← {isZh ? "全部音乐" : "All music"}</Link>}
        <header className="mb-10">
          <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">{isZh ? "声音与创作" : "Sound & practice"}</p>
          <h1 className="mb-5 font-serif text-4xl font-light tracking-tight md:text-5xl">{title}</h1>
          <p className="max-w-xl text-sm leading-7 text-muted-foreground">{section === "piano-performance" ? "On the Journey of Sound & Soul…" : section === "music-production" ? "From Waveform to Emotion…" : (isZh ? "古典钢琴演奏、录音、混音与母带制作。" : "Classical piano performance, recording, mixing and mastering.")}</p>
        </header>

        {!section && <>
          <div className="grid gap-6 md:grid-cols-2">
            {([
              { id: "piano-performance", title: isZh ? "钢琴演奏" : "Piano Performance", image: "/portfolio/piano-performance/01.jpg", text: isZh ? "从四岁开始的古典钢琴学习，到多伦多大学的舞台。收录《努玛阿美》演奏侧拍与旧站记录的曲目。" : "A classical piano journey that began at age four. Explore the Numa Ame recital recording and repertoire documented in the original portfolio." },
              { id: "music-production", title: isZh ? "音乐制作" : "Music Production", image: musicWorks[0].image, text: isZh ? "收听两首真实录音作品，了解录音、混音与母带制作，查看完整演奏者署名和录音文档。" : "Listen to two recording projects, with performer credits, production notes and session documentation." },
            ]).map((item) => <Link key={item.id} href={`/music/${item.id}`} className="group overflow-hidden rounded-lg border border-foreground/10 bg-card/40 transition-all hover:border-primary/30 hover:bg-card/60 hover:shadow-md">
              <div className="h-64 overflow-hidden bg-secondary/30"><img src={item.image} alt={item.title} width={800} height={600} className={`h-full w-full ${item.id === "music-production" ? "object-contain p-5" : "object-cover"}`} /></div>
              <div className="p-6"><p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{item.id === "piano-performance" ? "01 / Performance" : "02 / Production"}</p><h2 className="mb-3 font-serif text-2xl group-hover:text-primary">{item.title}</h2><p className="mb-6 text-sm leading-7 text-muted-foreground">{item.text}</p><span className="text-xs text-primary">{isZh ? "探索作品 →" : "Explore the collection →"}</span></div>
            </Link>)}
          </div>
          <section className="mt-12 max-w-3xl rounded-lg border border-foreground/10 bg-card/30 p-6 sm:p-8">
            <h2 className="mb-5 font-serif text-2xl">{isZh ? "创作背景" : "A musical practice"}</h2>
            <p className="mb-4 text-sm leading-7 text-muted-foreground">{isZh ? "旧作品集记录了 Echo 在多伦多大学修读音乐演奏辅修期间，对浪漫主义与当代钢琴音乐的兴趣，以及录音和声学课程中的实践。" : "The original portfolio documents a Music Performance minor alongside Electrical Engineering at the University of Toronto, with a particular interest in Romantic and contemporary piano music."}</p>
            <p className="text-sm leading-7 text-muted-foreground">{isZh ? "音乐制作实践包括录音、混音、母带制作、批判性聆听，以及作为 AES 学生成员参与音频技术活动。" : "Recording and acoustics coursework led to studio practice in recording, mixing and mastering contemporary classical music, alongside critical listening and involvement as an Audio Engineering Society student member."}</p>
          </section>
          <Link href="/diary" className="mt-8 inline-block text-xs text-primary underline underline-offset-4">{isZh ? "声音标本 / 日常声音笔记 →" : "Music specimens / daily sound notes →"}</Link>
        </>}

        {section === "piano-performance" && <>
          <div className="grid items-start gap-8 md:grid-cols-[1fr_1.3fr]">
            <PortfolioImage block={source["piano-performance"].blocks.find((b) => b.type === "image")!} />
            <div className="pt-5"><h2 className="mb-5 font-serif text-2xl">{isZh ? "钢琴与表达" : "Piano as a language"}</h2><p className="text-sm leading-7 text-muted-foreground">{isZh ? "Echo 四岁开始学习古典钢琴。旧站记录了从技术训练到音乐表达的转变：理解作曲家的意图，用触键、乐句与情感和听众交流。" : "I began classical piano training at the age of four. Over the years, my perspective evolved from precision and technique toward interpretation, expression and connection with the audience. Works by Bach, Mozart, Haydn and Liszt helped shape my touch, discipline and phrasing."}</p><p className="mt-5 text-xs leading-6 text-muted-foreground">{isZh ? "本页依据旧作品集记录；曲目与学习状态不代表 2026 年的最新安排。" : "This page preserves the original portfolio record; study status and repertoire are not presented as a current schedule."}</p></div>
          </div>
          <section className="mt-10">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">2025 / Showcase Recital</p>
            <h2 className="mb-3 mt-3 font-serif text-3xl">Numa Ame · 努玛阿美</h2>
            <p className="text-sm leading-7 text-muted-foreground">{isZh ? "作曲：张朝 · 钢琴：Echo Chen。多伦多大学工程学院与音乐学院联合举办的 Showcase Recital，Hart House。" : "Zhang Zhao — composer · Echo Chen — piano. Showcase Recital jointly presented by the Faculty of Applied Science & Engineering and the Faculty of Music at Hart House, University of Toronto."}</p>
            <YouTubeVideo videoId="QoyciVdkIsc" title="Numa Ame — 2025 Showcase Recital (side video)" />
            <p className="rounded-lg border border-foreground/10 bg-card/40 p-5 text-xs leading-6 text-muted-foreground">{isZh ? "现有素材为侧拍版本。旧站提到正式混音音频与全场录像仍在制作中；此次未获取正式发行素材。" : "This is the original side-angle recording. The original portfolio described a formal release with mixed audio and full-program video as in progress; those materials were not available for this migration."}</p>
          </section>
          <section className="mt-12"><h2 className="mb-4 font-serif text-2xl">{isZh ? "旧站记录的曲目" : "Repertoire from the original portfolio"}</h2><ul className="space-y-3 text-sm leading-7 text-muted-foreground"><li>Zhang Zhao — Numa Ame</li><li>Franz Schubert — Six Moments Musicaux</li><li>Mozart — KV 309, K 485, K 331</li></ul></section>
          <PortfolioContent blocks={source["piano-performance"].blocks.filter((b) => b.type === "image").slice(1)} />
        </>}

        {section === "music-production" && <div className="space-y-10">
          {musicWorks.map((work) => <article key={work.id} id={work.id} className="scroll-mt-20 rounded-lg border border-foreground/10 bg-card/40 p-5 sm:p-8">
            <p className="mb-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">{work.date}</p>
            <div className="flex flex-col items-start gap-5 sm:flex-row"><img src={work.image} alt={`${work.title} — original SoundCloud artwork`} width={120} height={120} className="h-28 w-28 shrink-0 rounded-md object-cover" /><div className="min-w-0"><h2 className="mb-3 font-serif text-2xl sm:text-3xl">{work.title}</h2><p className="text-sm leading-7">{work.composer}</p><p className="mt-2 text-sm leading-7 text-muted-foreground">{work.performers}</p></div></div>
            <p className="mt-5 text-sm leading-7 text-primary">{work.credit}</p><p className="mt-2 text-xs leading-6 text-muted-foreground">{work.context}</p>
            <SoundCloudTrack url={work.url} title={work.title} />
            <p className="text-sm leading-7 text-muted-foreground">{work.description}</p>
            <a href={work.documentation} target="_blank" rel="noreferrer" className="mt-6 inline-block rounded-md border border-primary/20 bg-card/60 px-4 py-3 text-xs text-primary hover:bg-secondary/60">{isZh ? "录音与混音文档 ↗" : "Recording & mixing documentation ↗"}</a>
          </article>)}
        </div>}
        <footer className="mt-14 border-t border-foreground/10 pt-6"><a href={page.sourceUrl} target="_blank" rel="noreferrer" className="text-xs text-primary underline underline-offset-4">{isZh ? "旧作品集原始页面 ↗" : "Original portfolio page ↗"}</a>{section && <Link href={section === "piano-performance" ? "/music/music-production" : "/music/piano-performance"} className="mt-8 block text-sm text-primary">{section === "piano-performance" ? (isZh ? "探索音乐制作 →" : "Explore music production →") : (isZh ? "探索钢琴演奏 →" : "Explore piano performance →")}</Link>}</footer>
      </div>
    </div>
  );
}
