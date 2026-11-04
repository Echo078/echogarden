import type { Metadata } from "next";
import { MusicPages } from "@/components/music-pages";
export const metadata: Metadata = { title: "Piano Performance — Echo’s Garden", description: "Numa Ame, performed by Echo Chen at the 2025 Showcase Recital at Hart House, University of Toronto." };
export default function Page() { return <MusicPages section="piano-performance" />; }
