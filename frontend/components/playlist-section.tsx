"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlusCircle, Trash2, Music, ListMusic } from "lucide-react"
import type { Playlist } from "@/lib/types"

export default function PlaylistSection() {
  const [playlists, setPlaylists] = useState<Playlist[]>([
    { id: "1", name: "My Favorites", songCount: 12 },
    { id: "2", name: "Workout Mix", songCount: 8 },
  ])
  const [newPlaylistName, setNewPlaylistName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      const newPlaylist: Playlist = {
        id: Date.now().toString(),
        name: newPlaylistName,
        songCount: 0,
      }
      setPlaylists([...playlists, newPlaylist])
      setNewPlaylistName("")
      setIsDialogOpen(false)
    }
  }

  const handleDeletePlaylist = (id: string) => {
    setPlaylists(playlists.filter((playlist) => playlist.id !== id))
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
          Your Playlists
        </h2>
        <div className="h-1 flex-1 mx-4 bg-gradient-to-r from-purple-600/20 to-transparent rounded-full"></div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              New Playlist
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-effect border-purple-500/20">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Playlist</DialogTitle>
              <DialogDescription className="text-zinc-400">Give your playlist a name to get started.</DialogDescription>
            </DialogHeader>
            <Input
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="My Awesome Playlist"
              className="mt-4 bg-zinc-800/50 border-zinc-700 focus:border-purple-500"
            />
            <DialogFooter className="mt-4">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreatePlaylist}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className="bg-zinc-800/30 p-5 rounded-lg border border-zinc-700/50 hover:border-purple-500/50 flex flex-col hover-glow transition-all duration-300"
          >
            <div className="flex-1 flex items-start gap-3">
              <div className="w-12 h-12 rounded-md bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center">
                <ListMusic className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-lg text-white">{playlist.name}</h3>
                <p className="text-sm text-zinc-400">{playlist.songCount} songs</p>
              </div>
            </div>
            <div className="flex justify-between mt-6 pt-4 border-t border-zinc-700/50">
              <Button
                variant="outline"
                size="sm"
                className="border-zinc-700 text-zinc-300 hover:text-white hover:border-purple-500 hover:bg-zinc-800/50"
                asChild
              >
                <a href={`/playlist/${playlist.id}`}>
                  <Music className="h-4 w-4 mr-2" />
                  View
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                onClick={() => handleDeletePlaylist(playlist.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

