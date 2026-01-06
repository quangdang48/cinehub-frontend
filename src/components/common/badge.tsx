import type React from "react";
import classNames from "classnames";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "warning" | "success";
  size?: "sm" | "md";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "sm",
  className,
}) => {
  const variants = {
    default: "bg-neutral-800/80 text-neutral-300",
    primary: "bg-blue-600 text-white",
    warning: "bg-yellow-500 text-black",
    success: "bg-green-600 text-white",
  };

  const sizes = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
  };

  return (
    <span
      className={classNames(
        "inline-flex items-center rounded font-medium",
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </span>
  );
};
