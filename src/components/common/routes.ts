import { BarChart3, Heart, Images, LayoutDashboard, Package, ShoppingBag, ShoppingCart, Users, } from "lucide-react";

export const LOGIN_ROUTE = "/login";
export const DASHBOARD_ROUTE = "/dashboard";
export const USERS_ROUTE = "/dashboard/users";
export const PRODUCTS_ROUTE = "/dashboard/products";
export const ORDERS_ROUTE = "/dashboard/orders";
export const STORED_IMAGES_ROUTE = "/dashboard/images";
export const ANALYTICS_ROUTE = "/dashboard/analytics";
export const WISHLISTS_ROUTE = "/dashboard/wishlists";
export const CARTS_ROUTE = "/dashboard/carts";

export const routes = [
  {
    href: DASHBOARD_ROUTE,
    icon: LayoutDashboard,
    title: "Dashboard",
  },
  {
    href: USERS_ROUTE,
    icon: Users,
    title: "Users",
  },
  {
    href: PRODUCTS_ROUTE,
    icon: Package,
    title: "Products",
  },
  {
    href: ORDERS_ROUTE,
    icon: ShoppingCart,
    title: "Orders",
  },
  {
    href: STORED_IMAGES_ROUTE,
    icon: Images,
    title: "Stored Images",
  },
  {
    href: ANALYTICS_ROUTE,
    icon: BarChart3,
    title: "Analytics",
  },
  {
    href: WISHLISTS_ROUTE,
    icon: Heart,
    title: "Wishlists",
  },
  {
    href: CARTS_ROUTE,
    icon: ShoppingBag,
    title: "Carts",
  },
];
