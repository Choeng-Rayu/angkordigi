"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { SectionLabel } from "../components/ui/SectionLabel";
import { fadeInUp, staggerContainer } from "../lib/animations";
import { siteConfig } from "@/app/data/siteData";

const { timeline } = siteConfig;

function TimelineNode({
  year,
  isActive,
  index,
}: {
  year: string;
  isActive: boolean;
  index: number;
}) {
  const nodeRef = useRef(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={nodeRef}
      className="relative flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.15,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {/* Pulsing circle node */}
      <div className="relative">
        {/* Outer glow ring for active node */}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(79, 124, 255, 0.3) 0%, transparent 70%)`,
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
        )}
        {/* Main node circle */}
        <motion.div
          className={`relative z-10 w-4 h-4 rounded-full ${
            isActive
              ? "bg-accent"
              : "bg-surface border-2 border-text-muted"
          }`}
          animate={
            isActive
              ? {
                  scale: [1, 1.2, 1],
                  boxShadow: [
                    "0 0 10px rgba(79, 124, 255, 0.4)",
                    "0 0 20px rgba(79, 124, 255, 0.6), 0 0 30px rgba(79, 124, 255, 0.3)",
                    "0 0 10px rgba(79, 124, 255, 0.4)",
                  ],
                }
              : {}
          }
          transition={{
            duration: 1.5,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      </div>
      {/* Year label */}
      <span
        className={`mt-4 font-mono text-sm ${
          isActive ? "text-accent" : "text-text-muted"
        }`}
      >
        {year}
      </span>
    </motion.div>
  );
}

function MilestoneCard({
  milestone,
  description,
  index,
}: {
  milestone: string;
  description: string;
  index: number;
}) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={cardRef}
      className="relative bg-surface border border-border rounded-xl p-5 mt-8 hover:border-accent/50 transition-colors duration-300 group"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.15 + 0.2,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={{ y: -4 }}
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div
          className="absolute inset-0 rounded-xl"
          style={{
            background: `radial-gradient(ellipse at top, rgba(79, 124, 255, 0.1) 0%, transparent 60%)`,
          }}
        />
      </div>
      <h4 className="text-text-primary font-medium mb-2 relative z-10">
        {milestone}
      </h4>
      <p className="text-text-muted text-sm leading-relaxed relative z-10">
        {description}
      </p>
    </motion.div>
  );
}

export function Timeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const gradientX = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="timeline"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="mb-16 md:mb-24"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <SectionLabel number="" label={timeline.sectionLabel} />
          <motion.h2
            variants={fadeInUp}
            className="mt-6 text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary"
          >
            {timeline.title}
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mt-4 text-text-muted text-lg max-w-2xl"
          >
            {timeline.subtitle}
          </motion.p>
        </motion.div>

        {/* Desktop Timeline - Horizontal */}
        <div className="hidden md:block">
          <div className="relative">
            {/* Gradient connecting line */}
            <div className="absolute top-2 left-0 right-0 h-0.5">
              {/* Background line */}
              <div className="absolute inset-0 bg-border" />
              {/* Animated gradient fill */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(90deg, #4F7CFF 0%, #00FFC2 50%, #4F7CFF 100%)`,
                  backgroundSize: "200% 100%",
                  x: gradientX,
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 3,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
              />
            </div>

            {/* Timeline nodes and cards */}
            <div className="relative flex justify-between items-start">
        {timeline.milestones.map((item, index) => (
          <div key={item.year} className="flex-1 flex flex-col items-center">
            <TimelineNode
              year={item.year}
              isActive={index === 0}
              index={index}
            />
            <MilestoneCard
              milestone={item.title}
              description={item.description}
              index={index}
            />
          </div>
        ))}
            </div>
          </div>
        </div>

        {/* Mobile Timeline - Vertical */}
        <div className="md:hidden">
          <div className="relative">
            {/* Vertical gradient line */}
            <div className="absolute left-2 top-0 bottom-0 w-0.5">
              {/* Background line */}
              <div className="absolute inset-0 bg-border" />
              {/* Animated gradient fill */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(180deg, #4F7CFF 0%, #00FFC2 50%, #4F7CFF 100%)`,
                  backgroundSize: "100% 200%",
                }}
                animate={{
                  backgroundPosition: ["0% 0%", "0% 100%", "0% 0%"],
                }}
                transition={{
                  duration: 5,
                  ease: "linear",
                  repeat: Infinity,
                }}
              />
            </div>

            {/* Timeline items */}
            <div className="space-y-8">
        {timeline.milestones.map((item, index) => (
          <div key={item.year} className="relative pl-10">
            {/* Node on the line */}
            <motion.div
              className="absolute left-0 top-1"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
              }}
            >
              <div
                className={`w-4 h-4 rounded-full ${
                  index === 0
                    ? "bg-accent animate-glow-pulse"
                    : "bg-surface border-2 border-text-muted"
                }`}
              />
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.1 + 0.1,
              }}
            >
              <span
                className={`font-mono text-sm ${
                  index === 0 ? "text-accent" : "text-text-muted"
                }`}
              >
                {item.year}
              </span>
              <h4 className="text-text-primary font-medium mt-1">
                {item.title}
              </h4>
              <p className="text-text-muted text-sm mt-1">
                {item.description}
              </p>
            </motion.div>
          </div>
        ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
