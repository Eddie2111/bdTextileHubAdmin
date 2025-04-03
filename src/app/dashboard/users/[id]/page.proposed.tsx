import { redirect } from "next/navigation"
import { ArrowLeft, Mail, Phone, User, ShoppingBag, Heart, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getOneUserWithProfile } from "@/lib/repositories/profile.repository"
import { formatDate } from "@/lib/utils"
import { ToggleUserStatusButton } from "./toggle-status-button"

interface UserProfileProps {
  params: {
    id: string
  }
}

export default async function UserProfilePage({ params }: UserProfileProps) {
  const { id } = params

  try {
    const response = await getOneUserWithProfile({ id })
    const { oneUserProfile } = response

    if (!oneUserProfile) {
      redirect("/users")
    }

    const userFullName = `${oneUserProfile.firstName} ${oneUserProfile.lastName}`
    const totalOrders = oneUserProfile.orders.length
    const totalSpent = oneUserProfile.orders.reduce((sum, order) => {
      const orderTotal =
        order.products.reduce((total, product) => total + (product?.price || 0), 0) + (order.shippingCharge || 0)
      return sum + orderTotal
    }, 0)

    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <a href="/users">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </a>
          </Button>
          <h1 className="text-2xl font-bold">User Profile</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>View and manage user details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center justify-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={oneUserProfile.image || ""} alt={userFullName} />
                  <AvatarFallback className="bg-green-100 text-green-600">
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                <h2 className="mt-4 text-xl font-semibold">{userFullName}</h2>
                <Badge variant={oneUserProfile.role === "ADMIN" ? "default" : "outline"} className="mt-2">
                  {oneUserProfile.role}
                </Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-base">{oneUserProfile.user.email}</p>
                  </div>
                  {oneUserProfile.user.emailVerified && (
                    <Badge variant="outline" className="mt-1 text-xs bg-green-50 text-green-700 border-green-200">
                      Verified
                    </Badge>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p className="text-base">{oneUserProfile.phoneNumber || "Not provided"}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                  <p className="text-base mt-1">{oneUserProfile.address || "Not provided"}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Join Date</h3>
                  <p className="text-base mt-1">{formatDate(oneUserProfile.createdAt)}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <ToggleUserStatusButton userId={id} />
            </CardFooter>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
              <CardDescription>Orders, wishlists, and cart items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="rounded-lg border p-4 flex flex-col items-center">
                  <ShoppingBag className="h-6 w-6 text-green-600 mb-2" />
                  <h3 className="text-sm font-medium text-muted-foreground">Orders</h3>
                  <p className="text-2xl font-bold">{totalOrders}</p>
                </div>
                <div className="rounded-lg border p-4 flex flex-col items-center">
                  <Heart className="h-6 w-6 text-rose-500 mb-2" />
                  <h3 className="text-sm font-medium text-muted-foreground">Wishlist</h3>
                  <p className="text-2xl font-bold">{oneUserProfile.wishlists.length}</p>
                </div>
                <div className="rounded-lg border p-4 flex flex-col items-center">
                  <ShoppingCart className="h-6 w-6 text-amber-500 mb-2" />
                  <h3 className="text-sm font-medium text-muted-foreground">Cart</h3>
                  <p className="text-2xl font-bold">{oneUserProfile.carts.length}</p>
                </div>
              </div>

              <div className="rounded-lg border p-4 mb-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Spent</h3>
                <p className="text-3xl font-bold">${totalSpent.toFixed(2)}</p>
              </div>

              <Tabs defaultValue="orders">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                  <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                  <TabsTrigger value="cart">Cart</TabsTrigger>
                </TabsList>

                <TabsContent value="orders" className="space-y-4">
                  {oneUserProfile.orders.length > 0 ? (
                    oneUserProfile.orders.map((order, index) => {
                      const orderTotal =
                        order.products.reduce((total, product) => total + (product?.price || 0), 0) +
                        (order.shippingCharge || 0)

                      return (
                        <div key={index} className="flex items-center justify-between rounded-lg border p-4">
                          <div>
                            <p className="font-medium">Order #{index + 1001}</p>
                            <p className="text-sm text-muted-foreground">{order.products.length} items</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${orderTotal.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">
                              Shipping: ${order.shippingCharge?.toFixed(2) || "0.00"}
                            </p>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-center text-muted-foreground py-4">No orders found</p>
                  )}
                </TabsContent>

                <TabsContent value="wishlist" className="space-y-4">
                  {oneUserProfile.wishlists.length > 0 && oneUserProfile.wishlists[0].products.length > 0 ? (
                    oneUserProfile.wishlists[0].products.map((product, index) => (
                      <div key={index} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded bg-slate-100 flex items-center justify-center overflow-hidden">
                            {product?.image ? (
                              <img
                                src={product.image[0] || "/placeholder.svg"}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <ShoppingBag className="h-6 w-6 text-slate-400" />
                            )}
                          </div>
                          <p className="font-medium">{product?.name}</p>
                        </div>
                        <p className="font-medium">${product?.price?.toFixed(2)}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-4">No wishlist items found</p>
                  )}
                </TabsContent>

                <TabsContent value="cart" className="space-y-4">
                  {oneUserProfile.carts.length > 0 && oneUserProfile.carts[0].products.length > 0 ? (
                    oneUserProfile.carts[0].products.map((product, index) => (
                      <div key={index} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded bg-slate-100 flex items-center justify-center overflow-hidden">
                            {product?.image ? (
                              <img
                                src={product.image[0] || "/placeholder.svg"}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <ShoppingBag className="h-6 w-6 text-slate-400" />
                            )}
                          </div>
                          <p className="font-medium">{product?.name}</p>
                        </div>
                        <p className="font-medium">${product?.price?.toFixed(2)}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-4">No cart items found</p>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" asChild>
            <a href="/users">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </a>
          </Button>
          <h1 className="text-2xl font-bold">User Profile</h1>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-lg text-red-500 mb-4">Failed to load user profile</p>
            <Button asChild>
              <a href="/users">Return to Users</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
}

