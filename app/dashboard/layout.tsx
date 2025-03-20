import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route"
import DashboardLayoutClient from "./DashboardLayoutClient"

export const metadata: Metadata = {
  title: "StoreBill Dashboard",
  description: "Store billing and management system",
}

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions)

  // If not authenticated, redirect to login
  if (!session) {
    redirect("/login")
  }

  // If authenticated but not authorized, redirect to access-needed
  if (session && !session.user.authorized) {
    redirect("/access-needed")
  }

  return <DashboardLayoutClient>{children}</DashboardLayoutClient>
}

