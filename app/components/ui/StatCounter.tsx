"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "../../../lib/utils";

interface StatCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label?: string;
  duration?: number;
  className?: string;
  valueClassName?: string;
  labelClassName?: string;
}

export function StatCounter({
  value,
  suffix = "",
  prefix = "",
  label,
  duration = 2000,
  className,
  valueClassName,
  labelClassName,
}: StatCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now();
    const startValue = 0;
    const endValue = value;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOut);

      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn("text-center", className)}
    >
      <span
        className={cn(
          "font-mono text-4xl md:text-5xl lg:text-6xl font-bold",
          "text-text-primary",
          valueClassName
        )}
      >
        {prefix}
        {count}
        {suffix}
      </span>
      {label && (
        <p className={cn("text-sm text-text-muted mt-2 uppercase tracking-wide", labelClassName)}>
          {label}
        </p>
      )}
    </motion.div>
  );
}

interface StatGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function StatGroup({ children, className }: StatGroupProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12",
        className
      )}
    >
      {children}
    </div>
  );
}
