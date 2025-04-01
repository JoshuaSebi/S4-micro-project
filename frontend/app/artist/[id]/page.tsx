import type { Metadata } from "next"
import { notFound } from "next/navigation"
import ArtistView from "@/components/artist-view"

interface Artist {
  id: string
  name: string
  info: string
  moreInfoLink: string
  songs: {
    id: string
    name: string
    artistId: string
    songLink: string
    duration: number
  }[]
}

interface ArtistPageProps {
  params: {
    id: string
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ArtistPageProps): Promise<Metadata> {
  try {
    const artists = await fetchArtists()
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
  } catch (error) {
    return {
      title: "BeatSync",
      description: "Explore your favorite music on BeatSync",
    }
  }
}

// Fetch all artists from the API
async function fetchArtists(): Promise<Artist[]> {
  try {
    const response = await fetch("http://localhost:5000/api/artists", {
      next: { revalidate: 60 }, // Revalidate data every 60 seconds
    })

    if (!response.ok) {
      throw new Error("Failed to fetch artists")
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching artists:", error)
    return []
  }
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const artists = await fetchArtists()
  const artist = artists.find((a) => a.id === params.id)

  if (!artist) {
    notFound()
  }

  return <ArtistView artist={artist} />
}

