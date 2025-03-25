"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, LayoutDashboard, LogOut, Menu, Package, ShoppingCart, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface NavItemProps {
  href: string
  icon: React.ElementType
  title: string
  isActive: boolean
}

function NavItem({ href, icon: Icon, title, isActive }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
        isActive
          ? "bg-green-100 text-green-900 dark:bg-green-800 dark:text-green-50"
          : "text-muted-foreground hover:bg-green-50 hover:text-green-900 dark:hover:bg-green-800 dark:hover:text-green-50",
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{title}</span>
    </Link>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Close sidebar when route changes
  useEffect(() => {
    setIsSidebarOpen(false)
  }, [pathname])

  const routes = [
    {
      href: "/dashboard",
      icon: LayoutDashboard,
      title: "Dashboard",
    },
    {
      href: "/dashboard/users",
      icon: Users,
      title: "Users",
    },
    {
      href: "/dashboard/products",
      icon: Package,
      title: "Products",
    },
    {
      href: "/dashboard/orders",
      icon: ShoppingCart,
      title: "Orders",
    },
    {
      href: "/dashboard/analytics",
      icon: BarChart3,
      title: "Analytics",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0 bg-white">
          <div className="flex h-full flex-col">
            <div className="border-b px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="font-bold text-green-600">BTH</span>
                </div>
                <span className="text-lg font-semibold">BD Textile Hub</span>
              </div>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid gap-1 px-2">
                {routes.map((route) => (
                  <NavItem
                    key={route.href}
                    href={route.href}
                    icon={route.icon}
                    title={route.title}
                    isActive={pathname === route.href}
                  />
                ))}
              </nav>
            </div>
            <div className="border-t p-4">
              <Button variant="outline" className="w-full justify-start gap-2" asChild>
                <Link href="/login">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Link>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="grid lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block border-r bg-white">
          <div className="flex h-full flex-col">
            <div className="border-b px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="font-bold text-green-600">BTH</span>
                </div>
                <span className="text-lg font-semibold">BD Textile Hub</span>
              </div>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid gap-1 px-2">
                {routes.map((route) => (
                  <NavItem
                    key={route.href}
                    href={route.href}
                    icon={route.icon}
                    title={route.title}
                    isActive={pathname === route.href}
                  />
                ))}
              </nav>
            </div>
            <div className="border-t p-4">
              <Button variant="outline" className="w-full justify-start gap-2" asChild>
                <Link href="/login">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Link>
              </Button>
            </div>
          </div>
        </aside>

        <main className="flex flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-white px-4 lg:h-[60px] lg:px-6">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold">
                {routes.find((route) => route.href === pathname)?.title || "Dashboard"}
              </h1>
            </div>
          </header>
          <div className="flex-1 p-4 lg:p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}

