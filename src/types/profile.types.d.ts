import { UserStatus } from "@prisma/client";

export interface IUserProfile {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  address: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    email: string;
  };
  orders: {
    products: string[];
    shippingCharge: number;
  }[];
  status?: UserStatus | null;
}
