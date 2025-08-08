import React from "react";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  type = "text", 
  error, 
  required,
  className,
  children,
  ...props 
}) => {
  const renderInput = () => {
    if (children) return children;
    
    if (type === "textarea") {
      return <Textarea {...props} />;
    }
    
    if (type === "select") {
      return <Select {...props} />;
    }
    
    return <Input type={type} {...props} />;
  };

  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <Label>
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      {renderInput()}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormField;