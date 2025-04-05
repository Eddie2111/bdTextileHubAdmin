"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { LogOut, Menu } from "lucide-react";
import { NavItem } from "./nav-item";
import { routes } from "./routes";
import { usePathname } from "next/navigation";

interface IDesktopSidebarProps {
  children: React.ReactNode;
  setIsSidebarOpen: (value: boolean) => void;
}
export const DesktopSidebar = ({
  children,
  setIsSidebarOpen,
}: IDesktopSidebarProps) => {
  const pathname = usePathname();
  return (
    <div className="grid lg:grid-cols-[240px_1fr] h-[90vh]">
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
      </aside>

      <main className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-white px-4 lg:h-[65px] lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">
              {routes.find(route => route.href === pathname)?.title ||
                "Dashboard"}
            </h1>
          </div>
        </header>
        <div className="flex-1 p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
};
