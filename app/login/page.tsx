"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Brain, Mail, Lock, ArrowLeft } from "lucide-react"
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { auth } from "@/lib/supabase"
import { createUserProfile, getUserProfile } from "@/lib/firebase-service"
import { useAuth } from "@/hooks/useAuth"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { user, loading: authLoading, initialized } = useAuth()

  // Redirect if already logged in
  useEffect(() => {
    if (initialized && user) {
      console.log("User already logged in, redirecting to dashboard")
      router.push("/dashboard")
    }
  }, [user, initialized, router])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      console.log("Attempting email login...")
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log("Email login successful:", userCredential.user.email)

      // Wait a moment for auth state to update
      setTimeout(() => {
        router.push("/dashboard")
      }, 100)
    } catch (err: any) {
      console.error("Email login error:", err)
      setError(err.message || "An error occurred during login")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    setError("")

    try {
      console.log("Attempting Google login...")
      const provider = new GoogleAuthProvider()
      provider.addScope("email")
      provider.addScope("profile")

      const result = await signInWithPopup(auth, provider)
      const user = result.user
      console.log("Google login successful:", user.email)

      // Check if user profile exists, if not create one
      const profileResult = await getUserProfile(user.uid)

      if (!profileResult.success) {
        console.log("Creating new user profile...")
        await createUserProfile(user.uid, {
          email: user.email || "",
          full_name: user.displayName || "",
          company: "",
          role: "",
        })
      }

      // Wait a moment for auth state to update
      setTimeout(() => {
        router.push("/dashboard")
      }, 100)
    } catch (err: any) {
      console.error("Google login error:", err)
      if (err.code === "auth/popup-closed-by-user") {
        setError("Sign-in was cancelled")
      } else if (err.code === "auth/popup-blocked") {
        setError("Popup was blocked by browser. Please allow popups and try again.")
      } else {
        setError(err.message || "An error occurred during Google sign-in")
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  // Show loading while auth is initializing
  if (authLoading || !initialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render login form if user is already logged in
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">AI Compliance Academy</span>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to continue your AI training journey</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Google Sign-In Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full bg-transparent"
              onClick={handleGoogleLogin}
              disabled={googleLoading || loading}
            >
              {googleLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                  Signing in with Google...
                </div>
              ) : (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </div>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with email</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    disabled={loading || googleLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    disabled={loading || googleLoading}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading || googleLoading}>
                {loading ? "Signing In..." : "Sign In with Email"}
              </Button>
            </form>

            <div className="text-center space-y-4">
              <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                Forgot your password?
              </Link>

              <div className="text-sm text-gray-600">
                {"Don't have an account? "}
                <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign up here
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
