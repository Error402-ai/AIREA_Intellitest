"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GraduationCap, Users } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("student")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // For demonstration purposes, automatically set role based on selected tab
      const defaultEmail = activeTab === "teacher" ? "teacher@intellitest.com" : "student@intellitest.com"
      const defaultPassword = "password123"

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: email || defaultEmail, 
          password: password || defaultPassword 
        }),
      })

      if (response.ok) {
        const { user } = await response.json()
        // Redirect based on role
        if (user.role === "teacher") {
          router.push("/teacher/dashboard")
        } else {
          router.push("/student/dashboard")
        }
      } else {
        const { error } = await response.json()
        setError(error)
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const fillCredentials = () => {
    if (activeTab === "teacher") {
      setEmail("teacher@intellitest.com")
      setPassword("password123")
    } else {
      setEmail("student@intellitest.com")
      setPassword("password123")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to IntelliTest</CardTitle>
          <CardDescription>
            Sign in to access your personalized learning dashboard
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="student" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Student
              </TabsTrigger>
              <TabsTrigger value="teacher" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Teacher
              </TabsTrigger>
            </TabsList>

            <TabsContent value="student" className="space-y-2">
              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                <p className="font-medium">Student Access:</p>
                <p>Access your learning dashboard, take assessments, and track your progress.</p>
                <Button variant="outline" size="sm" onClick={fillCredentials} className="mt-2">
                  Quick Sign In
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="teacher" className="space-y-2">
              <div className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
                <p className="font-medium">Teacher Access:</p>
                <p>Upload materials, generate assessments, and review student progress.</p>
                <Button variant="outline" size="sm" onClick={fillCredentials} className="mt-2">
                  Quick Sign In
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : `Sign In as ${activeTab === "teacher" ? "Teacher" : "Student"}`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
