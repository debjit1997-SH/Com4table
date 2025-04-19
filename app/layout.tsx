import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ToastProvider } from "@/components/providers/toast-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Billing Software",
  description: "Custom billing software for small businesses",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  )
}
