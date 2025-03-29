"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { ProductTable } from "./_components/productsTable/product-table";
import {
  LoadingSpinner,
  LoadingSpinnerLayout,
} from "@/components/common/loadingSpinner";
import { getProducts } from "@/lib/repositories/product.repository";
import { TProducts } from "@/types/product.types";

const CreateProduct = dynamic(
  () =>
    import("./_components/createProduct/create-product").then(
      mod => mod.CreateProduct,
    ),
  {
    ssr: false,
    loading: () => (
      <button className="bg-green-500 text-white px-4 py-2 rounded-md w-32">
        <LoadingSpinner size={4} />
      </button>
    ),
  },
);

export default function ProductsPage() {
  const [products, setProducts] = useState<TProducts[] | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    getProducts({ skip: 0, take: 20 })
      .then(data => setProducts(data.products))
      .catch(error => console.error(error));
  }, [setProducts]);

  if (products) {
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
              onChange={e => setSearchTerm(e.target.value)}
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
    );
  } else {
    return <LoadingSpinnerLayout />;
  }
}
