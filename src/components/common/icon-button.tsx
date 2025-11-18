import type React from "react";
import classNames from "classnames";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "ghost" | "outline";
  showLabel?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  size = "md",
  variant = "default",
  showLabel = false,
  className,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center transition-colors rounded-lg";
  
  const variants = {
    default: "text-neutral-300 hover:text-white hover:bg-neutral-800",
    ghost: "text-neutral-300 hover:text-white",
    outline: "border border-neutral-700 text-neutral-300 hover:text-white hover:border-neutral-500",
  };

  const sizes = {
    sm: "p-2 gap-1.5",
    md: "p-3 gap-2",
    lg: "p-4 gap-2",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <button
      className={classNames(
        baseStyles,
        variants[variant],
        sizes[size],
        showLabel ? "flex-col" : "",
        className
      )}
      {...props}
    >
      <span className={iconSizes[size]}>{icon}</span>
      {showLabel && label && (
        <span className="text-xs text-neutral-400 group-hover:text-white">
          {label}
        </span>
      )}
    </button>
  );
};
