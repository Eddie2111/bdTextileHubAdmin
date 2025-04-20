"use client";
import SanityImage from "@/components/common/sanity-image.client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteProduct } from "@/lib/repositories/product.repository";

import { Trash2, MoreHorizontal } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import type { TProducts } from "@/types/product.types";

interface IProductTableProps {
  products: TProducts[];
  setProducts: Dispatch<SetStateAction<TProducts[] | undefined>>;
  searchTerm: string;
}

export const ProductTable = ({
  products,
  setProducts,
  searchTerm,
}: IProductTableProps) => {
  const filteredProducts = products.filter(
    product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categories
        .map(element => element.toLowerCase())
        .includes(searchTerm.toLowerCase()),
  );
  const handleDeleteProduct = async (productId: string) => {
    await deleteProduct(productId);
    setProducts(products.filter(product => product.id !== productId));
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredProducts.map(product => (
          <TableRow key={product.id}>
            <TableCell>
              <SanityImage
                image={product.image[0]}
                alt={product.name}
                className="rounded-md object-cover"
                dimension={{ width: 50, height: 50 }}
              />
            </TableCell>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell>{product.categories.toString()}</TableCell>
            <TableCell>${product.price.toFixed(2)}</TableCell>
            <TableCell>{product.quantity}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
