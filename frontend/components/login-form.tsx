"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Headphones, Mail, Lock, User, Calendar } from "lucide-react"

export default function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })
  const [registerData, setRegisterData] = useState({
    name: "",
    age: "",
    email: "",
    password: "",
  })

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setLoginData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setRegisterData((prev) => ({
      ...prev,
      [id.replace("register-", "")]: value,
    }))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // In a real app, you would validate credentials against your backend
    // For demo purposes, we'll just simulate a successful login
    setTimeout(() => {
      // Store user info in localStorage
      const userInfo = {
        name: "Demo User", // In a real app, you'd get this from your backend
        email: loginData.email,
        age: "25", // Placeholder
      }
      localStorage.setItem("userInfo", JSON.stringify(userInfo))

      setIsLoading(false)
      router.push("/dashboard")
    }, 1000)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // In a real app, you would send registration data to your backend
    // For demo purposes, we'll just simulate a successful registration
    setTimeout(() => {
      // Store user info in localStorage
      const userInfo = {
        name: registerData.name,
        email: registerData.email,
        age: registerData.age,
      }
      localStorage.setItem("userInfo", JSON.stringify(userInfo))

      setIsLoading(false)
      router.push("/dashboard")
    }, 1000)
  }

  return (
    <Card className="w-full glass-effect border-purple-500/20 shadow-xl hover-glow">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500 rounded-full blur-md opacity-50"></div>
            <div className="relative bg-gradient-to-br from-indigo-600 to-purple-700 p-3 rounded-full">
              <Headphones className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>
        <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-600">
          BeatSync
        </CardTitle>
        <CardDescription className="text-zinc-400">Your personal music companion</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login" className="data-[state=active]:bg-purple-600">
              Login
            </TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-purple-600">
              Register
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-300">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    value={loginData.email}
                    onChange={handleLoginChange}
                    className="pl-10 bg-zinc-800/50 border-zinc-700 focus:border-purple-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-300">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <Input
                    id="password"
                    type="password"
                    required
                    value={loginData.password}
                    onChange={handleLoginChange}
                    className="pl-10 bg-zinc-800/50 border-zinc-700 focus:border-purple-500"
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="audio-wave mr-2">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <span>Logging in...</span>
                  </div>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="register-name" className="text-zinc-300">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <Input
                    id="register-name"
                    placeholder="John Doe"
                    required
                    value={registerData.name}
                    onChange={handleRegisterChange}
                    className="pl-10 bg-zinc-800/50 border-zinc-700 focus:border-purple-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-age" className="text-zinc-300">
                  Age
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <Input
                    id="register-age"
                    type="number"
                    placeholder="25"
                    required
                    value={registerData.age}
                    onChange={handleRegisterChange}
                    className="pl-10 bg-zinc-800/50 border-zinc-700 focus:border-purple-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email" className="text-zinc-300">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    className="pl-10 bg-zinc-800/50 border-zinc-700 focus:border-purple-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password" className="text-zinc-300">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <Input
                    id="register-password"
                    type="password"
                    required
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    className="pl-10 bg-zinc-800/50 border-zinc-700 focus:border-purple-500"
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="audio-wave mr-2">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <span>Creating account...</span>
                  </div>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-zinc-500">By continuing, you agree to our Terms of Service and Privacy Policy.</p>
      </CardFooter>
    </Card>
  )
}

