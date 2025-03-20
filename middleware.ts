import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAuthenticated = !!token
  const isAuthorized = token?.authorized === true

  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Public paths that don't require authentication
  const publicPaths = ["/", "/login", "/access-needed"]
  const isPublicPath = publicPaths.includes(path)

  // If the path is not public and the user is not authenticated, redirect to login
  if (!isPublicPath && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If the user is authenticated but not authorized and trying to access a protected route
  if (!isPublicPath && isAuthenticated && !isAuthorized && path !== "/access-needed") {
    return NextResponse.redirect(new URL("/access-needed", request.url))
  }

  // If the user is authenticated and authorized but trying to access login or access-needed
  if ((path === "/login" || path === "/access-needed") && isAuthenticated && isAuthorized) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

