import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import type { Artist } from "@/lib/types"

interface ArtistCardProps {
  artist: Artist
}

export default function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <Link href={`/artist/${artist.id}`}>
      <Card className="overflow-hidden bg-zinc-800/30 hover:bg-zinc-800/50 transition-all duration-300 border-zinc-700/50 hover:border-purple-500/50 hover-glow group">
        <div className="aspect-square relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
          <Image
            src={artist.image || "/placeholder.svg?height=300&width=300"}
            alt={artist.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <CardContent className="p-4 relative">
          <h3 className="font-semibold text-lg group-hover:text-purple-400 transition-colors duration-300">
            {artist.name}
          </h3>
          <p className="text-sm text-zinc-400">{artist.genre}</p>
          <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-purple-600 to-transparent opacity-20 rounded-tl-full"></div>
        </CardContent>
      </Card>
    </Link>
  )
}

