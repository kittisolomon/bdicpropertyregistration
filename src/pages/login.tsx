"use client"

import type React from "react"

import { useState } from "react"
import { Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export default function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Basic validation
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password")
      setIsLoading(false)
      return
    }
    let role="portaladmin"

    try {
      const response = await axios.post("https://bdicisp.vercel.app/api/v1/auth/adminlogin", {
        email:username,
        password,
        role
      })

      if (response.data.token) {
        // Store the token in localStorage
        localStorage.setItem("authToken", response.data.token)

        // Store user data if needed
        localStorage.setItem("userData", JSON.stringify(response.data.data))
        // Navigate to dashboard
        navigate("/dashboard")
      } else {
        setError("Invalid response from server")
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        // Handle specific error cases
        if (err.response?.status === 401) {
          setError("Invalid username or password")
        } else if (err.response?.status === 404) {
          setError("User not found")
        } else if (err.response?.status === 500) {
          setError("Server error. Please try again later")
        } else {
          setError(err.response?.data?.message || "An error occurred during login")
        }
      } else {
        setError("An unexpected error occurred")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* Government Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-white rounded-full shadow-sm mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Benue Property Management Portal</h1>
          <p className="text-sm text-gray-500 mt-1">Federal Republic of Nigeria</p>
        </div>

        <Card className="border-primary/20">
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Sign In</CardTitle>
              <CardDescription className="text-center">Enter your credentials to access the portal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md">{error}</div>
              )}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  disabled={isLoading}
                />
                <Label htmlFor="remember" className="text-sm font-normal">
                  Remember me for 30 days
                </Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-4 mb-4">
            <img
              src="/placeholder.svg?height=40&width=40"
              width={40}
              height={40}
              alt="Coat of Arms"
              className="opacity-70"
            />
          </div>
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Benue Property Management Authority. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 mt-1">Secure Government Portal v1.0</p>
        </div>
      </div>

      {/* Security Notice */}
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:bottom-4 md:w-72">
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-xs text-gray-600">
          <p className="font-medium text-gray-800 mb-1">Security Notice</p>
          <p>
            This is a State Government system restricted to authorized users for official purposes. Unauthorized
            access is prohibited and subject to prosecution.
          </p>
        </div>
      </div>
    </div>
  )
}

