import React from "react";
import { cn } from "@/utils/cn";

const Textarea = React.forwardRef(({ className, generating, ...props }, ref) => {
  return (
    <div className="relative">
      <textarea
        ref={ref}
        className={cn(
          "input-field resize-none min-h-[80px]",
          generating && "opacity-50",
          className
        )}
        {...props}
      />
      {generating && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="m12 2v4l2.2 2.2L12 12V2z"></path>
          </svg>
        </div>
      )}
    </div>
  );
});

Textarea.displayName = "Textarea";

export default Textarea;