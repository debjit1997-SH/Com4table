"use client"

import Link from "next/link"
import { DashboardNav } from "@/components/dashboard-nav"
import { UserNav } from "@/components/user-nav"
import { LayoutDashboard, ShoppingCart, Users, Package, Settings, FileText, BarChart4, UserCog } from "lucide-react"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Billing",
    href: "/dashboard/billing",
    icon: ShoppingCart,
  },
  {
    title: "Invoices",
    href: "/dashboard/invoices",
    icon: FileText,
  },
  {
    title: "Customers",
    href: "/dashboard/customers",
    icon: Users,
  },
  {
    title: "Products",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: BarChart4,
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: UserCog,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export default function DashboardLayoutClient({ children }) {
  const { data: session } = useSession()
  const [filteredNavItems, setFilteredNavItems] = useState(navItems)

  // Filter menu items based on user role
  useEffect(() => {
    if (session?.user?.role) {
      const rolePermissions = {
        admin: ["dashboard", "billing", "invoices", "customers", "products", "reports", "users", "settings"],
        manager: ["dashboard", "billing", "invoices", "customers", "products", "reports"],
        cashier: ["dashboard", "billing", "customers"],
      }

      const allowedPaths = rolePermissions[session.user.role] || []

      const filtered = navItems.filter((item) => {
        const path = item.href.split("/").pop()
        return allowedPaths.includes(path)
      })

      setFilteredNavItems(filtered)
    }
  }, [session])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <ShoppingCart className="h-6 w-6" />
          <span>StoreBill</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <UserNav />
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-muted/40 lg:block">
          <DashboardNav items={filteredNavItems} />
        </aside>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}

