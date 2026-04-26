"use client";

import { motion, useScroll, useSpring } from "framer-motion";

interface ScrollProgressProps {
  className?: string;
}

export function ScrollProgress({ className = "" }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();

  // Add spring physics for smooth animation
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 h-1 z-[100] origin-left ${className}`}
      style={{
        scaleX,
        background: "linear-gradient(90deg, var(--color-accent), var(--color-neon))",
        boxShadow: "0 0 10px var(--color-accent), 0 0 20px var(--color-neon)",
      }}
    />
  );
}
