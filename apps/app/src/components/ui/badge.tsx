import { cn } from "@/lib/utils";
import React from "react";

type BadgeVariant = "default" | "secondary" | "outline" | "brand";

const Badge: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  variant?: BadgeVariant;
}> = ({ 
  children,
  className,
  variant = "default"
}) => {
  const variantStyles = {
    default: "border-border bg-background shadow-sm",
    secondary: "border-secondary bg-secondary/10 text-secondary-foreground",
    outline: "border-border bg-transparent hover:bg-accent hover:text-accent-foreground",
    brand: "border-brand bg-brand/10 text-brand font-semibold shadow-sm",
  };

  return (
    <div
      className={cn(
        "w-fit px-3 py-1 text-sm md:text-base rounded-full border",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </div>
  );
};

export default Badge;
