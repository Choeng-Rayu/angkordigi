"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClickable, setIsClickable] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth spring animation for cursor following
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  // Secondary cursor (outer ring) with more delay
  const outerSpringConfig = { damping: 30, stiffness: 200, mass: 0.8 };
  const outerX = useSpring(cursorX, outerSpringConfig);
  const outerY = useSpring(cursorY, outerSpringConfig);

  useEffect(() => {
    // Check if device has fine pointer (mouse)
    const checkDevice = () => {
      const hasPointer = window.matchMedia("(pointer: fine)").matches;
      setIsMobile(!hasPointer);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

  // Track hoverable elements
  const handleElementHover = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const isInteractive = !!(
      target.tagName === "BUTTON" ||
      target.tagName === "A" ||
      target.closest("button") ||
      target.closest("a") ||
      target.classList.contains("cursor-pointer")
    );

    const isButtonElement = !!(
      target.tagName === "BUTTON" ||
      target.closest("button") ||
      target.getAttribute("role") === "button"
    );

    setIsHovering(isInteractive);
    setIsClickable(isInteractive && isButtonElement);
  };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousemove", handleElementHover);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousemove", handleElementHover);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY, isMobile]);

  // Hide on mobile/tablet
  if (isMobile) return null;

  return (
    <>
      {/* Outer ring cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: outerX,
          y: outerY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovering ? 60 : 40,
          height: isHovering ? 60 : 40,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        <div
          className={`w-full h-full rounded-full border-2 transition-colors duration-200 ${
            isHovering ? "border-[var(--color-neon)]" : "border-[var(--color-accent)]"
          }`}
        />
      </motion.div>

      {/* Inner dot cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovering ? (isClickable ? 80 : 20) : 8,
          height: isHovering ? (isClickable ? 32 : 20) : 8,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.15 }}
      >
        <div
          className={`w-full h-full flex items-center justify-center rounded-full transition-colors duration-200 ${
            isClickable
              ? "bg-[var(--color-neon)] text-[var(--color-bg)] font-medium text-xs"
              : isHovering
                ? "bg-[var(--color-accent)]"
                : "bg-[var(--color-text-primary)]"
          }`}
        >
          {isClickable && "Click"}
        </div>
      </motion.div>

      {/* Hide default cursor */}
      <style jsx global>{`
        * {
          cursor: none !important;
        }
        @media (pointer: coarse) {
          * {
            cursor: auto !important;
          }
        }
      `}</style>
    </>
  );
}
