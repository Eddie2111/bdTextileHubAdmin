"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Ban, MoreHorizontal, Search, User, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getUsersWithProfile, updateUserWithProfile } from "@/lib/repositories/profile.repository"
import { formatDate } from "@/lib/utils"
import type { IUserProfile } from "@/types/profile.types"
import { toast } from "sonner"
import { UserStatus } from "@prisma/client"
import { USERS_ROUTE } from "@/components/common/routes"

export default function UsersPage() {
  const [users, setUsers] = useState<IUserProfile[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalUsers, setTotalUsers] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(1)
  const usersPerPage = 10

  useEffect(() => {
    async function fetchUsers() {
      setIsLoading(true)
      try {
        const response = await getUsersWithProfile({
          skip: (currentPage - 1) * usersPerPage,
          take: usersPerPage,
        })
        if (response) {
          const usersWithStatus = response.users.map((user) => ({
            ...user,
            email: user.user.email ?? " ",
          }))
          setUsers(usersWithStatus)
          setTotalUsers(response.total || 0)
          setTotalPages(Math.ceil((response.total || 0) / usersPerPage))
        }
      } catch (err) {
        console.error("Error fetching users:", err)
        setError("Failed to load users. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [currentPage])
  const filteredUsers = users.filter(
    (user) =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phoneNumber && user.phoneNumber.includes(searchTerm)),
  )
  async function setUserStatus(userId: string, status: string) {
    const userStatus = status === "active" ? UserStatus.ACTIVE : UserStatus.BLOCKED;
    console.log(status, userStatus);
    await updateUserWithProfile({
      id: userId,
      userData: {
        status: userStatus
      },
    })
  }

  const toggleUserStatus = async (userId: string) => {
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        const newStatus = user.status === UserStatus.ACTIVE ? UserStatus.BLOCKED : UserStatus.ACTIVE
        setUserStatus(userId, newStatus)
        return { ...user, status: newStatus }
      }
      return user
    })
    setUsers(updatedUsers)
    toast.success("User status updated successfully")
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, email, or phone..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>Users ( {totalUsers} )</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead className="hidden lg:table-cell">Phone</TableHead>
                    <TableHead className="hidden lg:table-cell">Joined</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.image || ""} alt={`${user.firstName} ${user.lastName}`} />
                              <AvatarFallback className="bg-green-100 text-green-600">
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{`${user.firstName} ${user.lastName}`}</p>
                              <p className="text-xs text-muted-foreground md:hidden">{user.user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex flex-col">{user.user.email}</div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">{user.phoneNumber || "—"}</TableCell>
                        <TableCell className="hidden lg:table-cell">{formatDate(user.createdAt)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={user.status === UserStatus.BLOCKED ? "outline" : "secondary"}
                            className={`${
                              user.status === UserStatus.ACTIVE
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-red-50 text-red-700 border-red-200"
                            }`}
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <div className="flex justify-between">
                                  <User className="mr-2 h-4 w-4" />
                                  <Link href={`${USERS_ROUTE}/${user.id}`}>View Profile</Link>
                                </div>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => toggleUserStatus(user.id)}
                                className={user.status === UserStatus.BLOCKED ? "text-green-600" : "text-red-600"}
                              >
                                <Ban className="mr-2 h-4 w-4" />
                                {user.status === UserStatus.ACTIVE ? "Block User" : "Unblock User"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        {searchTerm ? "No users match your search criteria" : "No users found"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {!isLoading && !error && filteredUsers.length > 0 && (
                <div className="flex justify-center items-center mt-4 space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        className="w-8 h-8"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

