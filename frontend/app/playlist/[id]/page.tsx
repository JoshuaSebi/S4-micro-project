"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Music, PlusCircle, Trash2, ArrowLeft, Search, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PlaylistPageProps {
  params: {
    id: string
  }
}

interface Song {
  song: {
    id: string
    name: string
    artist?: string
    duration?: number
    coverUrl?: string
  }
}

interface PlaylistDetails {
  id: string
  name: string
  songCount: number
  createdAt?: string
}

const PlaylistPage = ({ params }: PlaylistPageProps) => {
  const { id } = params
  const [songs, setSongs] = useState<Song[]>([])
  const [newSongId, setNewSongId] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [playlist, setPlaylist] = useState<PlaylistDetails | null>(null)

  useEffect(() => {
    fetchPlaylistDetails()
    fetchSongs()
  }, [id])

  const fetchPlaylistDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/playlist/${id}`, { withCredentials: true })
      setPlaylist(response.data.playlist)
    } catch (error) {
      console.error("Error fetching playlist details:", error)
      setError("Failed to load playlist details")
    }
  }

  const fetchSongs = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`http://localhost:5000/api/playlist/playlist-songs/${id}`, {
        withCredentials: true,
      })
      setSongs(response.data)
      setError("")
    } catch (error) {
      console.error("Error fetching songs:", error)
      setError("Failed to load songs")
    } finally {
      setIsLoading(false)
    }
  }

  const addSongToPlaylist = async () => {
    if (!newSongId) return
    try {
      await axios.post(
        "http://localhost:5000/api/song/add",
        { songId: newSongId, playlistId: id },
        { withCredentials: true },
      )
      setNewSongId("")
      fetchSongs()
    } catch (error) {
      console.error("Error adding song to playlist:", error)
      setError("Failed to add song to playlist")
    }
  }

  const removeSongFromPlaylist = async (songId: string) => {
    try {
      await axios.post("http://localhost:5000/api/song/remove", { songId, playlistId: id }, { withCredentials: true })
      fetchSongs()
    } catch (error) {
      console.error("Error removing song from playlist:", error)
      setError("Failed to remove song from playlist")
    }
  }

  // Format duration from seconds to mm:ss
  const formatDuration = (seconds?: number) => {
    if (!seconds) return "--:--"
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="w-full h-screen mx-auto px-4 py-8 bg-[#09090b]/85">
      <Button
        variant="ghost"
        className="mb-6 text-muted-foreground hover:text-foreground"
        onClick={() => window.history.back()}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to playlists
      </Button>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl md:text-3xl font-bold text-primary">
                {playlist?.name || "Loading playlist..."}
              </CardTitle>
              <CardDescription className="mt-2">
                {playlist?.songCount || 0} {playlist?.songCount === 1 ? "song" : "songs"} in this playlist
              </CardDescription>
            </div>
            <div className="h-16 w-16 rounded-md bg-primary/10 flex items-center justify-center text-primary">
              <Music className="h-8 w-8" />
            </div>
          </div>
        </CardHeader>
      </Card>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-3/4">
          <Card className="bg-gray-600">
            <CardHeader>
              <CardTitle className="text-xl">Songs</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-8 text-center text-muted-foreground">Loading songs...</div>
              ) : songs.length > 0 ? (
                <div className="divide-y divide-border">
                  {songs.map((song: Song, index) => (
                    <div
                      key={song.song.id}
                      className="py-4 flex items-center bg-gray-700 justify-between hover:bg-muted/50 px-2 rounded-md transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center text-secondary-foreground">
                          <span className="font-medium">{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-medium">{song.song.name}</h4>
                          {song.song.artist && <p className="text-sm text-muted-foreground">{song.song.artist}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {song.song.duration && (
                          <span className="text-sm text-muted-foreground">{formatDuration(song.song.duration)}</span>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => removeSongFromPlaylist(song.song.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No songs in this playlist</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Add your first song to start building your playlist.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-1/4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Add Song</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="songId" className="text-sm font-medium">
                    Song ID
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="songId"
                      type="text"
                      value={newSongId}
                      onChange={(e) => setNewSongId(e.target.value)}
                      placeholder="Enter Song ID"
                      className="flex-1"
                    />
                    <Button
                      onClick={addSongToPlaylist}
                      disabled={!newSongId}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-2">Quick Tips</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <Search className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Find song IDs in your music library</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <PlusCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Add multiple songs by adding them one by one</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default PlaylistPage

