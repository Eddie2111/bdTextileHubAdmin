"use server";
import { prisma } from "@/lib/prisma";

export async function upsertUser(data: {
  id?: string;
  name?: string;
  email: string;
  image?: string;
}) {
  try {
    if (!data.email) {
      throw new Error("Email is required.");
    }
    return await prisma.user.upsert({
      where: { email: data.email },
      update: {
        name: data.name,
        image: data.image,
      },
      create: {
        id: data.id,
        name: data.name,
        email: data.email,
        image: data.image,
      },
    });
  } catch (err) {
    const error = err as { code: string };
    console.error("Error upserting user:", error);
    throw error;
  }
}

export async function getUserById(id: string) {
  try {
    if (!id) {
      throw new Error("User ID is required.");
    }
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });
    if (!user) {
      throw new Error("User not found.");
    }
    return user;
  } catch (err) {
    const error = err as { code: string };
    console.error("Error fetching user by ID:", error);
    return null;
  }
}

export async function getUserByEmail(email: string) {
  try {
    if (!email) {
      throw new Error("Email is required.");
    }
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });
    if (!user) {
      throw new Error("User not found.");
    }
    return user;
  } catch (err) {
    const error = err as { code: string };
    console.error("Error fetching user by email:", error);
    return null;
  }
}

export async function deleteUser(id: string) {
  try {
    if (!id) {
      throw new Error("User ID is required.");
    }
    await prisma.user.delete({ where: { id } });
  } catch (err) {
    const error = err as { code: string };
    if (error.code === "P2025") {
      console.error("User not found.");
      return null;
    }
    console.error("Error deleting user:", error);
    return null;
  }
}

import { Prisma } from "@prisma/client";

export async function getUsersWithProfile({
  skip = 0,
  take = 10,
  filter = {},
}: {
  skip?: number;
  take?: number;
  filter?: Partial<{
    firstName: string;
    lastName: string;
    email: string;
  }>;
}) {
  try {
    // Construct the WHERE clause for filtering user profiles
    const where: Prisma.UserProfileWhereInput = {
      firstName: filter.firstName ? { contains: filter.firstName } : undefined,
      lastName: filter.lastName ? { contains: filter.lastName } : undefined,
      user: filter.email
        ? {
            email: { contains: filter.email },
          }
        : undefined,
    };

    // Fetch user profiles with their associated orders
    const [userProfiles, total] = await Promise.all([
      prisma.userProfile.findMany({
        where,
        skip,
        take,
        select: {
          id: true,
          role: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          address: true,
          image: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              email: true,
            },
          },
          orders: {
            select: {
              products: true, // Array of product IDs
              shippingCharge: true, // Shipping charge for the order
            },
          },
        },
      }),
      prisma.userProfile.count({ where }),
    ]);

    // Process each user profile to calculate additional metrics
    const enrichedUserProfiles = await Promise.all(
      userProfiles.map(async (profile) => {
        // Flatten all product arrays from orders into a single array
        const allProducts = profile.orders.flatMap((order) => order.products);

        // Calculate the total number of products purchased
        const totalProductsPurchased = allProducts.length;

        // Calculate the total amount spent by the user
        const totalAmountSpent = profile.orders.reduce(
          (sum, order) =>
            sum +
            order.products.length * 10 + // Assuming $10 per product (replace with actual price logic)
            order.shippingCharge,
          0
        );

        // Calculate the average number of expenses per order
        const totalOrders = profile.orders.length;
        const averageExpenses =
          totalOrders > 0 ? totalProductsPurchased / totalOrders : 0;

        // Return the enriched user profile object
        return {
          ...profile,
          totalProductsPurchased,
          averageExpenses,
          totalAmountSpent,
        };
      })
    );

    return { users: enrichedUserProfiles, total };
  } catch (err) {
    console.error("Error fetching user profiles:", err);
    throw err;
  }
}
