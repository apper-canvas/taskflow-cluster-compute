import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn("input-field", className)}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;