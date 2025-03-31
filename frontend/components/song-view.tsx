"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Heart, Share2, Play, Plus, Music, Calendar, Clock, Disc3 } from "lucide-react"
import Navbar from "@/components/navbar"
import type { Song } from "@/lib/types"
import { getArtistById } from "@/lib/data"

interface SongViewProps {
  song: Song
}

export default function SongView({ song }: SongViewProps) {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [isLiked, setIsLiked] = useState(false)
  const artist = getArtistById(song.artistId)

  useEffect(() => {
    // Get user info from localStorage
    const userInfoString = localStorage.getItem("userInfo")
    if (!userInfoString) {
      // If no user info is found, redirect to login
      router.push("/")
      return
    }

    try {
      const userInfo = JSON.parse(userInfoString)
      setUserName(userInfo.name || "User")
    } catch (error) {
      console.error("Error parsing user info:", error)
      router.push("/")
    }
  }, [router])

  return (
    <div className="min-h-screen music-pattern">
      <Navbar userName={userName} />

      <div className="relative">
        {/* Song header with gradient overlay */}
        <div className="relative h-80 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-90 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 via-black/50 to-indigo-900/50 z-10"></div>
          <Image
            src={song.cover || "/placeholder.svg?height=800&width=1600"}
            alt={song.title}
            fill
            className="object-cover blur-sm"
          />
        </div>

        <main className="container mx-auto px-4 py-8 relative z-10 -mt-40">
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="w-full md:w-64 flex-shrink-0">
              <div className="relative aspect-square rounded-lg overflow-hidden shadow-2xl glow">
                <Image
                  src={song.cover || "/placeholder.svg?height=300&width=300"}
                  alt={song.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/50">
                  <Button
                    className="rounded-full w-16 h-16 bg-purple-600 hover:bg-purple-700"
                    onClick={() => console.log(`Play song: ${song.title}`)}
                  >
                    <Play className="h-8 w-8" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex-1 glass-effect p-6 rounded-lg">
              <h1 className="text-4xl font-bold mb-2 text-white">{song.title}</h1>
              <Link
                href={`/artist/${song.artistId}`}
                className="text-xl text-purple-400 hover:text-purple-300 hover:underline mb-4 inline-block"
              >
                {song.artist}
              </Link>

              <div className="flex flex-wrap gap-4 my-6">
                <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 gap-2">
                  <Play className="h-4 w-4" />
                  Play
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className={`border-zinc-700 ${isLiked ? "bg-purple-500/20 text-purple-400 border-purple-500/50" : "text-zinc-300"}`}
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} />
                </Button>
                <Button variant="outline" size="icon" className="border-zinc-700 text-zinc-300">
                  <Plus className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="border-zinc-700 text-zinc-300">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold mb-2 text-white">Song Info</h2>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-zinc-300">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <Music className="h-4 w-4 text-purple-400" />
                        </div>
                        <span>Genre: {song.genre}</span>
                      </li>
                      <li className="flex items-center gap-3 text-zinc-300">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <Calendar className="h-4 w-4 text-purple-400" />
                        </div>
                        <span>Released: {song.releaseDate}</span>
                      </li>
                      <li className="flex items-center gap-3 text-zinc-300">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <Clock className="h-4 w-4 text-purple-400" />
                        </div>
                        <span>Duration: {song.duration}</span>
                      </li>
                      <li className="flex items-center gap-3 text-zinc-300">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <Disc3 className="h-4 w-4 text-purple-400" />
                        </div>
                        <span>Album: {song.album}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {song.lyrics && (
                  <div>
                    <h2 className="text-lg font-semibold mb-2 text-white">Lyrics Preview</h2>
                    <div className="bg-zinc-800/50 p-4 rounded-md border border-zinc-700/50 max-h-[200px] overflow-y-auto">
                      <p className="whitespace-pre-line text-zinc-300 text-sm leading-relaxed">{song.lyrics}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

