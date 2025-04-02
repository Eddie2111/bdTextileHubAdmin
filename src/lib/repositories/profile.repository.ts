"use server";
import { prisma } from "@/lib/prisma"; // to use as client connection instance
import type { Prisma, UserProfile } from "@prisma/client"; // 

export async function getOneUserWithProfile({
    id
}: {
    id: string;
}) {
    try {
        const where: Prisma.UserProfileWhereUniqueInput = {
            id: id ? id : undefined,
        };

        // Fetch user profile with associated wishlists, orders, and carts
        const [oneUserProfile] = await Promise.all([
            prisma.userProfile.findUnique({
                where,
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
                            emailVerified: true,
                        },
                    },
                    wishlists: {
                        select: {
                            id: true,
                            productId: true, // Array of product IDs
                        },
                    },
                    orders: {
                        select: {
                            products: true, // Array of product IDs
                            shippingCharge: true,
                        },
                    },
                    carts: {
                        select: {
                            id: true,
                            productId: true, // Array of product IDs
                        },
                    },
                },
            }),
        ]);

        if (!oneUserProfile) {
            throw new Error("User profile not found");
        }

        // Extract product IDs from wishlists, orders, and carts
        const wishlistProductIds = oneUserProfile.wishlists.flatMap(wishlist => wishlist.productId);
        const orderProductIds = oneUserProfile.orders.flatMap(order => order.products);
        const cartProductIds = oneUserProfile.carts.flatMap(cart => cart.productId);

        // Combine all unique product IDs
        const allProductIds = Array.from(new Set([...wishlistProductIds, ...orderProductIds, ...cartProductIds]));

        // Fetch product details for all product IDs
        const products = await prisma.product.findMany({
            where: {
                id: {
                    in: allProductIds, // Fetch products whose IDs are in the combined list
                },
            },
            select: {
                id: true,
                name: true,
                price: true,
                image: true,
                status: true,
            },
        });

        // Create a map of product ID to product details for quick lookup
        const productMap = new Map(products.map(product => [product.id, product]));

        // Merge product details into wishlists, orders, and carts
        const enrichedWishlists = oneUserProfile.wishlists.map(wishlist => ({
            ...wishlist,
            products: wishlist.productId.map(productId => productMap.get(productId)).filter(Boolean),
        }));

        const enrichedOrders = oneUserProfile.orders.map(order => ({
            ...order,
            products: order.products.map(productId => productMap.get(productId)).filter(Boolean),
        }));

        const enrichedCarts = oneUserProfile.carts.map(cart => ({
            ...cart,
            products: cart.productId.map(productId => productMap.get(productId)).filter(Boolean),
        }));

        // Return the enriched user profile with product details
        return {
            oneUserProfile: {
                ...oneUserProfile,
                wishlists: enrichedWishlists,
                orders: enrichedOrders,
                carts: enrichedCarts,
            },
        };
    } catch (err) {
        console.error("Error fetching user profiles:", err);
        throw err;
    }
}

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
})
{
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
