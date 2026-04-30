"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { SectionLabel } from "../components/ui/SectionLabel";
import { fadeInUp, staggerContainer } from "../lib/animations";
import { GlowBorder } from "../components/effects/GlowBorder";

export function SolarSystem() {
  return (
    <section
      id="solar-system"
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/30 to-background pointer-events-none" />
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-10 pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(79, 124, 255, 0.3) 0%, transparent 70%)`,
          filter: "blur(80px)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="flex justify-center">
            <SectionLabel number="" label="INTERACTIVE EXPERIENCE" />
          </div>
          <motion.h2
            variants={fadeInUp}
            className="mt-6 text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary"
          >
            Explore the Solar System
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mt-4 text-text-muted text-lg max-w-2xl mx-auto"
          >
            Journey through space and discover the planets, moons, and celestial
            bodies that make up our cosmic neighborhood.
          </motion.p>
        </motion.div>

        {/* Solar System Scope Embed */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <GlowBorder glowIntensity="medium" className="w-full">
            <div className="relative bg-surface/50 rounded-lg overflow-hidden">
              {/* Header Bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-surface/80 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-text-primary font-medium text-sm">
                    Solar System Scope
                  </span>
                </div>
                <a
                  href="https://www.solarsystemscope.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-text-muted hover:text-neon transition-colors duration-300 text-sm"
                >
                  Open in New Tab
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Iframe Container */}
              <div className="relative w-full">
                <iframe
                  src="https://www.solarsystemscope.com/iframe"
                  title="Solar System Scope - Interactive 3D Model"
                  width="100%"
                  height="500"
                  frameBorder="0"
                  allow="fullscreen"
                  loading="lazy"
                  className="block bg-black"
                  style={{
                    border: "none",
                  }}
                />
              </div>

              {/* Footer Caption */}
              <div className="px-4 py-3 bg-surface/80 border-t border-border/50">
                <p className="text-text-muted text-xs text-center">
                  Powered by{" "}
                  <a
                    href="https://www.solarsystemscope.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neon hover:text-accent transition-colors duration-300 underline underline-offset-2"
                  >
                    Solar System Scope
                  </a>{" "}
                  — An interactive 3D model of the Solar System
                </p>
              </div>
            </div>
          </GlowBorder>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-2 h-2 bg-neon rounded-full opacity-60 animate-pulse" />
        <div className="absolute bottom-32 left-10 w-3 h-3 border border-accent rounded-full opacity-40" />
        <div className="absolute top-1/2 right-5 w-1 h-12 bg-gradient-to-b from-neon to-transparent rounded-full opacity-30" />
      </div>
    </section>
  );
}
