"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface User {
  uid: string
  email: string | null
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  configError: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  configError: false,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [configError, setConfigError] = useState(false)

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/session")
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error("[v0] Error checking auth:", error)
        setConfigError(true)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const signIn = async (email: string, password: string) => {
    console.log("[v0] AuthContext: signIn called with email:", email)
    const response = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    console.log("[v0] AuthContext: signIn response status:", response.status)

    if (!response.ok) {
      const error = await response.json()
      console.error("[v0] AuthContext: signIn error:", error)
      throw new Error(error.error || "Failed to sign in")
    }

    const data = await response.json()
    console.log("[v0] AuthContext: signIn successful, user:", data.user)
    setUser(data.user)
  }

  const signUp = async (email: string, password: string) => {
    console.log("[v0] AuthContext: signUp called with email:", email)
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    console.log("[v0] AuthContext: signUp response status:", response.status)

    if (!response.ok) {
      const error = await response.json()
      console.error("[v0] AuthContext: signUp error:", error)
      throw new Error(error.error || "Failed to sign up")
    }

    const data = await response.json()
    console.log("[v0] AuthContext: signUp successful, user:", data.user)
    setUser(data.user)
  }

  const signOut = async () => {
    const response = await fetch("/api/auth/signout", {
      method: "POST",
    })

    if (!response.ok) {
      throw new Error("Failed to sign out")
    }

    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, configError }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
