import { NextResponse } from "next/server"
import { createAdminUser } from "@/lib/init-db"

export async function GET() {
  try {
    const result = await createAdminUser()

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in admin creation route:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
