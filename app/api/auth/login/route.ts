import { NextResponse } from "next/server"
import { getSql } from "@/lib/db"
import { createAdminUser } from "@/lib/init-db"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const sql = getSql()

    // Special case for admin login
    if (email === "debjitdey1612@gmail.com" && password === "amimalik12345") {
      try {
        // Try to get the admin user from the database
        const users = await sql`SELECT * FROM users WHERE email = ${email}`

        // If admin user exists, return it
        if (users.length > 0) {
          const user = users[0]
          const { password: _, ...userWithoutPassword } = user

          return NextResponse.json({
            user: userWithoutPassword,
            message: "Admin login successful",
          })
        }

        // If admin user doesn't exist, try to create it
        const adminResult = await createAdminUser()

        if (adminResult.success) {
          // Get the newly created admin user
          const adminUsers = await sql`SELECT * FROM users WHERE email = ${email}`

          if (adminUsers.length > 0) {
            const adminUser = adminUsers[0]
            const { password: _, ...adminWithoutPassword } = adminUser

            return NextResponse.json({
              user: adminWithoutPassword,
              message: "Admin login successful (user created)",
            })
          }
        }

        // If all else fails, return a hardcoded admin user
        return NextResponse.json({
          user: {
            id: 1,
            name: "Debjit Dey",
            email: "debjitdey1612@gmail.com",
            role: "admin",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          message: "Admin login successful (fallback)",
        })
      } catch (adminError) {
        console.error("Error during admin login:", adminError)

        // Even if there's an error, allow admin login with hardcoded user
        return NextResponse.json({
          user: {
            id: 1,
            name: "Debjit Dey",
            email: "debjitdey1612@gmail.com",
            role: "admin",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          message: "Admin login successful (emergency fallback)",
        })
      }
    }

    // Normal user login flow
    try {
      const users = await sql`SELECT * FROM users WHERE email = ${email}`

      if (users.length === 0) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      const user = users[0]

      // In a real app, you would hash passwords and use bcrypt.compare
      if (user.password !== password) {
        return NextResponse.json({ error: "Invalid password" }, { status: 401 })
      }

      // Don't send the password back to the client
      const { password: _, ...userWithoutPassword } = user

      return NextResponse.json({
        user: userWithoutPassword,
        message: "Login successful",
      })
    } catch (error) {
      console.error("Error during regular login:", error)
      return NextResponse.json({ error: "An error occurred during login" }, { status: 500 })
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "An error occurred during login" }, { status: 500 })
  }
}
