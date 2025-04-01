"use client"
import axios from "axios";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle, Trash2, Music, ListMusic } from "lucide-react";
import type { Playlist } from "@/lib/types";

export default function PlaylistSection() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch user playlists
  const fetchPlaylists = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/playlist/user-playlists", {
        withCredentials: true, // Ensure cookies are sent
      });
      setPlaylists(response.data.formattedPlaylists);
      console.log(playlists)
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);
  const handleCreatePlaylist = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/playlist/create",
        {
          name: newPlaylistName,
          songCount: 0,
        },
        {
          withCredentials: true,
        }
      );
      
      if (response.data?.playlist) {
        setPlaylists((prev) => [...(prev || []), response.data.playlist]);
      } else {
        console.error("Playlist data is missing from response:", response.data);
      }
  
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating playlist:", error);
    }
  };
  

  const handleDeletePlaylist = async (id: string | undefined) => {
    if (!id) return;
  
    try {
      await axios.delete(`http://localhost:5000/api/playlist/delete/${id}`, {
        withCredentials: true, // Ensures authentication token is sent
      });
  
      // Remove playlist from UI
      setPlaylists((prev) => prev.filter((playlist) => playlist.id !== id));
    } catch (error) {
      console.error("Error deleting playlist:", error);
    }
  };
  

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
        {playlists && playlists.map((playlist) => (
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
  );
}