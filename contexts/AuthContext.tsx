"use client"

import type React from "react"

import { createContext, useContext, useEffect } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

type AuthContextType = {
  user: any
  status: "loading" | "authenticated" | "unauthenticated"
  signIn: (provider: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  const handleSignIn = async (provider: string) => {
    await signIn(provider, { callbackUrl: "/dashboard" })
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  // Redirect to access needed page if user is not authorized
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      if (!session.user.authorized && router.pathname !== "/access-needed") {
        router.push("/access-needed")
      }
    }
  }, [status, session, router])

  return (
    <AuthContext.Provider
      value={{
        user: session?.user,
        status,
        signIn: handleSignIn,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

