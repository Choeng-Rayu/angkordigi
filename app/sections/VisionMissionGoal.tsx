"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Telescope, Rocket, Target } from "lucide-react";
import { SectionLabel } from "../components/ui/SectionLabel";
import { fadeInUp, staggerContainer } from "../lib/animations";
import { cn } from "../../lib/utils";
import { siteConfig } from "@/app/data/siteData";

const { visionMissionGoal } = siteConfig;

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Telescope,
  Rocket,
  Target,
};

interface VisionCardProps {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  delay: number;
}

function VisionCard({ number, title, description, icon, delay }: VisionCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isHovering, setIsHovering] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setMousePosition({ x, y });
    setTilt({
      x: (y - 0.5) * -10,
      y: (x - 0.5) * 10,
    });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setMousePosition({ x: 0.5, y: 0.5 });
    setTilt({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: delay * 0.15 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 0.15s ease-out",
      }}
      className={cn(
        "relative overflow-hidden",
        "bg-surface",
        "border rounded-2xl",
        "p-8",
        "transition-all duration-300",
        "group",
        isHovering ? "border-neon" : "border-border",
        "hover:-translate-y-1"
      )}
    >
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: isHovering ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: isHovering
            ? `radial-gradient(500px circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(0, 255, 194, 0.08), transparent 40%)`
            : undefined,
        }}
      />

      {/* Border glow animation */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{
          opacity: isHovering ? [0.3, 0.6, 0.3] : 0,
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: isHovering ? Infinity : 0,
        }}
        style={{
          background: "linear-gradient(135deg, rgba(0, 255, 194, 0.2) 0%, rgba(79, 124, 255, 0.2) 100%)",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon and Number */}
        <div className="flex items-start justify-between mb-6">
          <div className="p-3 bg-surface border border-border rounded-xl group-hover:border-neon/30 transition-colors duration-300">
            <div className="w-6 h-6 text-neon">{icon}</div>
          </div>
          <span className="font-mono text-sm text-neon">{number}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>

        {/* Description */}
        <p className="text-text-muted leading-relaxed text-sm">{description}</p>

        {/* Animated line at bottom */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-neon to-accent"
          initial={{ width: "0%" }}
          whileHover={{ width: "100%" }}
          animate={{ width: isHovering ? "100%" : "0%" }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </div>
    </motion.div>
  );
}



export function VisionMissionGoal() {
  return (
    <section id="vision-mission-goal" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <SectionLabel number="" label={visionMissionGoal.sectionLabel} className="justify-center" />
          <motion.h2
            variants={fadeInUp}
            className="mt-6 text-3xl md:text-4xl lg:text-5xl font-bold text-white"
          >
            What Drives Us Forward
          </motion.h2>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          style={{ perspective: "1000px" }}
        >
        {visionMissionGoal.cards.map((card, index) => {
          const IconComponent = iconMap[card.icon];
          return (
            <VisionCard
              key={card.title}
              number={card.number}
              title={card.title}
              description={card.content.join(" ")}
              icon={IconComponent ? <IconComponent className="w-full h-full" /> : null}
              delay={index}
            />
          );
        })}
        </motion.div>
      </div>
    </section>
  );
}
