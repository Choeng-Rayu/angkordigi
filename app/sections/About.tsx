"use client";

import { motion } from "framer-motion";
import { SectionLabel } from "../components/ui/SectionLabel";
import { slideInLeft, slideInRight } from "../lib/animations";
import { siteConfig } from "@/app/data/siteData";

const { about } = siteConfig;

export function About() {
  return (
    <section
      id="about"
      className="relative py-24 md:py-32 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-8"
          >
          <SectionLabel number="" label={about.sectionLabel} />

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">
            {about.headline}
          </h2>

          <p className="text-text-muted text-lg leading-[1.65] max-w-xl">
            {about.description}
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-full text-sm text-text-muted">
            <span className="w-2 h-2 bg-neon rounded-full animate-pulse" />
            {about.badge.label} {about.badge.value}
          </div>
          </motion.div>

          {/* Right Column - Cambodia Map */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="relative flex items-center justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Glow effect behind map */}
              <div className="absolute inset-0 blur-3xl opacity-20">
                <div className="w-full h-full bg-gradient-to-br from-accent via-neon to-accent" />
              </div>

              {/* Map Container */}
              <div className="relative bg-surface/50 border border-border rounded-2xl p-8 md:p-12">
                {/* Cambodia Map SVG */}
                <svg
                  viewBox="0 0 200 280"
                  className="w-64 h-80 md:w-80 md:h-96"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Cambodia Map Outline - Simplified */}
                  <path
                    d="M80 20 L120 25 L140 40 L150 60 L145 80 L160 100 L155 120 L165 140 L160 160 L150 180 L140 200 L130 220 L120 240 L110 250 L100 255 L90 250 L80 240 L70 220 L60 200 L55 180 L50 160 L45 140 L40 120 L45 100 L50 80 L60 60 L70 40 L80 20 Z"
                    fill="rgba(79, 124, 255, 0.1)"
                    stroke="#4F7CFF"
                    strokeWidth="1.5"
                    className="drop-shadow-[0_0_10px_rgba(79,124,255,0.3)]"
                  />

                  {/* Inner detail lines for depth */}
                  <path
                    d="M70 60 L90 70 L110 65 M130 80 L140 100 L135 120 M120 140 L130 160 L125 180 M100 200 L110 220 L105 240"
                    stroke="#4F7CFF"
                    strokeWidth="0.5"
                    strokeOpacity="0.4"
                    fill="none"
                  />

                  {/* Grid pattern overlay */}
                  <defs>
                    <pattern
                      id="grid"
                      width="20"
                      height="20"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 20 0 L 0 0 0 20"
                        fill="none"
                        stroke="#4F7CFF"
                        strokeWidth="0.3"
                        strokeOpacity="0.15"
                      />
                    </pattern>
                  </defs>
                  <path
                    d="M80 20 L120 25 L140 40 L150 60 L145 80 L160 100 L155 120 L165 140 L160 160 L150 180 L140 200 L130 220 L120 240 L110 250 L100 255 L90 250 L80 240 L70 220 L60 200 L55 180 L50 160 L45 140 L40 120 L45 100 L50 80 L60 60 L70 40 L80 20 Z"
                    fill="url(#grid)"
                  />

                  {/* Phnom Penh Pin Location */}
                  <g className="animate-pulse">
                    {/* Pin drop shadow */}
                    <circle
                      cx="110"
                      cy="130"
                      r="4"
                      fill="rgba(0, 255, 194, 0.3)"
                      className="blur-sm"
                    />
                    {/* Pin glow */}
                    <circle
                      cx="110"
                      cy="125"
                      r="12"
                      fill="rgba(0, 255, 194, 0.2)"
                      className="animate-ping"
                      style={{ animationDuration: "2s" }}
                    />
                    {/* Pin head */}
                    <circle
                      cx="110"
                      cy="125"
                      r="6"
                      fill="#00FFC2"
                      className="drop-shadow-[0_0_8px_rgba(0,255,194,0.8)]"
                    />
                    {/* Pin point */}
                    <path
                      d="M110 131 L107 138 L110 136 L113 138 Z"
                      fill="#00FFC2"
                    />
                  </g>

                  {/* Location label */}
            <text
              x="125"
              y="130"
              fill="#00FFC2"
              fontSize="8"
              fontFamily="var(--font-geist-mono), monospace"
              fontWeight="500"
            >
              {about.map.pinLocation}
            </text>
                </svg>

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-accent rounded-full opacity-60" />
                <div className="absolute bottom-4 left-4 w-3 h-3 border border-neon rounded-full opacity-40" />
                <div className="absolute top-1/2 left-2 w-1 h-8 bg-gradient-to-b from-accent to-transparent rounded-full opacity-30" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
