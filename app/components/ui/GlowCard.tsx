"use client";

import { useRef, useState, useCallback } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "../../../lib/utils";

interface GlowCardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  glowIntensity?: number;
}

export function GlowCard({
  children,
  className,
  glowColor = "rgba(79, 124, 255, 0.15)",
  glowIntensity = 0.5,
  ...props
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setMousePosition({ x, y });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setMousePosition({ x: 0.5, y: 0.5 });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative overflow-hidden",
        "bg-surface",
        "border border-border",
        "rounded-2xl",
        "p-6",
        "transition-colors duration-300",
        className
      )}
      style={{
        background: isHovering
          ? `radial-gradient(600px circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, ${glowColor}, transparent 40%), var(--color-surface)`
          : undefined,
      }}
      {...props}
    >
      {/* Animated border gradient on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{
          opacity: isHovering ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        style={{
          background: `linear-gradient(135deg, rgba(79, 124, 255, ${glowIntensity * 0.3}) 0%, rgba(0, 255, 194, ${glowIntensity * 0.2}) 100%)`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

interface GlowCardGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: 2 | 3 | 4;
}

export function GlowCardGrid({
  children,
  className,
  columns = 3,
}: GlowCardGridProps) {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-6", gridCols[columns], className)}>
      {children}
    </div>
  );
}
