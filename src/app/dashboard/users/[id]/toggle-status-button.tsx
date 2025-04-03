"use client"

import { useState } from "react"
import { Ban } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner";

interface ToggleUserStatusButtonProps {
  userId: string
}

export function ToggleUserStatusButton({ userId }: ToggleUserStatusButtonProps) {
  const [isActive, setIsActive] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const toggleUserStatus = async () => {
    setIsLoading(true)
    try {
      // This would be replaced with your actual API call
      // const response = await fetch(`/api/users/${userId}/toggle-status`, {
      //   method: 'POST',
      // });

      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setIsActive(!isActive)
      toast.success(`The user has been ${isActive ? "blocked" : "unblocked"}.`)
    } catch (error) {
      toast("Failed to update user status. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      className={`w-full ${isActive ? "text-red-600" : "text-green-600"}`}
      onClick={toggleUserStatus}
      disabled={isLoading}
      size="sm"
    >
      <Ban className="mr-2 h-4 w-4" />
      {isActive ? "Block User" : "Unblock User"}
    </Button>
  )
}
