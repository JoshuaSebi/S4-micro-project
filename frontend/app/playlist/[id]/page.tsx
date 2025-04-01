"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Music, PlusCircle, Trash2, ArrowLeft, Search, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useParams } from "next/navigation"

interface PlaylistPageProps {
  params: {
    id: string
  }
}

interface Artist {
  id: string
  name: string
}

interface Song {
  id: string
  name: string
  artist?: Artist
  duration?: number
}

interface PlaylistDetails {
  id: string
  name: string
  songCount: number
  createdAt?: string
  userId: string
}

const PlaylistPage = () => {
  const { id } = useParams<{ id: string }>() // Use useParams correctly
  const [songs, setSongs] = useState<Song[]>([])
  const [newSongName, setNewSongName] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [playlist, setPlaylist] = useState<PlaylistDetails | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [searchResults, setSearchResults] = useState<Song[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const API_BASE = "http://localhost:5000/api"

  const fetchPlaylist = async () => {
    try {
      setIsLoading(true)
      const playListRes = await axios.get(`${API_BASE}/playlist/get-a-playlist/${id}`, {
        withCredentials: true,
      })

      setPlaylist(playListRes.data.playlist)
      console.log("playlist", playListRes.data.playlist)
      console.log("playlist-var", playlist)
      setError("")
    } catch (error: any) {
      console.error("Error fetching data:", error)
      setError(error.response?.data?.message || "Failed to load data")
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    fetchPlaylist()
  }, [id])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const playListRes = await axios.get(`${API_BASE}/playlist/playlist-songs/${id}`, {
        withCredentials: true,
      })
      //setPlaylist(playListRes.data)

      const formattedSongs =
        playListRes &&
        playListRes.data.songs.map((item: any) => ({
          id: item.song?.id || item.id,
          name: item.song?.name || item.name,
          artist: item.song?.artist
            ? {
                id: item.song.artist.id,
                name: item.song.artist.name,
              }
            : item.artist
              ? {
                  id: item.artist.id,
                  name: item.artist.name,
                }
              : undefined,
          duration: item.song?.duration || item.duration,
        }))

      setSongs(formattedSongs)
      setError("")
    } catch (error: any) {
      console.error("Error fetching data:", error)
      setError(error.response?.data?.message || "Failed to load data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [id])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        searchSongs(searchQuery)
      } else {
        setSearchResults([])
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const searchSongs = async (query: string) => {
    try {
      const response = await axios.get(`${API_BASE}/songs/search?query=${encodeURIComponent(query)}`, {
        withCredentials: true,
      })
      setSearchResults(response.data.results || [])
    } catch (error) {
      console.error("Error searching songs:", error)
      setError("Failed to search songs")
      setSearchResults([])
    }
  }

  const addSongToPlaylist = async () => {
    if (!newSongName) return
    setIsUpdating(true)
    setError("")

    try {
      const response = await axios.post(
        `${API_BASE}/songs/add-to-playlist`,
        {
          songName: newSongName,
          playlistId: id,
        },
        { withCredentials: true },
      )

      if (response.data.message === "Song added to playlist successfully") {
        const addedSong = {
          id: response.data.addedSong.id,
          name: response.data.addedSong.name,
          artist: response.data.addedSong.artist
            ? {
                id: response.data.addedSong.artist.id,
                name: response.data.addedSong.artist.name,
              }
            : undefined,
          duration: response.data.addedSong.duration,
        }

        setSongs((prev) => [...prev, addedSong])
        setPlaylist((prev) =>
          prev
            ? {
                ...prev,
                songCount: prev.songCount + 1,
              }
            : null,
        )

        setNewSongName("")
        setSearchQuery("")
        setSearchResults([])
      }
    } catch (error: any) {
      console.error("Error adding song to playlist:", error)
      const errorMsg = error.response?.data?.message || "Failed to add song to playlist"
      setError(errorMsg)

      if (errorMsg.includes("already exists")) {
        await fetchData()
      }
    } finally {
      setIsUpdating(false)
    }
  }

  const removeSongFromPlaylist = async (songId: string) => {
    setIsUpdating(true)
    try {
      await axios.post(`${API_BASE}/songs/remove-from-playlist`, { songId, playlistId: id }, { withCredentials: true })

      setSongs((prev) => prev.filter((song) => song.id !== songId))
      setPlaylist((prev) =>
        prev
          ? {
              ...prev,
              songCount: Math.max(0, prev.songCount - 1),
            }
          : null,
      )
    } catch (error: any) {
      console.error("Error removing song from playlist:", error)
      setError(error.response?.data?.message || "Failed to remove song from playlist")
      await fetchData()
    } finally {
      setIsUpdating(false)
    }
  }

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

      <Card className="mb-8 bg-[#1e1e1e]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl md:text-3xl font-bold text-white">{playlist?.name}</CardTitle>
              <CardDescription className="mt-2 text-gray-400">
                {playlist?.songCount} {playlist?.songCount === 1 ? "song" : "songs"} in this playlist
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
          <Card className="bg-[#1e1e1e]">
            <CardHeader>
              <CardTitle className="text-xl text-white">Songs</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-8 text-center text-gray-400">Loading songs...</div>
              ) : songs.length > 0 ? (
                <div className="divide-y divide-gray-700">
                  {songs.map((song, index) => (
                    <div
                      key={song.id}
                      className="py-4 flex items-center bg-[#252525] justify-between hover:bg-[#2e2e2e] px-2 rounded-md transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded bg-[#3a3a3a] flex items-center justify-center text-gray-300">
                          <span className="font-medium">{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{song.name}</h4>
                          {song.artist?.name && (
                            <a
                              href={`/artist/${song.artist.id}`}
                              className="text-sm text-gray-400 hover:text-primary hover:underline"
                            >
                              {song.artist.name}
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {song.duration && <span className="text-sm text-gray-400">{song.duration}</span>}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => removeSongFromPlaylist(song.id)}
                          disabled={isUpdating}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Music className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium mb-2 text-white">No songs in this playlist</h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">
                    Add your first song to start building your playlist.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-1/4">
          <Card className="bg-[#1e1e1e]">
            <CardHeader>
              <CardTitle className="text-xl text-white">Add Song</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="songName" className="text-sm font-medium text-gray-300">
                    Song Name
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="songName"
                      type="text"
                      value={newSongName}
                      onChange={(e) => {
                        setNewSongName(e.target.value)
                        setSearchQuery(e.target.value)
                      }}
                      placeholder="Search for a song"
                      className="flex-1 bg-[#252525] border-gray-700 text-white"
                    />
                    <Button
                      onClick={addSongToPlaylist}
                      disabled={!newSongName || isUpdating}
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      {isUpdating ? (
                        <span className="flex items-center">
                          <PlusCircle className="h-4 w-4 mr-2 animate-pulse" />
                          Adding...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add
                        </span>
                      )}
                    </Button>
                  </div>

                  {searchResults.length > 0 && (
                    <div className="mt-2 border-t border-gray-700 pt-2">
                      <p className="text-sm text-gray-400 mb-2">Search results:</p>
                      <ul className="space-y-1 max-h-60 overflow-y-auto">
                        {searchResults.map((song) => (
                          <li
                            key={song.id}
                            className="flex justify-between items-center p-2 hover:bg-gray-800 rounded cursor-pointer"
                            onClick={() => {
                              setNewSongName(song.name)
                              setSearchResults([])
                            }}
                          >
                            <span className="text-white text-sm">{song.name}</span>
                            {song.artist?.name && <span className="text-gray-400 text-xs">{song.artist.name}</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <Separator className="bg-gray-700" />

                <div>
                  <h4 className="text-sm font-medium mb-2 text-gray-300">Quick Tips</h4>
                  <ul className="text-sm text-gray-400 space-y-2">
                    <li className="flex items-start gap-2">
                      <Search className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Search for songs by name or artist</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <PlusCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Add songs from search results</span>
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

