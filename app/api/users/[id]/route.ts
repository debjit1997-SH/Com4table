import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongoose"
import User from "@/models/User"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const id = params.id
    const user = await User.findById(id).select("-password")

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check if the current user is an admin
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await dbConnect()
    const id = params.id
    const body = await request.json()

    // Format the user data
    const userData: any = {
      updatedAt: new Date(),
    }

    // Only update fields that are provided
    if (body.name) userData.name = body.name
    if (body.role) userData.role = body.role
    if (typeof body.authorized !== "undefined") userData.authorized = body.authorized

    const result = await User.findByIdAndUpdate(id, userData, { new: true })

    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, user: result })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check if the current user is an admin
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await dbConnect()
    const id = params.id

    // Prevent deleting the last admin
    const adminCount = await User.countDocuments({ role: "admin" })
    const userToDelete = await User.findById(id)

    if (adminCount <= 1 && userToDelete?.role === "admin") {
      return NextResponse.json({ error: "Cannot delete the last admin user" }, { status: 400 })
    }

    const result = await User.findByIdAndDelete(id)

    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}

