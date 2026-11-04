import type { Metadata } from "next";
import { MusicPages } from "@/components/music-pages";
export const metadata: Metadata = { title: "Music Production — Echo’s Garden", description: "Distance de Fée and Improvisation in A-Flat: recording, mixing and mastering with full performer credits and session documentation." };
export default function Page() { return <MusicPages section="music-production" />; }
