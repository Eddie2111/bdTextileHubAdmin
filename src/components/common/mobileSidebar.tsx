"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { NavItem } from "./nav-item";
import { routes } from "./routes";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";

interface IMobileSidebarProps {
    open: boolean; 
    onOpenChange: (isSidebarOpen: boolean) => void;
}

export const MobileSidebar = ({open, onOpenChange}: IMobileSidebarProps) => {
    const pathname = usePathname();
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
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
                  {routes.map(route => (
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
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  asChild
                >
                  <Link href="/logout">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
    )
}
