import { NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/init-db"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const secret = url.searchParams.get("secret")

    // Only allow this in development or with the correct secret
    if (process.env.NODE_ENV !== "development" && secret !== process.env.SETUP_SECRET) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 })
    }

    const success = await initializeDatabase()

    if (success) {
      return NextResponse.json({ success: true, message: "Database initialized successfully" })
    } else {
      return NextResponse.json({ success: false, message: "Failed to initialize database" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in init-db route:", error)
    return NextResponse.json(
      {
        error: "Failed to initialize database",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
