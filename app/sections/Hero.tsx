"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import { ParticleCanvas } from "../components/ui/ParticleCanvas";
import { Button } from "../components/ui/Button";
import { StatCounter } from "../components/ui/StatCounter";
import { cn } from "../../lib/utils";
import { siteConfig } from "@/app/data/siteData";

const { hero: { tagline, subtitle, ctas, stats } } = siteConfig;

function AnimatedHeadline({ text }: { text: string }) {
  const words = text.split(" ");

  return (
    <motion.h1
      className={cn(
        "text-[clamp(2rem,8vw,6rem)] font-bold leading-[1.05] tracking-[-0.03em]",
        "bg-gradient-to-br from-accent via-accent to-neon",
        "bg-clip-text text-transparent"
      )}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.05, delayChildren: 0.15 },
        },
      }}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block mr-[0.25em]">
          {word.split("").map((char, charIndex) => (
            <motion.span
              key={charIndex}
              className="inline-block"
              variants={{
                hidden: { opacity: 0, y: 40, rotateX: -90 },
                visible: {
                  opacity: 1,
                  y: 0,
                  rotateX: 0,
                  transition: {
                    type: "spring",
                    damping: 20,
                    stiffness: 100,
                  },
                },
              }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.h1>
  );
}

export function Hero() {
  const statsRef = useRef<HTMLDivElement>(null);
  const isStatsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    if (isStatsInView) {
      const timer = setTimeout(() => setShowStats(true), 400);
      return () => clearTimeout(timer);
    }
  }, [isStatsInView]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Particle Background */}
      <div className="absolute inset-0 z-0">
        <ParticleCanvas
          particleCount={60}
          connectionDistance={150}
          particleColor="rgba(79, 124, 255, 0.6)"
          lineColor="rgba(255, 255, 255, 0.08)"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-background/20 via-transparent to-background pointer-events-none" />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20"
      >
        <div className="flex flex-col items-center text-center">
          {/* Hero Headline */}
          <AnimatedHeadline text={tagline} />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-6 text-lg md:text-xl text-text-muted max-w-2xl leading-relaxed"
          >
            Cambodia&apos;s startup tech team helping SMEs go digital — affordably.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4"
          >
            <Button variant="primary" size="lg" className="group">
              Get Started
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="ghost" size="lg" className="group">
              View Our Work
              <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-1" />
            </Button>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 40 }}
          animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-24 md:mt-32"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={cn(
                  "relative flex flex-col items-center py-6",
                  index < stats.length - 1 &&
                    "md:after:content-[''] md:after:absolute md:after:right-0 md:after:top-1/2 md:after:-translate-y-1/2 md:after:w-px md:after:h-16 md:after:bg-border"
                )}
              >
                {showStats && (
                  <StatCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    label={stat.label}
                    duration={2000}
                    valueClassName="text-accent"
                    labelClassName="text-text-muted"
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-[1] pointer-events-none" />
    </section>
  );
}
