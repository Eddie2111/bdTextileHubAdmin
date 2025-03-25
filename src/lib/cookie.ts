"use server";
import { cookies } from "next/headers";

interface ICookieProps {
    name: string; 
    value: string; 
    options?: {
        path: string;
        maxAge: number;
        httpOnly?: boolean;
    }
}

export async function getCookie(name: string) {
  const cookieStore = cookies();
  const cookie = cookieStore.get(name);

  if (!cookie) {
    return null;
  }

  return cookie.value;
}

export async function setCookie({name, value, options}: ICookieProps) {
    try {
        const cookieStore = cookies();
        cookieStore.set(name, value, options);
        return true;
    } catch(err) {
        console.error(err);
        return false;
    }

}

export async function deleteCookie(name: string) {
    const cookieStore = cookies();
    cookieStore.delete(name);
    return true;
}
