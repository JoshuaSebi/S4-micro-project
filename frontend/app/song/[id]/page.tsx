import type { Metadata } from "next"
import { notFound } from "next/navigation"
import SongView from "@/components/song-view"
import { songs } from "@/lib/data"

interface SongPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: SongPageProps): Promise<Metadata> {
  const song = songs.find((s) => s.id === params.id)

  if (!song) {
    return {
      title: "Song Not Found - BeatSync",
    }
  }

  return {
    title: `${song.title} - ${song.artist} | BeatSync`,
    description: `Listen to ${song.title} by ${song.artist} on BeatSync`,
  }
}

export default function SongPage({ params }: SongPageProps) {
  const song = songs.find((s) => s.id === params.id)

  if (!song) {
    notFound()
  }

  return <SongView song={song} />
}

