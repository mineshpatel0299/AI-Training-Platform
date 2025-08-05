"use client"

import { useEffect, useState } from "react"
import { type User, onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/supabase"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    console.log("Setting up auth state listener...")

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        console.log("Auth state changed:", user ? `User: ${user.email}` : "No user")
        setUser(user)
        setLoading(false)
        setInitialized(true)
      },
      (error) => {
        console.error("Auth state change error:", error)
        setLoading(false)
        setInitialized(true)
      },
    )

    return () => {
      console.log("Cleaning up auth listener")
      unsubscribe()
    }
  }, [])

  return { user, loading, initialized }
}
