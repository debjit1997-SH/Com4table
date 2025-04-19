"use client"

import { useState, useEffect } from "react"
import { useAuthStore } from "@/store/auth-store"

export default function Debug() {
  const [showDebug, setShowDebug] = useState(false)
  const [dbStatus, setDbStatus] = useState<any>(null)
  const [dbError, setDbError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<any[]>([])
  const { user } = useAuthStore()

  useEffect(() => {
    const checkDatabase = async () => {
      try {
        const response = await fetch("/api/debug-db")
        if (response.ok) {
          const data = await response.json()
          setDbStatus(data)
        } else {
          const error = await response.json()
          setDbError(error.error || "Failed to connect to database")
        }
      } catch (error) {
        setDbError(error.message || "Failed to check database status")
      } finally {
        setIsLoading(false)
      }
    }

    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users")
        if (response.ok) {
          const data = await response.json()
          setUsers(data.users || [])
        }
      } catch (error) {
        console.error("Error fetching users:", error)
      }
    }

    checkDatabase()
    fetchUsers()
  }, [])

  const toggleDebug = () => {
    setShowDebug(!showDebug)
  }

  return (
    <div className="mt-4 text-sm">
      <button onClick={toggleDebug} className="text-blue-600 hover:underline">
        {showDebug ? "Hide Debug Info" : "Show Debug Info"}
      </button>

      {showDebug && (
        <div className="mt-2 p-3 bg-gray-50 rounded-md border text-xs">
          <h3 className="font-medium mb-1">Debug Information</h3>

          <div className="mb-2">
            <strong>Current User:</strong>{" "}
            {user ? (
              <span>
                {user.name} ({user.email}) - {user.role}
              </span>
            ) : (
              <span className="text-red-600">Not logged in</span>
            )}
          </div>

          <div className="mb-2">
            <strong>Database Status:</strong>{" "}
            {isLoading ? (
              <span>Checking...</span>
            ) : dbError ? (
              <span className="text-red-600">Error: {dbError}</span>
            ) : (
              <span className="text-green-600">Connected</span>
            )}
          </div>

          {dbStatus && (
            <div className="mb-2">
              <strong>Connection:</strong> {dbStatus.connection}
              <br />
              <strong>Database:</strong> {dbStatus.database}
              <br />
              <strong>Timestamp:</strong> {dbStatus.timestamp}
            </div>
          )}

          <div>
            <strong>Registered Users:</strong> {users.length}
            {users.length > 0 && (
              <ul className="mt-1 ml-4 list-disc">
                {users.map((user, index) => (
                  <li key={index}>
                    {user.name} ({user.email}) - {user.role}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
            <strong>Admin Login:</strong>
            <div>Email: debjitdey1612@gmail.com</div>
            <div>Password: amimalik12345</div>
          </div>
        </div>
      )}
    </div>
  )
}
