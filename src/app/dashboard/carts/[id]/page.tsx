"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CARTS_ROUTE } from "@/components/common/routes"

interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

interface CartDetails {
  id: string
  userId: string
  items: CartItem[]
  createdAt: string
  updatedAt: string
  customerName: string
  customerEmail: string
}

export default function CartDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params
  const [cart, setCart] = useState<CartDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching cart data
    const fetchCart = () => {
      setLoading(true)
      // Mock data for the cart
      const mockCart: CartDetails = {
        id,
        userId: "user123",
        items: [
          {
            id: "item1",
            productId: "prod1",
            name: "Cotton T-Shirt",
            price: 19.99,
            quantity: 2,
            image: "/placeholder.svg",
          },
          {
            id: "item2",
            productId: "prod2",
            name: "Silk Scarf",
            price: 29.99,
            quantity: 1,
            image: "/placeholder.svg",
          },
          {
            id: "item3",
            productId: "prod3",
            name: "Denim Jeans",
            price: 49.99,
            quantity: 1,
            image: "/placeholder.svg",
          },
        ],
        createdAt: "2023-06-15T10:30:00Z",
        updatedAt: "2023-06-15T14:45:00Z",
        customerName: "John Doe",
        customerEmail: "john@example.com",
      }

      setCart(mockCart)
      setLoading(false)
    }

    fetchCart()
  }, [id])

  const calculateSubtotal = () => {
    if (!cart) return 0
    return cart.items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const calculateShipping = () => {
    // Simple shipping calculation
    const subtotal = calculateSubtotal()
    return subtotal > 100 ? 0 : 10
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading cart details...</p>
      </div>
    )
  }

  if (!cart) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Cart not found</p>
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
        <h1 className="text-2xl font-bold">Cart Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Cart #{cart.id}</CardTitle>
                <CardDescription className="mt-1">
                  Last updated: {new Date(cart.updatedAt).toLocaleDateString()} at{" "}
                  {new Date(cart.updatedAt).toLocaleTimeString()}
                </CardDescription>
              </div>
              <ShoppingCart className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Customer Information</h3>
              <div className="space-y-1">
                <p>{cart.customerName}</p>
                <p className="text-sm text-muted-foreground">{cart.customerEmail}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Cart Status</h3>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800">
                  Active
                </span>
                <span className="text-sm text-muted-foreground">
                  Created {new Date(cart.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cart Summary</CardTitle>
            <CardDescription>
              {cart.items.length} {cart.items.length === 1 ? "item" : "items"} in this cart
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
                {cart.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={40}
                          height={40}
                          className="rounded-md object-cover"
                        />
                        <span className="font-medium">{item.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
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
                <span>{calculateShipping() === 0 ? "Free" : `$${calculateShipping().toFixed(2)}`}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button className="w-full bg-green-600 hover:bg-green-700">Proceed to Checkout</Button>
              <Button variant="outline" className="w-full" onClick={() => router.push(CARTS_ROUTE)}>
                Return to Cart
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

