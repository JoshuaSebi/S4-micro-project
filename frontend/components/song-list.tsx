"use client"

import { useState } from "react"
import Link from "next/link"
import { Play, MoreHorizontal, Clock, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Song } from "@/lib/types"

interface SongListProps {
  songs: Song[]
}

export default function SongList({ songs }: SongListProps) {
  return (
    <div className="bg-zinc-800/30 rounded-md border border-zinc-700/50 overflow-hidden">
      <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 p-3 text-xs text-zinc-400 border-b border-zinc-700/50 bg-zinc-800/50">
        <div className="w-8">#</div>
        <div>TITLE</div>
        <div className="hidden md:block">ALBUM</div>
        <div className="flex items-center">
          <Clock className="h-4 w-4" />
        </div>
      </div>

      <div className="divide-y divide-zinc-700/50">
        {songs.map((song, index) => (
          <SongRow key={song.id} song={song} index={index + 1} />
        ))}
      </div>
    </div>
  )
}

interface SongRowProps {
  song: Song
  index: number
}

function SongRow({ song, index }: SongRowProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  return (
    <div
      className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 p-3 hover:bg-zinc-800/50 transition-colors duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-8 text-center">
        {isHovered ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-white hover:text-purple-400 hover:bg-purple-500/10"
            onClick={() => console.log(`Play song: ${song.title}`)}
          >
            <Play className="h-4 w-4" />
          </Button>
        ) : (
          <span className="text-zinc-400">{index}</span>
        )}
      </div>

      <div>
        <Link href={`/song/${song.id}`} className="font-medium hover:text-purple-400 transition-colors duration-200">
          {song.title}
        </Link>
      </div>

      <div className="hidden md:block text-zinc-400 text-sm">{song.album}</div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className={`h-6 w-6 ${isLiked ? "text-purple-500" : "text-zinc-400 hover:text-purple-400"}`}
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} />
        </Button>
        <span className="text-zinc-400 text-sm">{song.duration}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass-effect border-purple-500/20">
            <DropdownMenuItem
              onClick={() => console.log(`Add to playlist: ${song.title}`)}
              className="text-zinc-300 hover:text-white focus:text-white"
            >
              Add to playlist
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log(`Add to queue: ${song.title}`)}
              className="text-zinc-300 hover:text-white focus:text-white"
            >
              Add to queue
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log(`Share song: ${song.title}`)}
              className="text-zinc-300 hover:text-white focus:text-white"
            >
              Share
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

