import React from "react";
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
        "flex flex-col items-center justify-center space-y-4 my-12 md:my-16 tracking-tight text-center",
        className
      )}
    >
      {badge && (
        <div className="inline-flex items-center gap-2">
          <span className="w-8 h-[2px] bg-brand" />
          <span className="text-brand font-semibold text-sm uppercase tracking-wider">
            {badge}
          </span>
          <span className="w-8 h-[2px] bg-brand" />
        </div>
      )}
      {title && (
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-white">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="text-center max-w-2xl text-gray-400 md:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default Header;
