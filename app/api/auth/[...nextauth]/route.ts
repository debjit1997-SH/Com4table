import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import dbConnect from "@/lib/mongoose"
import User from "@/models/User"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await dbConnect()

        // Check if user exists
        const existingUser = await User.findOne({ email: user.email })

        if (existingUser) {
          // If user exists but is not authorized, allow sign in but they'll see access needed message
          return true
        } else {
          // Create new user with pending status
          await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            role: "pending",
            authorized: false,
          })
          return true
        }
      }
      return true
    },
    async session({ session, token }) {
      if (session.user) {
        await dbConnect()

        // Get user from database
        const dbUser = await User.findOne({ email: session.user.email })

        if (dbUser) {
          // Add user role and authorization status to session
          session.user.role = dbUser.role
          session.user.authorized = dbUser.authorized
          session.user.id = dbUser._id.toString()
        }
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

