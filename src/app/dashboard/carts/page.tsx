"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, MoreHorizontal, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CARTS_ROUTE, USERS_ROUTE } from "@/components/common/routes"

interface ICart {
  id: string
  userId: string
  userName: string
  userEmail: string
  itemCount: number
  totalValue: number
  lastUpdated: string
}

export default function CartsPage() {
  const carts: ICart[] = [
    {
      id: "cart1",
      userId: "user1",
      userName: "John Doe",
      userEmail: "john@example.com",
      itemCount: 3,
      totalValue: 89.97,
      lastUpdated: "2023-06-15T14:45:00Z",
    },
    {
      id: "cart2",
      userId: "user2",
      userName: "Jane Smith",
      userEmail: "jane@example.com",
      itemCount: 2,
      totalValue: 129.98,
      lastUpdated: "2023-06-16T09:30:00Z",
    },
    {
      id: "cart3",
      userId: "user3",
      userName: "Robert Johnson",
      userEmail: "robert@example.com",
      itemCount: 5,
      totalValue: 245.95,
      lastUpdated: "2023-06-16T11:20:00Z",
    },
    {
      id: "cart4",
      userId: "user4",
      userName: "Emily Davis",
      userEmail: "emily@example.com",
      itemCount: 1,
      totalValue: 49.99,
      lastUpdated: "2023-06-17T08:15:00Z",
    },
    {
      id: "cart5",
      userId: "user5",
      userName: "Michael Wilson",
      userEmail: "michael@example.com",
      itemCount: 4,
      totalValue: 159.96,
      lastUpdated: "2023-06-17T16:40:00Z",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("")

  const filteredCarts = carts.filter(
    (cart) =>
      cart.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cart.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cart.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search carts..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Carts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cart ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCarts.map((cart) => (
                <TableRow key={cart.id}>
                  <TableCell className="font-medium">{cart.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{cart.userName}</span>
                      <span className="text-xs text-muted-foreground">{cart.userEmail}</span>
                    </div>
                  </TableCell>
                  <TableCell>{cart.itemCount}</TableCell>
                  <TableCell>${cart.totalValue.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(cart.lastUpdated).toLocaleDateString()}
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
                          <Link href={`${CARTS_ROUTE}/${cart.id}`}>View Details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`${USERS_ROUTE}/${cart.userId}`}>View Customer</Link>
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
          Showing {filteredCarts.length} of {carts.length} carts
        </div>
      </div>
    </div>
  )
}

