"use client";
import { useRouter } from "next/navigation";
import { LoadingSpinnerLayout } from "@/components/common/loadingSpinner";
import { deleteCookie } from "@/lib/cookie";
import { toast } from "sonner";

export default function Page() {
  const router = useRouter();
  function logout() {
    return new Promise((resolve, reject) => {
      try {
        deleteCookie("auth_token");
        resolve(true);
        toast.success("Logged out successfully");
        router.push("/login");
      } catch (_) {
        console.log(_);
        toast.warning("You were not logged in, log in to continue");
        reject(false);
      }
    });
  }
  logout();

  return <LoadingSpinnerLayout />;
}
