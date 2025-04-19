import { query } from "../db"

export interface User {
  id: number
  name: string
  email: string
  password?: string
  role: string
  created_at?: Date
  updated_at?: Date
}

export async function getAllUsers(): Promise<User[]> {
  try {
    const result = await query("SELECT * FROM users ORDER BY id")
    return result.rows
  } catch (error) {
    console.error("Error getting users:", error)
    throw error
  }
}

export async function getUserById(id: number): Promise<User | null> {
  try {
    const result = await query("SELECT * FROM users WHERE id = $1", [id])
    return result.rows[0] || null
  } catch (error) {
    console.error("Error getting user by id:", error)
    throw error
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const result = await query("SELECT * FROM users WHERE email = $1", [email])
    return result.rows[0] || null
  } catch (error) {
    console.error("Error getting user by email:", error)
    throw error
  }
}

export async function createUser(user: Omit<User, "id" | "created_at" | "updated_at">): Promise<User> {
  try {
    const result = await query("INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *", [
      user.name,
      user.email,
      user.password,
      user.role,
    ])
    return result.rows[0]
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

export async function updateUser(
  id: number,
  user: Partial<Omit<User, "id" | "created_at" | "updated_at">>,
): Promise<User> {
  try {
    // Build the SET part of the query dynamically based on provided fields
    const fields = Object.keys(user).filter((key) => user[key] !== undefined)

    if (fields.length === 0) {
      throw new Error("No fields to update")
    }

    const setClause = fields.map((field, i) => `${field} = $${i + 2}`).join(", ")
    const values = fields.map((field) => user[field])

    const query = `
      UPDATE users 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1 
      RETURNING *
    `

    const result = await query(query, [id, ...values])
    return result.rows[0]
  } catch (error) {
    console.error("Error updating user:", error)
    throw error
  }
}

export async function deleteUser(id: number): Promise<boolean> {
  try {
    const result = await query("DELETE FROM users WHERE id = $1 RETURNING id", [id])
    return result.rowCount > 0
  } catch (error) {
    console.error("Error deleting user:", error)
    throw error
  }
}

export async function validateUserCredentials(email: string, password: string): Promise<User | null> {
  try {
    // In a real application, you would hash passwords and compare hashes
    const result = await query("SELECT * FROM users WHERE email = $1 AND password = $2", [email, password])
    return result.rows[0] || null
  } catch (error) {
    console.error("Error validating user credentials:", error)
    throw error
  }
}
