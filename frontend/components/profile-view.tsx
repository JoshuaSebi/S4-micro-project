"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Calendar, Shield, Settings, Trash2 } from "lucide-react"
import Navbar from "@/components/navbar"

export default function ProfileView() {
  const router = useRouter()
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    age: "",
  })

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
      setUserData({
        name: userInfo.name || "",
        email: userInfo.email || "",
        age: userInfo.age || "",
      })
    } catch (error) {
      console.error("Error parsing user info:", error)
      router.push("/")
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = () => {
    // Save updated user info to localStorage
    localStorage.setItem("userInfo", JSON.stringify(userData))
    // Show success message or redirect
    alert("Profile updated successfully!")
  }

  return (
    <div className="min-h-screen music-pattern">
      <Navbar userName={userData.name} />

      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
          Your Profile
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-purple-500 rounded-full blur-md opacity-50"></div>
              <Avatar className="h-32 w-32 relative">
                <AvatarImage src="/placeholder.svg?height=128&width=128" alt={userData.name} />
                <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white text-4xl">
                  {userData.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            <Button
              variant="outline"
              className="w-full mb-6 border-zinc-700 text-gray-700 hover:text-white hover:border-purple-500 hover:bg-zinc-800/50"
            >
              Change Avatar
            </Button>
            <Card className="w-full glass-effect border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Account</CardTitle>
                <CardDescription className="text-zinc-400">Manage your account settings</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="flex flex-col">
                  <Button
                    variant="ghost"
                    className="justify-start rounded-none h-12 text-zinc-300 hover:text-white hover:bg-purple-500/10"
                  >
                    <User className="h-4 w-4 mr-3 text-purple-400" />
                    Profile Information
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start rounded-none h-12 text-zinc-300 hover:text-white hover:bg-purple-500/10"
                  >
                    <Shield className="h-4 w-4 mr-3 text-purple-400" />
                    Password & Security
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start rounded-none h-12 text-zinc-300 hover:text-white hover:bg-purple-500/10"
                  >
                    <Settings className="h-4 w-4 mr-3 text-purple-400" />
                    Preferences
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start rounded-none h-12 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4 mr-3" />
                    Delete Account
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="glass-effect border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Profile Information</CardTitle>
                <CardDescription className="text-zinc-400">Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-zinc-300">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                    <Input
                      id="name"
                      name="name"
                      value={userData.name}
                      onChange={handleChange}
                      className="pl-10 bg-zinc-800/50 text-zinc-50 border-zinc-700 focus:border-purple-500"
                    />
                  </div>
                </div>
                <div className="space-y-2 text-zinc-50">
                  <Label htmlFor="email" className="text-zinc-300">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={userData.email}
                      onChange={handleChange}
                      className="pl-10 bg-zinc-800/50 border-zinc-700 focus:border-purple-500"
                    />
                  </div>
                </div>
                <div className="space-y-2 text-zinc-50">
                  <Label htmlFor="age" className="text-zinc-300">
                    Age
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      value={userData.age}
                      onChange={handleChange}
                      className="pl-10 bg-zinc-800/50 border-zinc-700 focus:border-purple-500"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

