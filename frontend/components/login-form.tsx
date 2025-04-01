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
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [registerData, setRegisterData] = useState({ name: "", email: "", password: "", age: "" })

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setLoginData((prev) => ({ ...prev, [id]: value }))
  }

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setRegisterData((prev) => ({ ...prev, [id.replace("register-", "")]: value }))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
        credentials: "include", // Important for cookies
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
  
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({"name": registerData.name, "email" : registerData.email, "password": registerData.password, "age": Number(registerData.age)})
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Registration failed")

      localStorage.setItem("userInfo", JSON.stringify(data.user))
      router.push("/dashboard")
    } catch (error ) {
      console.error("Register error:", error)
      alert(error.message)
    }
    setIsLoading(false)
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
            <TabsTrigger value="login" className="data-[state=active]:bg-purple-600">Login</TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-purple-600">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="text-white">
            <form onSubmit={handleLogin} className="space-y-4 mt-4">
              <Label>Email</Label>
              <Input id="email" type="email" placeholder="Email" className="text-black" required value={loginData.email} onChange={handleLoginChange} />
              <Label>Password</Label>
              <Input id="password" placeholder="Password" type="password" className="text-black" required value={loginData.password} onChange={handleLoginChange} />
              <Button type="submit" disabled={isLoading}>{isLoading ? "Logging in..." : "Login"}</Button>
            </form>
          </TabsContent>
          <TabsContent value="register" className="text-white">
            <form onSubmit={handleRegister} className="space-y-4 mt-4">
              <Label>Full Name</Label>
              <Input id="register-name" className="text-black" placeholder="Fullname" required value={registerData.name} onChange={handleRegisterChange} />
              <Label>Age</Label>
              <Input id="register-age" className="text-black" placeholder="Age" type="number" required value={registerData.age} onChange={handleRegisterChange} />
              <Label>Email</Label>
              <Input id="register-email" className="text-black" placeholder="Email" type="email" required value={registerData.email} onChange={handleRegisterChange} />
              <Label>Password</Label>
              <Input id="register-password" className="text-black" placeholder="Password" type="password" required value={registerData.password} onChange={handleRegisterChange} />
              <Button type="submit" disabled={isLoading}>{isLoading ? "Creating account..." : "Create account"}</Button>
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
