"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Eye, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ORDERS_ROUTE } from "@/components/common/routes"

interface Order {
  id: string
  customer: string
  date: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | string;
  total: number
  items: number
}

export default function OrdersPage() {
  const router = useRouter();
  const orders = [
    { id: "ORD-001", customer: "John Doe", date: "2023-03-15", status: "delivered", total: 89.99, items: 2 },
    { id: "ORD-002", customer: "Jane Smith", date: "2023-03-16", status: "shipped", total: 129.99, items: 3 },
    { id: "ORD-003", customer: "Robert Johnson", date: "2023-03-17", status: "processing", total: 59.99, items: 1 },
    { id: "ORD-004", customer: "Emily Davis", date: "2023-03-18", status: "pending", total: 149.99, items: 4 },
    { id: "ORD-005", customer: "Michael Wilson", date: "2023-03-19", status: "delivered", total: 79.99, items: 2 },
    { id: "ORD-006", customer: "Sarah Brown", date: "2023-03-20", status: "cancelled", total: 99.99, items: 3 },
    { id: "ORD-007", customer: "David Miller", date: "2023-03-21", status: "shipped", total: 119.99, items: 2 },
    { id: "ORD-008", customer: "Lisa Garcia", date: "2023-03-22", status: "processing", total: 69.99, items: 1 },
  ];

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredOrders = orders.filter(
    (order) =>
      (order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || order.status === statusFilter),
  )

  const getStatusBadgeClass = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }
  const navigate = (orderId: string) => {
    router.push(`${ORDERS_ROUTE}/${orderId}`);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search orders..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(order.date).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(
                        order.status,
                      )}`}
                    >
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={()=>navigate(order.id)}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View order</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

