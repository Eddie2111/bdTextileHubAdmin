import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import jwt from "jsonwebtoken";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateUniqueFilename() {
  const timestamp = new Date().toISOString().replace(/[:.-]/g, "_");
  const randomString = Math.random().toString(36).substring(2, 8);
  return `${timestamp}_${randomString}.webp`;
}

export function createJWTToken(data: unknown): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!data) {
      reject(new Error("No data provided"));
    }
    jwt.sign(
      {
        data: data,
      },
      process.env.AUTH_SECRET as string,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) reject(err);
        resolve(token as string);
      },
    );
  });
}
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "N/A"

  const d = typeof date === "string" ? new Date(date) : date

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d)
}