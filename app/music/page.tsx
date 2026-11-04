import type { Metadata } from "next";
import { MusicPages } from "@/components/music-pages";
export const metadata: Metadata = { title: "Music — Echo’s Garden", description: "Echo Chen’s classical piano performances and recording, mixing and mastering projects." };
export default function Page() { return <MusicPages />; }
