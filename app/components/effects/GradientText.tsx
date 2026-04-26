"use client";

import { ReactNode } from "react";

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
}

export function GradientText({
  children,
  className = "",
  animate = true,
}: GradientTextProps) {
  return (
    <span
      className={`bg-gradient-to-r from-[var(--color-text-primary)] via-[var(--color-accent)] to-[var(--color-neon)] bg-clip-text text-transparent ${
        animate ? "animate-gradient-shift" : ""
      } ${className}`}
      style={{
        backgroundSize: "200% auto",
      }}
    >
      {children}
      {animate && (
        <style jsx>{`
          @keyframes gradient-shift {
            0% {
              background-position: 0% center;
            }
            50% {
              background-position: 100% center;
            }
            100% {
              background-position: 0% center;
            }
          }
          .animate-gradient-shift {
            animation: gradient-shift 4s ease infinite;
          }
        `}</style>
      )}
    </span>
  );
}
