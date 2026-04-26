"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Code,
  TrendingUp,
  Building2,
  Zap,
  ArrowRight,
} from "lucide-react";
import { SectionLabel } from "../components/ui/SectionLabel";
import { GlowCard } from "../components/ui/GlowCard";
import { Button } from "../components/ui/Button";
import { fadeInUp, staggerContainer } from "../lib/animations";
import { siteConfig } from "@/app/data/siteData";
import { MagneticButton } from "../components/effects/MagneticButton";

const { services } = siteConfig;

const iconMap: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  Code,
  TrendingUp,
  Building: Building2,
  Zap,
};

const gradientMap: Record<string, string> = {
  Code: "from-accent/20 to-transparent",
  TrendingUp: "from-neon/20 to-transparent",
  Building: "from-accent/20 to-transparent",
  Zap: "from-neon/20 to-transparent",
};

function ServiceCard({
  service,
  index,
}: {
  service: (typeof services.services)[0];
  index: number;
}) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });
  const Icon = iconMap[service.icon];

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      <GlowCard
        className="h-full group"
        glowColor="rgba(79, 124, 255, 0.12)"
        glowIntensity={0.6}
      >
          <div className="flex flex-col h-full">
            {/* Icon with animation */}
            <div className="relative w-12 h-12 mb-5">
              <motion.div
                className="relative w-full h-full"
                whileHover={{ scale: 1.1, rotate: 3 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${gradientMap[service.icon]} rounded-xl opacity-50 group-hover:opacity-100 transition-opacity duration-300`}
                />
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  <Icon
                    className="w-6 h-6 text-accent transition-all duration-300 group-hover:text-neon"
                    strokeWidth={1.5}
                  />
                </div>
                {/* Glow effect behind icon */}
                <div className="absolute inset-0 bg-accent/20 blur-xl rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
              {/* Animated ring on hover */}
              <motion.div
                className="absolute inset-0 rounded-xl border border-accent/30 pointer-events-none"
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            </div>

          {/* Title */}
          <h3 className="text-text-primary text-xl font-semibold mb-3 group-hover:text-accent transition-colors duration-300">
            {service.title}
          </h3>

          {/* Description */}
          <p className="text-text-muted text-sm leading-relaxed flex-grow mb-5">
            {service.description}
          </p>

            {/* Learn More Button */}
            <MagneticButton strength={0.15} className="self-start">
              <Button
                variant="ghost"
                size="sm"
                className="group/btn text-text-muted hover:text-accent"
              >
                Learn More
                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Button>
            </MagneticButton>
        </div>
      </GlowCard>
    </motion.div>
  );
}

export function Services() {
  return (
    <section
      id="services"
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/30 to-background pointer-events-none" />
      <div
        className="absolute top-1/2 left-1/4 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(79, 124, 255, 0.3) 0%, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(0, 255, 194, 0.2) 0%, transparent 70%)`,
          filter: "blur(50px)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 md:mb-20"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="flex justify-center">
            <SectionLabel number="" label={services.sectionLabel} />
          </div>
          <motion.h2
            variants={fadeInUp}
            className="mt-6 text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary"
          >
            {services.title}
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mt-4 text-text-muted text-lg max-w-2xl mx-auto"
          >
            {services.subtitle}
          </motion.p>
        </motion.div>

      {/* Services Grid - 2x2 on desktop, 1 column on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {services.services.map((service, index) => (
          <ServiceCard key={service.title} service={service} index={index} />
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        className="mt-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <p className="text-text-muted mb-6">
          Need a custom solution? Let&apos;s discuss your requirements.
        </p>
        <MagneticButton strength={0.2}>
          <Button variant="secondary" size="lg">
            Get in Touch
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </MagneticButton>
      </motion.div>
      </div>
    </section>
  );
}
