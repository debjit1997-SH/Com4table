"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert, LogOut } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AccessNeededPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    // If user is authenticated and authorized, redirect to dashboard
    if (status === "authenticated" && session?.user?.authorized) {
      router.push("/dashboard")
    }
    // If user is not authenticated, redirect to login
    else if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, session, router])

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  if (status === "loading") {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4 text-amber-500">
            <ShieldAlert className="h-16 w-16" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Access Needed</CardTitle>
          <CardDescription className="text-center">
            Your account needs to be approved by an administrator before you can access the system.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          <div className="bg-muted p-4 rounded-lg">
            <p className="font-medium">Account Information:</p>
            <p className="mt-2">Email: {session?.user?.email}</p>
            <p>Name: {session?.user?.name}</p>
            <p className="mt-4 text-sm text-muted-foreground">
              Please contact your system administrator to get access to the StoreBill system.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSignOut} variant="outline" className="w-full">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

