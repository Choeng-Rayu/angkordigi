"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Linkedin } from "lucide-react";
import { SectionLabel } from "../components/ui/SectionLabel";
import { Card } from "../components/ui/Card";
import { fadeInUp, staggerContainer } from "../lib/animations";
import { siteConfig } from "@/app/data/siteData";

const { team } = siteConfig;

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getGradientColors(index: number): string {
  const gradients = [
    "from-accent to-neon",
    "from-neon to-accent",
    "from-accent to-purple-500",
    "from-neon to-teal-400",
    "from-blue-500 to-accent",
    "from-teal-400 to-neon",
  ];
  return gradients[index % gradients.length];
}

function TeamMemberCard({
  member,
  index,
}: {
  member: (typeof team.members)[0];
  index: number;
}) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });
  const initials = getInitials(member.name);
  const gradientClass = getGradientColors(index);

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
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          variant="default"
          className="group relative overflow-hidden text-center"
        >
          {/* Avatar with rotating gradient border */}
          <div className="relative mx-auto mb-5 w-[120px] h-[120px]">
            {/* Rotating gradient border */}
            <motion.div
              className="absolute -inset-0.5 rounded-full"
              style={{
                background: "linear-gradient(90deg, #4F7CFF, #00FFC2, #4F7CFF)",
                backgroundSize: "200% 100%",
              }}
              whileHover={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 2,
                ease: "linear",
                repeat: Infinity,
              }}
            />

            {/* Avatar container */}
            <div className="absolute inset-0.5 rounded-full bg-surface overflow-hidden">
              <motion.div
                className={`w-full h-full bg-gradient-to-br ${gradientClass} flex items-center justify-center`}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-3xl font-bold text-white">
                  {initials}
                </span>
              </motion.div>
            </div>
          </div>

          {/* Name */}
          <h3 className="text-xl font-semibold text-text-primary mb-1 group-hover:text-accent transition-colors duration-300">
            {member.name}
          </h3>

          {/* Role */}
          <p className="font-mono text-sm text-neon mb-4">{member.role}</p>

          {/* LinkedIn icon */}
          <motion.a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-surface border border-border text-text-muted hover:text-accent hover:border-accent/50 transition-all duration-300 opacity-0 group-hover:opacity-100"
            initial={false}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Linkedin className="w-4 h-4" />
          </motion.a>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export function Team() {
  return (
    <section
      id="team"
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/20 to-background pointer-events-none" />
      <div
        className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(79, 124, 255, 0.3) 0%, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full opacity-10 pointer-events-none"
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
            <SectionLabel number="" label={team.sectionLabel} />
          </div>
          <motion.h2
            variants={fadeInUp}
            className="mt-6 text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary"
          >
            {team.title}
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mt-4 text-text-muted text-lg max-w-2xl mx-auto"
          >
            {team.subtitle}
          </motion.p>
        </motion.div>

      {/* Team Grid - 3 columns desktop, 2 tablet, 1 mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {team.members.map((member, index) => (
          <TeamMemberCard key={member.name} member={member} index={index} />
        ))}
      </div>
      </div>
    </section>
  );
}
