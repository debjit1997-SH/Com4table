import { NextResponse } from "next/server"
import { getSql } from "@/lib/db"

export async function GET() {
  try {
    const sql = getSql()
    const users = await sql`SELECT id, name, email, role, created_at, updated_at FROM users`

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json()

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Name, email, password, and role are required" }, { status: 400 })
    }

    const sql = getSql()

    // Check if user already exists
    const existingUsers = await sql`SELECT * FROM users WHERE email = ${email}`

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // In a real app, you would hash the password before storing
    const newUser = await sql`
      INSERT INTO users (name, email, password, role)
      VALUES (${name}, ${email}, ${password}, ${role})
      RETURNING id, name, email, role, created_at, updated_at
    `

    return NextResponse.json({
      user: newUser[0],
      message: "User created successfully",
    })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
