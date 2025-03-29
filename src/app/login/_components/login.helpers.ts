import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});
export const loginFormSchemaResolver = zodResolver(loginFormSchema);
export type TLoginFormType = z.infer<typeof loginFormSchema>;
