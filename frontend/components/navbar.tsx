"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Headphones, LogOut, User, Home, Music, Library } from "lucide-react"

interface NavbarProps {
  userName: string
}

export default function Navbar({ userName }: NavbarProps) {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState("")
  const [scrolled, setScrolled] = useState(false)

  // Get user email from localStorage
  useEffect(() => {
    const userInfoString = localStorage.getItem("userInfo")
    if (userInfoString) {
      try {
        const userInfo = JSON.parse(userInfoString)
        setUserEmail(userInfo.email || "user@example.com")
      } catch (error) {
        console.error("Error parsing user info:", error)
      }
    }

    // Add scroll listener
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    // Clear user info from localStorage
    localStorage.removeItem("userInfo")
    // Redirect to login page
    router.push("/")
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "glass-effect border-b border-purple-500/20" : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div
              className={`absolute inset-0 bg-purple-500 rounded-full blur-sm opacity-50 ${scrolled ? "block" : "hidden"}`}
            ></div>
            <div
              className={`relative p-1.5 rounded-full ${scrolled ? "bg-gradient-to-br from-indigo-600 to-purple-700" : ""}`}
            >
              <Headphones className={`h-6 w-6 ${scrolled ? "text-white" : "text-purple-500"}`} />
            </div>
          </div>
          <Link
            href="/dashboard"
            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400"
          >
            BeatSync
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-1">
          <Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-zinc-800/50" asChild>
            <Link href="/dashboard">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Link>
          </Button>
          <Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-zinc-800/50" asChild>
            <Link href="/explore">
              <Music className="h-4 w-4 mr-2" />
              Explore
            </Link>
          </Button>
          <Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-zinc-800/50" asChild>
            <Link href="/library">
              <Library className="h-4 w-4 mr-2" />
              Library
            </Link>
          </Button>
        </div>

        <nav className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8 ring-2 ring-purple-500/50">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt={userName} />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
                    {userName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 glass-effect border-purple-500/20" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-white">{userName}</p>
                  <p className="text-xs leading-none text-zinc-400">{userEmail}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-700" />
              <DropdownMenuItem asChild>
                <Link
                  href="/profile"
                  className="cursor-pointer flex w-full items-center text-zinc-300 hover:text-white focus:text-white"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-700" />
              <DropdownMenuItem
                className="cursor-pointer text-red-400 hover:text-red-300 focus:text-red-300"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  )
}

