"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, MoreHorizontal, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { mock_wishlist } from "./wishlist.constant"
import { USERS_ROUTE, WISHLISTS_ROUTE } from "@/components/common/routes"

// interface Wishlist {
//   id: string
//   userId: string
//   userName: string
//   userEmail: string
//   itemCount: number
//   lastUpdated: string
// }

export default function WishlistsPage() {
  // const [wishlists, setWishlists] = useState<Wishlist[]>(mock_wishlist);
  const wishlists = mock_wishlist;
  const [searchTerm, setSearchTerm] = useState("")

  const filteredWishlists = wishlists.filter(
    (wishlist) =>
      wishlist.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wishlist.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wishlist.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search wishlists..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Wishlists</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Wishlist ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWishlists.map((wishlist) => (
                <TableRow key={wishlist.id}>
                  <TableCell className="font-medium">{wishlist.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{wishlist.userName}</span>
                      <span className="text-xs text-muted-foreground">{wishlist.userEmail}</span>
                    </div>
                  </TableCell>
                  <TableCell>{wishlist.itemCount}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(wishlist.lastUpdated).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`${WISHLISTS_ROUTE}/${wishlist.id}`}>View Details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`${USERS_ROUTE}/${wishlist.userId}`}>View Customer</Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {filteredWishlists.length} of {wishlists.length} wishlists
        </div>
      </div>
    </div>
  )
}

