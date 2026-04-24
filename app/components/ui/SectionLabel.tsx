"use client";

import { motion } from "framer-motion";
import { cn } from "../../../lib/utils";
import { fadeInUp } from "../../lib/animations";

interface SectionLabelProps {
  number: string;
  label: string;
  className?: string;
  animated?: boolean;
}

export function SectionLabel({
  number,
  label,
  className,
  animated = true,
}: SectionLabelProps) {
  const content = (
    <span
      className={cn(
        "inline-flex items-center gap-3",
        "font-mono text-xs uppercase tracking-[0.2em]",
        "text-neon",
        className
      )}
    >
      <span className="text-accent">{number}</span>
      <span className="text-text-muted">—</span>
      <span>{label}</span>
    </span>
  );

  if (animated) {
    return (
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}
