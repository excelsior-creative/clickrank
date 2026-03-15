import React from "react";
import Badge from "./ui/badge";
import { cn } from "@/lib/utils";

const Header = ({
  className,
  title,
  subtitle,
  badge,
}: {
  className?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center space-y-4 my-12 md:my-20 tracking-tight text-center",
        className
      )}
    >
      {badge && <Badge variant="brand">{badge}</Badge>}
      {title && (
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="text-center max-w-2xl text-muted-foreground md:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default Header;
