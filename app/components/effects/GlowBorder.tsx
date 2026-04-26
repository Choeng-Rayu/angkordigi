"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlowBorderProps {
  children: ReactNode;
  className?: string;
  borderWidth?: number;
  glowIntensity?: "low" | "medium" | "high";
  animate?: boolean;
}

export function GlowBorder({
  children,
  className = "",
  borderWidth = 1,
  glowIntensity = "medium",
  animate = true,
}: GlowBorderProps) {
  const intensityMap = {
    low: "opacity-30",
    medium: "opacity-60",
    high: "opacity-100",
  };

  return (
    <div className={cn("relative rounded-xl", className)}>
      {/* Animated gradient border background */}
      <div
        className={cn(
          "absolute -inset-[1px] rounded-xl",
          animate && "animate-spin-slow"
        )}
        style={{
          background: `conic-gradient(
            from 0deg,
            var(--color-accent),
            var(--color-neon),
            var(--color-accent),
            var(--color-neon),
            var(--color-accent)
          )`,
          opacity: animate ? undefined : 0.8,
        }}
      />

      {/* Glow effect */}
      <div
        className={cn(
          "absolute -inset-[2px] rounded-xl blur-md transition-opacity duration-300",
          intensityMap[glowIntensity]
        )}
        style={{
          background: `conic-gradient(
            from 0deg,
            var(--color-accent),
            var(--color-neon),
            var(--color-accent),
            var(--color-neon),
            var(--color-accent)
          )`,
        }}
      />

      {/* Inner content with background */}
      <div
        className="relative rounded-xl bg-[var(--color-surface)]"
        style={{ margin: `${borderWidth}px` }}
      >
        {children}
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
      `}</style>
    </div>
  );
}
