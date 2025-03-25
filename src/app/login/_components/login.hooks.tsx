"use client";

import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";
import { loginFormSchemaResolver } from "./login.helpers";

import type { TLoginFormType } from "./login.helpers";
import { authenticateAdmin } from "@/lib/repositories/admin.repository";
import { toast } from "sonner";
import { setCookie } from "@/lib/cookie";

export const useLoginForm = () => {
  const router = useRouter();

  const form = useForm<TLoginFormType>({
    resolver: loginFormSchemaResolver,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: TLoginFormType) {
    const { email, password } = values;

    const response = await authenticateAdmin(email, password);
    if (!response)
      toast.warning("Something went wrong, please try again later");
    else if (response.status === 200 && response.data) {
      toast.success("Login Successful");
      await setCookie({
        name: "auth_token",
        value: response?.data?.token as string,
        options: {
          path: "/",
          maxAge: 60 * 60 * 24 * 1, // one day
        },
      });
      router.push("/dashboard");
    } else {
      toast.warning("Failed to login, reacheck email or password?");
    }
  }
  return {
    form,
    onSubmit,
  };
};
