"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Heart, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WISHLISTS_ROUTE } from "@/components/common/routes";

interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
}

interface WishlistDetails {
  id: string;
  userId: string;
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
  customerName: string;
  customerEmail: string;
}

export default function WishlistDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { id } = params;
  const [wishlist, setWishlist] = useState<WishlistDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching wishlist data
    const fetchWishlist = () => {
      setLoading(true);
      // Mock data for the wishlist
      const mockWishlist: WishlistDetails = {
        id,
        userId: "user123",
        items: [
          {
            id: "item1",
            productId: "prod5",
            name: "Linen Tablecloth",
            price: 24.99,
            image: "/placeholder.svg",
            inStock: true,
          },
          {
            id: "item2",
            productId: "prod6",
            name: "Cotton Bedsheet",
            price: 34.99,
            image: "/placeholder.svg",
            inStock: true,
          },
          {
            id: "item3",
            productId: "prod7",
            name: "Cashmere Sweater",
            price: 89.99,
            image: "/placeholder.svg",
            inStock: false,
          },
        ],
        createdAt: "2023-05-20T10:30:00Z",
        updatedAt: "2023-06-05T14:45:00Z",
        customerName: "John Doe",
        customerEmail: "john@example.com",
      };

      setWishlist(mockWishlist);
      setLoading(false);
    };

    fetchWishlist();
  }, [id]);

  const handleAddToCart = (itemId: string) => {
    // In a real app, this would add to cart
    console.log(`Added item ${itemId} to cart`);
  };

  const handleAddAllToCart = () => {
    // In a real app, this would add all in-stock items to cart
    console.log("Added all in-stock items to cart");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading wishlist details...</p>
      </div>
    );
  }

  if (!wishlist) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Wishlist not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-2xl font-bold">Wishlist Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Wishlist #{wishlist.id}</CardTitle>
                <CardDescription className="mt-1">
                  Last updated:{" "}
                  {new Date(wishlist.updatedAt).toLocaleDateString()} at{" "}
                  {new Date(wishlist.updatedAt).toLocaleTimeString()}
                </CardDescription>
              </div>
              <Heart className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Customer Information</h3>
              <div className="space-y-1">
                <p>{wishlist.customerName}</p>
                <p className="text-sm text-muted-foreground">
                  {wishlist.customerEmail}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Wishlist Status</h3>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
                <span className="text-sm text-muted-foreground">
                  Created {new Date(wishlist.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Wishlist Items</CardTitle>
            <CardDescription>
              {wishlist.items.length}{" "}
              {wishlist.items.length === 1 ? "item" : "items"} in this wishlist
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wishlist.items.map(item => (
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
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          item.inStock
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center"
                        onClick={() => handleAddToCart(item.id)}
                        disabled={!item.inStock}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex flex-col gap-2">
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handleAddAllToCart}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add All to Cart
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push(WISHLISTS_ROUTE)}
              >
                Return to Wishlist
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
