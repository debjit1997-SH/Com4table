import { NextResponse } from "next/server"
import { getSql } from "@/lib/db"

export async function GET() {
  try {
    // Test the database connection
    const sql = getSql()
    const result = await sql`SELECT current_database() as database, current_timestamp as timestamp`

    return NextResponse.json({
      status: "connected",
      database: result[0].database,
      timestamp: result[0].timestamp,
      connection: "Neon PostgreSQL",
    })
  } catch (error) {
    console.error("Database connection error:", error)
    return NextResponse.json(
      {
        status: "error",
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
