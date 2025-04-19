"use client"

import { useState } from "react"
import { useToast } from "@/components/providers/toast-provider"

export default function DbInitializer() {
  const [isInitializing, setIsInitializing] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false)
  const [adminCreated, setAdminCreated] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { showToast } = useToast()

  const initializeDatabase = async () => {
    setIsInitializing(true)
    setError(null)

    try {
      const response = await fetch("/api/init-db")

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to initialize database")
      }

      const data = await response.json()
      showToast("success", data.message || "Database initialized successfully")
      setIsInitialized(true)
    } catch (error) {
      console.error("Error initializing database:", error)
      setError(error.message || "An error occurred while initializing the database")
      showToast("error", error.message || "Failed to initialize database")
    } finally {
      setIsInitializing(false)
    }
  }

  const createAdminUser = async () => {
    setIsCreatingAdmin(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/create")

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create admin user")
      }

      const data = await response.json()
      showToast("success", data.message || "Admin user created successfully")
      setAdminCreated(true)
    } catch (error) {
      console.error("Error creating admin user:", error)
      setError(error.message || "An error occurred while creating the admin user")
      showToast("error", error.message || "Failed to create admin user")
    } finally {
      setIsCreatingAdmin(false)
    }
  }

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-md border">
      <h3 className="text-sm font-medium mb-2">Database Initialization</h3>

      {error && <div className="mb-3 text-xs text-red-600">Error: {error}</div>}

      <div className="flex flex-col space-y-3">
        <button
          onClick={initializeDatabase}
          disabled={isInitializing || isInitialized}
          className={`px-3 py-1.5 text-xs rounded-md ${
            isInitialized ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"
          } disabled:opacity-50`}
        >
          {isInitializing ? "Initializing..." : isInitialized ? "Database Initialized" : "Initialize Database"}
        </button>

        <button
          onClick={createAdminUser}
          disabled={isCreatingAdmin || adminCreated}
          className={`px-3 py-1.5 text-xs rounded-md ${
            adminCreated ? "bg-green-600 text-white" : "bg-yellow-600 text-white hover:bg-yellow-700"
          } disabled:opacity-50`}
        >
          {isCreatingAdmin ? "Creating Admin..." : adminCreated ? "Admin User Created" : "Create Admin User Only"}
        </button>
      </div>

      <p className="mt-2 text-xs text-gray-500">If database initialization fails, try creating just the admin user.</p>

      <div className="mt-3 text-xs text-blue-600">
        <strong>Admin Credentials:</strong>
        <div>Email: debjitdey1612@gmail.com</div>
        <div>Password: amimalik12345</div>
      </div>
    </div>
  )
}
