"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "../../../lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

const variantStyles = {
  primary: cn(
    "bg-accent text-white",
    "rounded-full px-6 py-3",
    "font-medium tracking-wide",
    "hover:shadow-[0_0_30px_rgba(79,124,255,0.4)]",
    "active:scale-[0.98]",
    "transition-all duration-300"
  ),
  secondary: cn(
    "border border-accent text-accent",
    "rounded-full px-6 py-3",
    "font-medium tracking-wide",
    "hover:bg-accent/10",
    "hover:shadow-[0_0_20px_rgba(79,124,255,0.2)]",
    "active:scale-[0.98]",
    "transition-all duration-300"
  ),
  ghost: cn(
    "bg-transparent text-text-muted",
    "rounded-full px-6 py-3",
    "font-medium tracking-wide",
    "hover:text-text-primary",
    "hover:bg-surface",
    "active:scale-[0.98]",
    "transition-all duration-300"
  ),
};

const sizeStyles = {
  sm: "text-sm px-4 py-2",
  md: "text-base px-6 py-3",
  lg: "text-lg px-8 py-4",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={cn(
        "inline-flex items-center justify-center gap-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </motion.button>
  );
}
