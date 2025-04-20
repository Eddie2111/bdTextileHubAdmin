"use server";
import { Prisma, ProductStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { deleteImage } from "./sanity.repository";

// Create a new product
export async function createProduct(data: {
  name: string;
  description: string;
  price: number;
  image: string[];
  quantity: number;
  attributes?: string;
  color: string[];
  categories: string[];
}) {
  try {
    const create = await prisma.product.create({
      data: {
        ...data,
        name: data.name.toLocaleLowerCase(),
        status: ProductStatus.AVAILABLE,
        attributes: data.attributes
          ? JSON.stringify(data.attributes)
          : undefined,
      },
    });
    return create ? true : false;
  } catch (err) {
    console.error("Error creating product:", err);
    return false;
  }
}

// Get a single product by ID
export async function getProductById(id: string) {
  try {
    if (!id) {
      throw new Error("Product ID is required.");
    }
    return await prisma.product.findUnique({
      where: { id },
    });
  } catch (err) {
    console.error("Error fetching product by ID:", err);
    throw err;
  }
}

// Get all products with pagination
export async function getProducts({
  skip = 0,
  take = 10,
  filter = {},
}: {
  skip?: number;
  take?: number;
  filter?: Partial<{
    name: string;
    status: ProductStatus;
    category: string;
  }>;
}) {
  try {
    const where: Prisma.ProductWhereInput = {
      name: filter.name ? { contains: filter.name } : undefined,
      status: filter.status ? filter.status : undefined,
      categories: filter.category ? { has: filter.category } : undefined,
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total };
  } catch (err) {
    console.error("Error fetching products:", err);
    throw err;
  }
}

// Update a product
export async function updateProduct(
  id: string,
  data: Partial<Omit<typeof createProduct, "id">>,
) {
  try {
    if (!id) {
      throw new Error("Product ID is required.");
    }
    return await prisma.product.update({
      where: { id },
      data: data,
      /*
      {
        ...data,
        attributes: data.attributes ? JSON.stringify(data.attributes) : undefined,
      },
      */
    });
  } catch (err) {
    console.error("Error updating product:", err);
    throw err;
  }
}

// Delete a product
export async function deleteProduct(id: string) {
  try {
    // Validate input
    if (!id || typeof id !== "string" || id.trim() === "") {
      return { message: "Product ID is required and must be a non-empty string.", status: false };
    }

    // Start a Prisma transaction
    const response = await prisma.$transaction(async (prismaTx) => {
      // Step 1: Fetch product details
      const productDetails = await prismaTx.product.findFirstOrThrow({
        where: { id },
      });

      // Step 2: Check if the product has stock
      // if (productDetails.quantity > 0) {
      //   throw new Error("Product cannot be deleted because it has stock.");
      // }

      // Step 3: Delete associated images
      const imageDeletionResults = await Promise.allSettled(
        productDetails.image.map((image) => deleteImage(image))
      );

      // Log failed image deletions
      imageDeletionResults.forEach((result, index) => {
        if (result.status === "rejected") {
          console.error(`Failed to delete image ${index}:`, result.reason);
        }
      });

      // Step 4: Delete the product
      await prismaTx.product.delete({
        where: { id },
      });

      // Return success response
      return { message: "Product deleted successfully", status: true };
    });

    // Return the transaction result
    return response;
  } catch (err) {
    console.error("Error deleting product:", err);
    const errorResponse = err as unknown as { message: string };
    return { message: `Error deleting product: ${errorResponse.message}`, status: false };
  }
}
