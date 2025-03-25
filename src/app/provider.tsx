"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

import { useAuth } from "@/lib/contexts/auth.context";
import { getCookie } from "@/lib/cookie";
import { MobileSidebar } from "@/components/common/mobileSidebar";
import { DesktopSidebar } from "@/components/common/desktopSidebar";
import { LoadingSpinnerLayout } from "@/components/common/loadingSpinner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { isAuthenticated, setIsAuthenticated, loading, setLoading } =
    useAuth();
  useEffect(() => {
    async function checkAuthentication() {
      setLoading(true);
      const response = await getCookie("auth_token");
      if (response) {
        setIsAuthenticated(true);
        router.push("/dashboard");
        setLoading(false);
      } else {
        setIsAuthenticated(false);
        router.push("/login");
        setLoading(false);
      }
    }

    checkAuthentication();
  }, [router, setIsAuthenticated, setLoading]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  if (loading) {
    return <LoadingSpinnerLayout/>
  }
  else if (pathname.includes("login")) {
    return <div>{children}</div>;
  } else if (isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col">
        {/* Mobile Sidebar */}
        <MobileSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen}/>


        {/* Desktop Sidebar */}
        <DesktopSidebar setIsSidebarOpen={setIsSidebarOpen}>
          {children}
          </DesktopSidebar>
      </div>
    );
  }
}
