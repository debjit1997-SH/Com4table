"use client"

import { useState, useEffect } from "react"
import { useAuthStore } from "@/lib/auth-state"

export default function DebugAuth() {
  const { users, fetchUsers } = useAuthStore()
  const [showDebug, setShowDebug] = useState(true)
  const [dbStatus, setDbStatus] = useState<"checking" | "connected" | "error">("checking")
  const [dbInfo, setDbInfo] = useState<any>(null)

  useEffect(() => {
    const checkDatabase = async () => {
      try {
        const response = await fetch("/api/debug-db")
        if (response.ok) {
          const data = await response.json()
          setDbStatus("connected")
          setDbInfo(data)
        } else {
          setDbStatus("error")
        }
      } catch (error) {
        console.error("Error checking database:", error)
        setDbStatus("error")
      }
    }

    checkDatabase()
    fetchUsers()
  }, [fetchUsers])

  return (
    <div className="mt-4 border-t pt-4">
      <button onClick={() => setShowDebug(!showDebug)} className="text-xs text-gray-400 hover:text-gray-600">
        {showDebug ? "Hide Debug Info" : "Show Debug Info"}
      </button>

      {showDebug && (
        <div className="mt-2 text-xs text-gray-500">
          <div className="mb-2">
            <p>
              Database Status:
              <span
                className={
                  dbStatus === "connected"
                    ? "text-green-600 font-medium ml-1"
                    : dbStatus === "error"
                      ? "text-red-600 font-medium ml-1"
                      : "text-yellow-600 font-medium ml-1"
                }
              >
                {dbStatus === "connected" ? "Connected" : dbStatus === "error" ? "Error" : "Checking..."}
              </span>
            </p>
            {dbInfo && <p>Connection: {dbInfo.database}</p>}
          </div>

          <p>Registered Users: {users.length}</p>
          <div className="mt-1 space-y-1 max-h-60 overflow-y-auto">
            {users.map((user) => (
              <div key={user.id} className="p-2 bg-gray-50 rounded border">
                <p>
                  <strong>Name:</strong> {user.name}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Role:</strong> {user.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
