"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Disc3 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import ArtistCard from "@/components/artist-card"
import PlaylistSection from "@/components/playlist-section"
import { artists } from "@/lib/data"

export default function DashboardView() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [userName, setUserName] = useState("")

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would search for songs here
    console.log("Searching for:", searchQuery)
  }

  return (
    <div className="min-h-screen music-pattern">
      <Navbar userName={userName} />

      {/* Hero section with animated background */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-black to-indigo-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/placeholder.svg?height=800&width=1600')] bg-cover bg-center"></div>
        </div>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
              Welcome, {userName}
            </h1>
            <p className="text-xl text-zinc-300 mb-8">
              Discover your next favorite track and dive into a world of music.
            </p>
            <form onSubmit={handleSearch} className="flex gap-2 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-5 w-5 text-zinc-400" />
                <Input
                  type="search"
                  placeholder="Search for songs, artists, or albums..."
                  className="pl-10 py-6 bg-zinc-800/70 border-zinc-700 focus:border-purple-500 text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-6"
              >
                Search
              </Button>
            </form>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-10 right-10 opacity-40">
          <Disc3 className="h-40 w-40 text-purple-500 animate-spin" style={{ animationDuration: "10s" }} />
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
              Popular Artists
            </h2>
            <div className="h-1 flex-1 mx-4 bg-gradient-to-r from-purple-600/20 to-transparent rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </section>

        <PlaylistSection />
      </main>
    </div>
  )
}

