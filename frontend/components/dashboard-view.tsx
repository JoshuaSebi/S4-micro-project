"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import PlaylistSection from "@/components/playlist-section";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";

interface Song {
  id: string;
  name: string;
  artist?: {
    name: string;
  };
}

interface Playlist {
  id: string;
  name: string;
  songCount: number;
  createdAt: string;
}

export default function DashboardView() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [userName, setUserName] = useState("");
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const userInfoString = localStorage.getItem("userInfo");
    if (!userInfoString) {
      router.push("/");
      return;
    }
    try {
      const userInfo = JSON.parse(userInfoString);
      setUserName(userInfo.name || "User");
    } catch (error) {
      console.error("Error parsing user info:", error);
      router.push("/");
    }
  }, [router]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setError("Please enter a search term");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `http://localhost:5000/api/songs/search?query=${encodeURIComponent(
          searchQuery
        )}`,
        { withCredentials: true }
      );

      setSearchResults(response.data.results);
    } catch (error) {
      console.error("Error searching for songs:", error);
      setError("Failed to search for songs");
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const openDialog = async (song: Song) => {
    setSelectedSong(song);
    setSelectedPlaylist();
    try {
      const response = await axios.get(
        "http://localhost:5000/api/playlist/user-playlists",
        { withCredentials: true }
      );
      setPlaylists(response.data.formattedPlaylists);
    } catch (error) {
      console.error("Error fetching playlists:", error);
      setError("Failed to load playlists");
    }
  };

  const addToPlaylist = async () => {
    if (!selectedSong || !selectedPlaylist) return;
    console.log(selectedSong.name, selectedPlaylist.id);

    try {
      await axios.post(
        "http://localhost:5000/api/songs/add-to-playlist",
        {
          songName: selectedSong.name,
          playlistId: selectedPlaylist,
        },
        { withCredentials: true }
      );
      alert("Song added to playlist successfully!");
      // setSelectedPlaylist({});
      setSelectedSong(null);
    } catch (error) {
      console.error("Error adding song to playlist:", error);
      setError("Failed to add song to playlist");
    }
  };

  return (
    <div className="min-h-screen music-pattern">
      <Navbar userName={userName} />

      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-black to-indigo-900">
        <div className="container mx-auto px-4 py-16 relative z-10">
          <h1 className="text-5xl font-bold mb-4 text-white">
            Welcome, {userName}
          </h1>
          <form onSubmit={handleSearch} className="flex gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-white" />
              <Input
                type="search"
                placeholder="Search for songs..."
                className="pl-10 py-4 bg-zinc-800/70 border-zinc-700 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 px-6"
              disabled={isLoading}
            >
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </form>
          {error && <p className="text-red-400 mt-2">{error}</p>}
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        {searchResults.length > 0 && (
          <>
            <h2 className="text-3xl font-bold text-white mb-4">
              Search Results
            </h2>
            <ul className="space-y-2">
              {searchResults.map((song) => (
                <li
                  key={song.id}
                  className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg"
                >
                  <div>
                    <p className="text-white font-medium">{song.name}</p>
                    {song.artist && (
                      <p className="text-zinc-400 text-sm">
                        {song.artist.name}
                      </p>
                    )}
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="text-white border-zinc-600 hover:bg-zinc-700"
                        onClick={() => openDialog(song)}
                      >
                        Add to Playlist
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-900 border-zinc-700 text-white">
                      <DialogTitle>Select a Playlist</DialogTitle>
                      <select
                        className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded text-white"
                        value={selectedPlaylist}
                        onChange={(e) => {
                          setSelectedPlaylist(e.target.value);
                          console.log(e.target.value); // Logs the value correctly
                      }}
                      
                      >
                        {/* {e.target.value} */}
                        <option value="">Choose a playlist...</option>
                        {playlists &&
                          playlists.map((playlist) => (
                            <option key={playlist.id} value={playlist.id}>
                              {playlist.name} ({playlist.songCount} songs)
                            </option>
                          ))}
                      </select>
                      <Button
                        className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
                        onClick={addToPlaylist}
                        disabled={!selectedPlaylist}
                      >
                        Add to Playlist
                      </Button>
                    </DialogContent>
                  </Dialog>
                </li>
              ))}
            </ul>
          </>
        )}
        <PlaylistSection />
      </main>
    </div>
  );
}
