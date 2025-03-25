"use client";

import axios from 'axios';
import { useForm } from "react-hook-form";

import { loginFormSchemaResolver } from "./login.helpers";
import type { TLoginFormType } from "./login.helpers";
import type { IAuthenticateUser }  from "@/lib/repositories/admin.repository";

import { toast } from "sonner";
import { setCookie } from "@/lib/cookie";

interface ICombinedInterface{
  message: string;
  status: number;
  data:  IAuthenticateUser
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

    const response = await axios.post<TLoginFormType,ICombinedInterface>("/login/api", {email,password}, {withCredentials: true});

    console.log(response.data);
    if (!response) toast.warning("Something went wrong, please try again later");
    else if (response.status === 200 && response.data) {
      toast.success("Login Successful");
      await setCookie({
        name: "auth_token",
        value: response?.data?.data?.token as string,
        options: {
          path: "/",
          maxAge: 60 * 60 * 24 * 1, // one day
        },
      });
      window.location.href = '/dashboard';
    } else if(response.status === 202 && response?.data?.message){
      toast.warning(response?.data?.message);
    }
  }
  return {
    form,
    onSubmit,
  };
};
