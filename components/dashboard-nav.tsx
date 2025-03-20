"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function DashboardNav({ items }) {
  const pathname = usePathname()
  const [userRole, setUserRole] = useState("admin") // Default to admin for now
  const [filteredItems, setFilteredItems] = useState(items)

  // In a real app, you would fetch the user's role from an API or context
  useEffect(() => {
    // Simulate fetching user role from storage or API
    const getUserRole = () => {
      // For demo purposes, we'll use admin role
      // In a real app, this would come from authentication
      return "admin"
    }

    setUserRole(getUserRole())
  }, [])

  // Filter menu items based on user role
  useEffect(() => {
    const rolePermissions = {
      admin: ["dashboard", "billing", "invoices", "customers", "products", "reports", "users", "settings"],
      manager: ["dashboard", "billing", "invoices", "customers", "products", "reports"],
      cashier: ["dashboard", "billing", "customers"],
    }

    const allowedPaths = rolePermissions[userRole] || []

    const filtered = items.filter((item) => {
      const path = item.href.split("/").pop()
      return allowedPaths.includes(path)
    })

    setFilteredItems(filtered)
  }, [items, userRole])

  return (
    <nav className="grid items-start gap-2 p-4">
      {filteredItems.map((item, index) => {
        const Icon = item.icon
        return (
          <Link key={index} href={item.href}>
            <Button
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn("w-full justify-start", pathname === item.href && "bg-muted font-medium")}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.title}
            </Button>
          </Link>
        )
      })}
    </nav>
  )
}

