"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Calendar, CreditCard, MapPin, Package, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data types based on the provided models
type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled"
type PaymentMethod = "credit_card" | "paypal" | "cash_on_delivery"

interface Address {
  fullName: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phoneNumber: string
}

interface OrderProduct {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface OrderDetails {
  id: string
  userId: string
  products: OrderProduct[]
  shippingAddress: Address
  billingAddress: Address
  shippingCharge: number
  orderStatus: OrderStatus
  paymentMethod: PaymentMethod
  createdAt: string
  updatedAt: string
  customerName: string
  customerEmail: string
}

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching order data
    const fetchOrder = () => {
      setLoading(true)
      // Mock data for the order
      const mockOrder: OrderDetails = {
        id,
        userId: "user123",
        products: [
          {
            id: "prod1",
            name: "Cotton T-Shirt",
            price: 19.99,
            quantity: 2,
            image: "/placeholder.svg",
          },
          {
            id: "prod2",
            name: "Silk Scarf",
            price: 29.99,
            quantity: 1,
            image: "/placeholder.svg",
          },
          {
            id: "prod3",
            name: "Denim Jeans",
            price: 49.99,
            quantity: 1,
            image: "/placeholder.svg",
          },
        ],
        shippingAddress: {
          fullName: "John Doe",
          addressLine1: "123 Main St",
          addressLine2: "Apt 4B",
          city: "Anytown",
          state: "CA",
          postalCode: "12345",
          country: "United States",
          phoneNumber: "+1 (555) 123-4567",
        },
        billingAddress: {
          fullName: "John Doe",
          addressLine1: "123 Main St",
          addressLine2: "Apt 4B",
          city: "Anytown",
          state: "CA",
          postalCode: "12345",
          country: "United States",
          phoneNumber: "+1 (555) 123-4567",
        },
        shippingCharge: 5,
        orderStatus: "shipped",
        paymentMethod: "credit_card",
        createdAt: "2023-06-15T10:30:00Z",
        updatedAt: "2023-06-15T14:45:00Z",
        customerName: "John Doe",
        customerEmail: "john@example.com",
      }

      setOrder(mockOrder)
      setLoading(false)
    }

    fetchOrder()
  }, [id])

  const handleStatusChange = (newStatus: string) => {
    if (order) {
      setOrder({
        ...order,
        orderStatus: newStatus as OrderStatus,
      })
    }
  }

  const getStatusBadgeClass = (status: OrderStatus) => {
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

  const getPaymentMethodText = (method: PaymentMethod) => {
    switch (method) {
      case "credit_card":
        return "Credit Card"
      case "paypal":
        return "PayPal"
      case "cash_on_delivery":
        return "Cash on Delivery"
      default:
        return method
    }
  }

  const calculateSubtotal = () => {
    if (!order) return 0
    return order.products.reduce((total, product) => total + product.price * product.quantity, 0)
  }

  const calculateTotal = () => {
    return calculateSubtotal() + (order?.shippingCharge || 0)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading order details...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Order not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-2xl font-bold">Order Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Order #{order.id}</CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                </CardDescription>
              </div>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(
                  order.orderStatus,
                )}`}
              >
                {order.orderStatus}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Update Order Status</h3>
              <Select value={order.orderStatus} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="font-medium mb-2">Customer Information</h3>
              <div className="space-y-1">
                <p>{order.customerName}</p>
                <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  Shipping Address
                </h3>
                <div className="text-sm">
                  <p>{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  <p>{order.shippingAddress.phoneNumber}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  Billing Address
                </h3>
                <div className="text-sm">
                  <p>{order.billingAddress.fullName}</p>
                  <p>{order.billingAddress.addressLine1}</p>
                  {order.billingAddress.addressLine2 && <p>{order.billingAddress.addressLine2}</p>}
                  <p>
                    {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.postalCode}
                  </p>
                  <p>{order.billingAddress.country}</p>
                  <p>{order.billingAddress.phoneNumber}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2 flex items-center">
                <CreditCard className="h-4 w-4 mr-1" />
                Payment Method
              </h3>
              <p>{getPaymentMethodText(order.paymentMethod)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>
              {order.products.length} {order.products.length === 1 ? "item" : "items"} in this order
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="rounded-md object-cover"
                        />
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell className="text-right">${(product.price * product.quantity).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>${order.shippingCharge.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Truck className="mr-2 h-4 w-4" />
                Track Shipment
              </Button>
              <Button variant="outline" className="w-full">
                <Package className="mr-2 h-4 w-4" />
                Print Invoice
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

