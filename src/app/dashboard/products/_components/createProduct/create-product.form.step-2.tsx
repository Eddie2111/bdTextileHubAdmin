"use client";

import dynamic from "next/dynamic";
import { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

import "react-quill/dist/quill.snow.css";

import type { TCreateProductFormResolverType } from "./create-product.helper";
import { Check } from "lucide-react";
import { colors } from "./create-product.constant";

interface IProductFormStep2Props {
  form: UseFormReturn<TCreateProductFormResolverType>;
}

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export const CreateProduct_Step_2 = ({ form }: IProductFormStep2Props) => {
  return (
    <>
      <FormField
        control={form.control}
        name="attributes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Attributes</FormLabel>
            <FormControl>
              <div className="min-h-[150px]">
                {typeof window !== "undefined" && (
                  <ReactQuill
                    className="mb-12"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="color"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Available Colors</FormLabel>
            <FormControl>
              <div className="grid grid-cols-4 gap-3 pt-2">
                {colors.map(color => (
                  <div
                    key={color.value}
                    className={cn(
                      "relative flex h-10 w-full cursor-pointer items-center justify-center rounded-md transition-all",
                      color.class,
                      field.value.includes(color.value)
                        ? "ring-2 ring-offset-2 ring-primary"
                        : "hover:opacity-90",
                    )}
                    onClick={() => {
                      const updatedColors = field.value.includes(color.value)
                        ? field.value.filter(c => c !== color.value)
                        : [...field.value, color.value];
                      field.onChange(updatedColors);
                    }}
                  >
                    {field.value.includes(color.value) && (
                      <Check
                        className={cn(
                          "h-4 w-4 absolute",
                          color.value === "white" ? "text-black" : "text-white",
                        )}
                      />
                    )}
                    <span
                      className={cn(
                        "text-xs font-medium",
                        color.value === "white" ? "text-black" : "text-white",
                      )}
                    >
                      {color.name}
                    </span>
                  </div>
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
