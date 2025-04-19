// Client-side auth state management
import { create } from "zustand"
import { persist } from "zustand/middleware"

export type UserRole = "admin" | "manager" | "cashier" | "pending"

export interface AuthUser {
  id: number
  name: string
  email: string
  role: UserRole
}

interface AuthState {
  isAuthenticated: boolean
  user: AuthUser | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  fetchUsers: () => Promise<void>
  users: Array<{
    id: number
    name: string
    email: string
    role: UserRole
  }>
  addUser: (user: { name: string; email: string; password: string; role: UserRole }) => Promise<boolean>
  removeUser: (id: number) => Promise<boolean>
  updateUserRole: (id: number, role: UserRole) => Promise<boolean>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      users: [],

      login: async (email, password) => {
        try {
          console.log("Login attempt with:", { email })

          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            console.error("Login failed:", errorData)
            return false
          }

          const data = await response.json()
          console.log("Login successful:", data)

          set({
            isAuthenticated: true,
            user: {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              role: data.user.role,
            },
          })

          return true
        } catch (error) {
          console.error("Login error:", error)
          return false
        }
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
        })
      },

      fetchUsers: async () => {
        try {
          const response = await fetch("/api/users")

          if (!response.ok) {
            throw new Error("Failed to fetch users")
          }

          const users = await response.json()
          console.log("Fetched users:", users)

          set({ users })
        } catch (error) {
          console.error("Error fetching users:", error)
        }
      },

      addUser: async (userData) => {
        try {
          const response = await fetch("/api/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          })

          if (!response.ok) {
            const errorData = await response.json()
            console.error("Failed to add user:", errorData)
            return false
          }

          const newUser = await response.json()
          console.log("User added:", newUser)

          // Update the users list
          await get().fetchUsers()

          return true
        } catch (error) {
          console.error("Error adding user:", error)
          return false
        }
      },

      removeUser: async (id) => {
        try {
          const response = await fetch(`/api/users/${id}`, {
            method: "DELETE",
          })

          if (!response.ok) {
            const errorData = await response.json()
            console.error("Failed to remove user:", errorData)
            return false
          }

          console.log("User removed:", id)

          // Update the users list
          await get().fetchUsers()

          return true
        } catch (error) {
          console.error("Error removing user:", error)
          return false
        }
      },

      updateUserRole: async (id, role) => {
        try {
          const response = await fetch(`/api/users/${id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ role }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            console.error("Failed to update user role:", errorData)
            return false
          }

          console.log("User role updated:", { id, role })

          // Update the users list
          await get().fetchUsers()

          return true
        } catch (error) {
          console.error("Error updating user role:", error)
          return false
        }
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)
