"use client";

import axios from "axios";
import { useForm } from "react-hook-form";

import { loginFormSchemaResolver } from "./login.helpers";

import { toast } from "sonner";
import { setCookie } from "@/lib/cookie";

import type { TLoginFormType } from "./login.helpers";
import type { IAuthenticateUser } from "@/lib/repositories/admin.repository";
import { DASHBOARD_ROUTE } from "@/components/common/routes";

interface ICombinedInterface {
  message: string;
  status: number;
  data: IAuthenticateUser;
}

export const useLoginForm = () => {
  const form = useForm<TLoginFormType>({
    resolver: loginFormSchemaResolver,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: TLoginFormType) {
    const { email, password } = values;
    const response = await axios.post<TLoginFormType, ICombinedInterface>(
      "/login/api",
      { email: email.toLocaleLowerCase(), password },
      { withCredentials: true },
    );

    if (!response)
      toast.warning("Something went wrong, please try again later");
    else if (response.status === 200 && response.data) {
      toast.success("Login Successful");
      // set httponly cookie
      await setCookie({
        name: "auth_token",
        value: response?.data?.data?.token as string,
        options: {
          httpOnly: true,
          path: "/",
          maxAge: 60 * 60 * 24 * 1, // one day
        },
      });
      // hard refresh to dashboard to load the state from the localstorage
      window.location.href = DASHBOARD_ROUTE;
    } else if (response.status === 202 && response?.data?.message) {
      toast.warning(response?.data?.message);
    }
  }
  return {
    form,
    onSubmit,
  };
};
