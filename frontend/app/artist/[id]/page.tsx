import type { Metadata } from "next"
import { notFound } from "next/navigation"
import ArtistView from "@/components/artist-view"
import { artists } from "@/lib/data"

interface ArtistPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ArtistPageProps): Promise<Metadata> {
  const artist = artists.find((a) => a.id === params.id)

  if (!artist) {
    return {
      title: "Artist Not Found - BeatSync",
    }
  }

  return {
    title: `${artist.name} - BeatSync`,
    description: `Explore ${artist.name}'s music on BeatSync`,
  }
}

export default function ArtistPage({ params }: ArtistPageProps) {
  const artist = artists.find((a) => a.id === params.id)

  if (!artist) {
    notFound()
  }

  return <ArtistView artist={artist} />
}

