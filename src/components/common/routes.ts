import {
  BarChart3,
  Images,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";

export const routes = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    title: "Dashboard",
  },
  {
    href: "/dashboard/users",
    icon: Users,
    title: "Users",
  },
  {
    href: "/dashboard/products",
    icon: Package,
    title: "Products",
  },
  {
    href: "/dashboard/orders",
    icon: ShoppingCart,
    title: "Orders",
  },
  {
    href: "/dashboard/images",
    icon: Images,
    title: "Stored Images",
  },
  {
    href: "/dashboard/analytics",
    icon: BarChart3,
    title: "Analytics",
  },
];
