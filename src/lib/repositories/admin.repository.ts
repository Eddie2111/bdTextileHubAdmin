"use server";
import { prisma } from "@/lib/prisma";
import argon2 from "argon2";
import { createJWTToken } from "../utils";

export interface IThrowError {
  message: string;
  status: number;
  data?: { 
    id: string;
    name: string;
    email: string;
    token: string;
  }
}
const throwError = (message: string): IThrowError=>{
  return {
    message: message ?? "unknown error occured",
    status: 400, 
  }
}

export async function upsertAdmin(data: {
  id?: string;
  name: string;
  email: string;
  password: string;
}) {
  try {
    if (!data.email) {
      return throwError("Email is required.");
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
    return throwError("Error upserting Admin");
  }
}

export async function getAdminById(id: string) {
  try {
    if (!id) {
      return throwError("Admin ID is required.");
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
      return throwError("Admin not found.");
    }
    return Admin;
  } catch (err) {
    const error = err as { code: string };
    console.error("Error fetching Admin by ID:", error);
    return throwError("Error fetching Admin by ID");
  }
}

export async function getAdminByEmail(email: string) {
  try {
    if (!email) {
      return throwError("Email is required.");
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
      return throwError("Admin not found.");
    }
    return Admin;
  } catch (err) {
    const error = err as { code: string };
    console.error("Error fetching Admin by email:", error);
    return throwError("Error fetching Admin by email");
  }
}

export async function deleteAdmin(id: string) {
  try {
    if (!id) {
      return throwError("Admin ID is required.");
    }
    await prisma.admin.delete({ where: { id } });
  } catch (err) {
    const error = err as { code: string };
    if (error.code === "P2025") {
      console.error("Admin not found.");
      return throwError("Admin not found.");
    }
    console.error("Error deleting Admin:", error);
    return throwError("Error deleting Admin");
  }
}


export interface IAuthenticateUser extends IThrowError {
  data: {
    message?:string;
    id: string;
    name: string;
    email: string;
    token: string;
  }
}

export async function authenticateAdmin(email: string, password: string) {
  try {
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }
    const Admin = await prisma.admin.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    })
    if (!Admin) {
      return { message:"Invalid email or password because user does not exist", status: 202}
    }
    const passwordMatch = await argon2.verify(Admin.password, password);
    if (!passwordMatch) {
      return { message:"Failed logging in, password don't match", status: 202}
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
      return { message:"Failed logging in, token not created", status: 202}
    }
  } catch (err) {
    const error = err as { code: string };
    console.error("Error authenticating Admin:", error);
    return { message:"Error authenticating Admin", status: 202}
  }
}
