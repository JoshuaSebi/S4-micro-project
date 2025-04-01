"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import SongList from "@/components/song-list";
import { Heart, Share2, Play } from "lucide-react";
import type { Artist } from "@/lib/types";
import { getSongsByArtist } from "@/lib/data";

interface ArtistViewProps {
  artist: Artist;
}

export default function ArtistView({ artist }: ArtistViewProps) {
  const artistLocal = [
    {
      img_url:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/The_Weeknd_with_hand_in_the_air_performing_live_in_Hong_Kong_in_November_2018_%28cropped%29.jpg/800px-The_Weeknd_with_hand_in_the_air_performing_live_in_Hong_Kong_in_November_2018_%28cropped%29.jpg",
      artistId: "67e8f30397d1c0d1c7558251",
    },
    {
      img_url:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Red_Pill_Blues_Tour_%2843272841140%29.jpg/1024px-Red_Pill_Blues_Tour_%2843272841140%29.jpg",
      artistId: "67e8f30397d1c0d1c7558254",
    },
    {
      img_url:
      "https://upload.wikimedia.org/wikipedia/commons/5/5a/Ed_Sheeran_at_2012_Frequency_Festival_in_Austria_%287852625324%29.jpg",
      artistId: "67e8f30397d1c0d1c7558250",
    },
    {
      img_url:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Chester-Shinoda-montreal-2014.jpg/1280px-Chester-Shinoda-montreal-2014.jpg",
      artistId: "67e8f30397d1c0d1c7558252",
    },
    {
      img_url:
        "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcS-MHOI6C-qmmDZPkXAURGQL_D3r4aj4AC7EKKs0FQxAVROeJTsNK-Kjuekco-JW2pcETBkFDziSrUG4pFnI3XI6g",

      artistId: "67e8f30397d1c0d1c7558253",
    },
  ];
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const songs = getSongsByArtist(artist.id);

  useEffect(() => {
    // Get user info from localStorage
    const userInfoString = localStorage.getItem("userInfo");
    if (!userInfoString) {
      // If no user info is found, redirect to login
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
              <h1 className="text-5xl font-bold mb-2 text-white">
                {artist.name}
              </h1>
              <p className="text-xl text-zinc-300">{artist.genre}</p>
            </div>
          </div>
        </div>

        <main className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            <div className="w-full md:w-64 flex-shrink-0">
              <div className="relative aspect-square rounded-lg overflow-hidden shadow-2xl border-4 border-black">
                <Image
                  src={
                    artistLocal.find((a) => a.artistId === artist.id)
                      ?.img_url || ""
                  }
                  alt={artist.name}
                  fill
                  className="object-cover "
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
                  className={`gap-2 bg-transparent border-zinc-700 ${
                    isFollowing
                      ? "bg-purple-500/20 text-purple-400 border-purple-500/50"
                      : "text-zinc-300"
                  }`}
                  onClick={() => setIsFollowing(!isFollowing)}
                >
                  <Heart
                    className="h-4 w-4"
                    fill={isFollowing ? "currentColor" : "none"}
                  />
                  {isFollowing ? "Following" : "Follow"}
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 border-zinc-700 bg-transparent text-zinc-300"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>

              <div className="mb-1">
                <h2 className="text-xl font-semibold mb-2 text-white ">
                  About
                </h2>
                <p className="text-white leading-relaxed">{artist.info}</p>
                <div className="mt-4">
                  <h2 className="text-xl font-semibold mb-2 text-white">
                    More Info
                  </h2>
                  <a
                    href={artist.moreInfoLink}
                    className="text-white hover:underline"
                  >
                    {artist.moreInfoLink}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
