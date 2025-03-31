"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Disc3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import ArtistCard from "@/components/artist-card";
import PlaylistSection from "@/components/playlist-section";
import { artists } from "@/lib/data";
import axios from "axios";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function DashboardView() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [userName, setUserName] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState("");

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
    try {//fetch songs 
      const response = await axios.get(`http://localhost:5000/api/songs/search?query=${searchQuery}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error searching for songs:", error);
    }
  };

  const openDialog = async (song: any) => {
    setSelectedSong(song);
    try {
      const response = await axios.get("http://localhost:5000/api/user/playlists", { withCredentials: true });
      setPlaylists(response.data);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };

  const addToPlaylist = async () => {
    if (!selectedSong || !selectedPlaylist) return;
    try {
      await axios.post(
        "http://localhost:5000/api/playlist/add",
        { songId: selectedSong.id, playlistId: selectedPlaylist },
        { withCredentials: true }
      );
      alert("Song added to playlist!");
    } catch (error) {
      console.error("Error adding song to playlist:", error);
    }
  };

  return (
    <div className="min-h-screen music-pattern">
      <Navbar userName={userName} />

      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-black to-indigo-900">
        <div className="container mx-auto px-4 py-16 relative z-10">
          <h1 className="text-5xl font-bold mb-4 text-white">Welcome, {userName}</h1>
          <form onSubmit={handleSearch} className="flex gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-zinc-400" />
              <Input
                type="search"
                placeholder="Search for songs..."
                className="pl-10 py-6 bg-zinc-800/70 border-zinc-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 px-6">
              Search
            </Button>
          </form>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-white mb-4">Search Results</h2>
        <ul>
          {searchResults.map((song: any) => (
            <li key={song.id} className="flex justify-between p-2 border-b border-gray-700">
              <span className="text-white">{song.name}</span>
              <Dialog>
                <DialogTrigger asChild>
                  <Button onClick={() => openDialog(song)}>Add to Playlist</Button>
                </DialogTrigger>
                <DialogContent>
                  <h3 className="text-xl font-bold">Select a Playlist</h3>
                  <select
                    className="w-full p-2 border rounded"
                    value={selectedPlaylist}
                    onChange={(e) => setSelectedPlaylist(e.target.value)}
                  >
                    <option value="">Choose...</option>
                    {playlists.map((playlist: any) => (
                      <option key={playlist.id} value={playlist.id}>{playlist.name}</option>
                    ))}
                  </select>
                  <Button className="mt-4" onClick={addToPlaylist}>
                    Confirm
                  </Button>
                </DialogContent>
              </Dialog>
            </li>
          ))}
        </ul>

        <PlaylistSection />
      </main>
    </div>
  );
}
