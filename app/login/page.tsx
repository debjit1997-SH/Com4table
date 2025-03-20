"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBag } from "lucide-react"
import { signIn, useSession } from "next-auth/react"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // If user is authenticated and authorized, redirect to dashboard
    if (status === "authenticated" && session?.user?.authorized) {
      router.push("/dashboard")
    }
    // If user is authenticated but not authorized, redirect to access-needed
    else if (status === "authenticated" && !session?.user?.authorized) {
      router.push("/access-needed")
    }
  }, [status, session, router])

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      await signIn("google", { callbackUrl: "/dashboard" })
    } catch (error) {
      console.error("Login error:", error)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <ShoppingBag className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">StoreBill</CardTitle>
          <CardDescription className="text-center">Sign in to access your store billing system</CardDescription>
          <div className="mt-4 p-4 bg-muted rounded-lg text-sm">
            <p className="font-medium mb-2">Role-Based Access:</p>
            <ul className="space-y-1 list-disc pl-5">
              <li>
                <span className="font-medium">Admin:</span> Full access to all features and settings
              </li>
              <li>
                <span className="font-medium">Store Manager:</span> Can manage products, customers, billing, and view
                reports
              </li>
              <li>
                <span className="font-medium">Cashier:</span> Can create bills and manage customers
              </li>
            </ul>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              "Signing in..."
            ) : (
              <>
                <Image src="/google-logo.png" alt="Google" width={20} height={20} />
                Sign in with Google
              </>
            )}
          </Button>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          <p>You need an authorized Google account to access this application.</p>
        </CardFooter>
      </Card>
    </div>
  )
}

