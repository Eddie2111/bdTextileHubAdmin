"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

import { Eye, EyeOff } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ className, type = "password",icon , ...props }, ref) => {
    // State to manage whether the password is visible or hidden
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

    // Toggle function to switch between "password" and "text"
    const togglePasswordVisibility = () => {
      setIsPasswordVisible((prev) => !prev);
    };

    return (
      <div className="relative flex w-full">
        {/* Icon (if provided) */}
        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
            {icon}
          </div>
        )}

        {/* Input field */}
        <input
          type={isPasswordVisible ? "text" : "password"}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            icon && "pl-10", // Add padding if an icon is present
            className,
          )}
          ref={ref}
          {...props}
        />

        {/* Toggle button */}
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center px-3 text-sm font-medium text-muted-foreground hover:text-foreground"
          onClick={togglePasswordVisibility}
        >
          {isPasswordVisible ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
        </button>
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };