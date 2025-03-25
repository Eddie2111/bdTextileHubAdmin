"use server";
import { prisma } from "@/lib/prisma";
import argon2 from "argon2";
import { createJWTToken } from "../utils";

export async function upsertAdmin(data: {
  id?: string;
  name: string;
  email: string;
  password: string;
}) {
  try {
    if (!data.email) {
      throw new Error("Email is required.");
    }
    return await prisma.admin.upsert({
      where: { email: data.email },
      update: {
        email: data.email,
        password: data.password,
      },
      create: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });
  } catch (err) {
    const error = err as { code: string };
    console.error("Error upserting Admin:", error);
    throw error;
  }
}

export async function getAdminById(id: string) {
  try {
    if (!id) {
      throw new Error("Admin ID is required.");
    }
    const Admin = await prisma.admin.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });
    if (!Admin) {
      throw new Error("Admin not found.");
    }
    return Admin;
  } catch (err) {
    const error = err as { code: string };
    console.error("Error fetching Admin by ID:", error);
    return null;
  }
}

export async function getAdminByEmail(email: string) {
  try {
    if (!email) {
      throw new Error("Email is required.");
    }
    const Admin = await prisma.admin.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });
    if (!Admin) {
      throw new Error("Admin not found.");
    }
    return Admin;
  } catch (err) {
    const error = err as { code: string };
    console.error("Error fetching Admin by email:", error);
    return null;
  }
}

export async function deleteAdmin(id: string) {
  try {
    if (!id) {
      throw new Error("Admin ID is required.");
    }
    await prisma.admin.delete({ where: { id } });
  } catch (err) {
    const error = err as { code: string };
    if (error.code === "P2025") {
      console.error("Admin not found.");
      return null;
    }
    console.error("Error deleting Admin:", error);
    return null;
  }
}

export async function authenticateAdmin(email: string, password: string) {
  try {
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }
    const Admin = await getAdminByEmail(email);
    if (!Admin) {
      throw new Error("Invalid email or password. Failed on input check");
    }
    const passwordMatch = await argon2.verify(Admin.password, password);
    if (!passwordMatch) {
      return {
        message: "Failed logging in, password don't match",
        status: 400,
      }
    }
    const token = await createJWTToken({ id: Admin.id, name: Admin.name, email: Admin.email });
    if (token) {
      return {
        message: "Logged in successfully",
        status: 200,
        data: {
          id: Admin.id,
          name: Admin.name,
          email: Admin.email,
          token,
        },
      }
    } else {
      return {
        message: "Failed logging in, token not created",
        status: 400,
      }
    }
  } catch (err) {
    const error = err as { code: string };
    console.error("Error authenticating Admin:", error);
    return null;
  }
}

