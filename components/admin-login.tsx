"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { useToast } from "@/components/providers/toast-provider"

export default function AdminLogin() {
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const router = useRouter()
  const { setUser } = useAuthStore()
  const { showToast } = useToast()

  const loginAsAdmin = async () => {
    setIsLoggingIn(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "debjitdey1612@gmail.com",
          password: "amimalik12345",
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        showToast("success", "Logged in as admin successfully")
        router.push("/dashboard")
      } else {
        showToast("error", data.error || "Failed to log in as admin")
      }
    } catch (error) {
      console.error("Error logging in as admin:", error)
      showToast("error", "An error occurred while logging in as admin")
    } finally {
      setIsLoggingIn(false)
    }
  }

  return (
    <div className="mt-4">
      <button
        onClick={loginAsAdmin}
        disabled={isLoggingIn}
        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
      >
        {isLoggingIn ? "Logging in..." : "Login as Admin (Emergency)"}
      </button>
      <p className="mt-1 text-xs text-gray-500">Use this button if normal login is not working</p>
    </div>
  )
}
