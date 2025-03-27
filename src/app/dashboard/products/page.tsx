"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Input } from "@/components/ui/input"

import { ProductTable } from "./_components/productsTable/product-table"
import { LoadingSpinner } from "@/components/common/loadingSpinner";

const CreateProduct = dynamic(() => import("./_components/createProduct/create-product").then(mod=>mod.CreateProduct), {
  ssr: false,
  loading: () => <button className='bg-green-500 text-white px-4 py-2 rounded-md w-32'><LoadingSpinner size={4}/></button>,
})

interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  image: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([
    { id: "1", name: "Cotton T-Shirt", category: "Clothing", price: 19.99, stock: 45, image: "/placeholder.svg" },
    { id: "2", name: "Silk Scarf", category: "Accessories", price: 29.99, stock: 20, image: "/placeholder.svg" },
    { id: "3", name: "Denim Jeans", category: "Clothing", price: 49.99, stock: 30, image: "/placeholder.svg" },
    { id: "4", name: "Wool Sweater", category: "Clothing", price: 39.99, stock: 15, image: "/placeholder.svg" },
    { id: "5", name: "Linen Tablecloth", category: "Home", price: 24.99, stock: 25, image: "/placeholder.svg" },
    { id: "6", name: "Cotton Bedsheet", category: "Home", price: 34.99, stock: 18, image: "/placeholder.svg" },
  ])

  const [searchTerm, setSearchTerm] = useState("")


  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <CreateProduct />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductTable
            products={products}
            setProducts={setProducts}
            searchTerm={searchTerm}
          />
        </CardContent>
      </Card>
    </div>
  )
}

