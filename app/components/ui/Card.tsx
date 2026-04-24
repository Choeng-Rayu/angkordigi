"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "../../../lib/utils";

interface CardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  variant?: "default" | "glass" | "bordered";
  size?: "sm" | "md" | "lg";
  glow?: boolean;
  children: React.ReactNode;
}

const variantStyles = {
  default: cn(
    "bg-surface",
    "border border-border",
    "rounded-xl",
    "p-6"
  ),
  glass: cn(
    "glass",
    "rounded-xl",
    "p-6"
  ),
  bordered: cn(
    "bg-transparent",
    "border border-border",
    "rounded-xl",
    "p-6"
  ),
};

const sizeStyles = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  variant = "default",
  size = "md",
  glow = false,
  children,
  className,
  ...props
}: CardProps) {
  return (
    <motion.div
      whileHover={
        glow
          ? {
              borderColor: "rgba(79, 124, 255, 0.5)",
              boxShadow: "0 0 30px rgba(79, 124, 255, 0.15)",
            }
          : {
              borderColor: "rgba(79, 124, 255, 0.3)",
            }
      }
      transition={{ duration: 0.3 }}
      className={cn(
        variantStyles[variant],
        sizeStyles[size],
        "transition-colors duration-300",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardHeader({ children, className, ...props }: CardHeaderProps) {
  return (
    <div className={cn("mb-4", className)} {...props}>
      {children}
    </div>
  );
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export function CardTitle({ children, className, ...props }: CardTitleProps) {
  return (
    <h3 className={cn("text-lg font-semibold text-text-primary", className)} {...props}>
      {children}
    </h3>
  );
}

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export function CardDescription({ children, className, ...props }: CardDescriptionProps) {
  return (
    <p className={cn("text-sm text-text-muted mt-1", className)} {...props}>
      {children}
    </p>
  );
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardContent({ children, className, ...props }: CardContentProps) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardFooter({ children, className, ...props }: CardFooterProps) {
  return (
    <div className={cn("mt-4 pt-4 border-t border-border", className)} {...props}>
      {children}
    </div>
  );
}
