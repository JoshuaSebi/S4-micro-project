"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import SongList from "@/components/song-list"
import { Heart, Share2, Play } from "lucide-react"
import type { Artist } from "@/lib/types"
import { getSongsByArtist } from "@/lib/data"

interface ArtistViewProps {
  artist: Artist
}

export default function ArtistView({ artist }: ArtistViewProps) {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [isFollowing, setIsFollowing] = useState(false)
  const songs = getSongsByArtist(artist.id)

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
        {/* Artist header with gradient overlay */}
        <div className="relative h-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-90 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 via-black/50 to-indigo-900/50 z-10"></div>
         
          <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
            <div className="container mx-auto">
              <h1 className="text-5xl font-bold mb-2 text-white">{artist.name}</h1>
              <p className="text-xl text-zinc-300">{artist.genre}</p>
            </div>
          </div>
        </div>

        <main className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            <div className="w-full md:w-64 flex-shrink-0">
              <div className="relative aspect-square rounded-lg overflow-hidden shadow-2xl border-4 border-black">
                <Image
                  src={"https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Linkin_Park_-_From_Zero_Lead_Press_Photo_-_James_Minchin_III.jpg/800px-Linkin_Park_-_From_Zero_Lead_Press_Photo_-_James_Minchin_III.jpg"}
                  alt={artist.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="flex-1 glass-effect p-6 rounded-lg">
              <div className="flex flex-wrap gap-4 mb-6">
                <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 gap-2">
                  <Play className="h-4 w-4" />
                  Play All
                </Button>
                <Button
                  variant="outline"
                  className={`gap-2 border-zinc-700 ${isFollowing ? "bg-purple-500/20 text-purple-400 border-purple-500/50" : "text-zinc-300"}`}
                  onClick={() => setIsFollowing(!isFollowing)}
                >
                  <Heart className="h-4 w-4" fill={isFollowing ? "currentColor" : "none"} />
                  {isFollowing ? "Following" : "Follow"}
                </Button>
                <Button variant="outline" className="gap-2 border-zinc-700 text-zinc-300">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3 text-white">About</h2>
                <p className="text-zinc-300 leading-relaxed">{artist.bio}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

