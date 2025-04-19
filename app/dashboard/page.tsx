"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"

export default function DashboardPage() {
  const { user } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <div className="mb-4 p-4 bg-blue-50 rounded-md">
            <p className="text-blue-800">
              Welcome, {user.name}! You are logged in as {user.role}.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-md border">
              <h2 className="text-lg font-semibold mb-2">Quick Stats</h2>
              <p>Coming soon...</p>
            </div>
            <div className="bg-white p-4 rounded-md border">
              <h2 className="text-lg font-semibold mb-2">Recent Bills</h2>
              <p>Coming soon...</p>
            </div>
            <div className="bg-white p-4 rounded-md border">
              <h2 className="text-lg font-semibold mb-2">Low Stock</h2>
              <p>Coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
