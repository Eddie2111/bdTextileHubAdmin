import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const createProductFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  categories: z.array(z.string()).min(1, "Category is required"),
  price: z.string().min(1, "Price is required"),
  quantity: z.string().min(1, "Stock is required"),
  description: z.string().optional(),
  attributes: z.string().optional(),
  color: z.array(z.string()).min(1, "Select at least one color"),
})

type TCreateProductFormResolverType = z.infer<typeof createProductFormSchema>;
const createProductFormResolver = zodResolver(createProductFormSchema);

export { 
    createProductFormSchema, 
    createProductFormResolver
};
export type {
    TCreateProductFormResolverType,
}
