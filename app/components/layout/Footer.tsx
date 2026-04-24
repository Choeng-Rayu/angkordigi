"use client";

import { motion } from "framer-motion";
import { Linkedin, Github, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/app/data/siteData";

const { footer, company } = siteConfig;

const socialIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Linkedin,
  Github,
};

function AnimatedLogo() {
  return (
    <a href="#hero" className="flex items-center gap-2 group">
      <div className="relative w-8 h-8">
        <motion.div
          className="absolute inset-0 grid grid-cols-2 gap-0.5"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="bg-accent rounded-sm"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 + 0.2, duration: 0.3 }}
              viewport={{ once: true }}
            />
          ))}
        </motion.div>
      </div>
      <span className="font-mono text-lg font-bold text-text-primary tracking-tight">
        TOMNERB
      </span>
    </a>
  );
}

export function Footer() {
  return (
    <footer className="relative bg-surface border-t border-border">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Column 1: Logo + Tagline */}
          <div className="space-y-6">
          <AnimatedLogo />
          <p className="text-text-muted text-sm leading-relaxed max-w-xs">
            {footer.tagline}
          </p>
          <div className="flex items-center gap-2 text-text-muted text-xs">
            <MapPin className="w-4 h-4 text-accent" />
            <span>{company.location}</span>
          </div>
          <div className="flex items-center gap-3 pt-2">
            {footer.social.map((social) => {
              const IconComponent = socialIconMap[social.icon];
              return (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    "bg-background border border-border",
                    "text-text-muted hover:text-accent hover:border-accent/50",
                    "transition-colors duration-300"
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.label}
                >
                  {IconComponent && <IconComponent className="w-4 h-4" />}
                </motion.a>
              );
            })}
          </div>
          </div>

        {/* Column 2: Quick Links */}
        <div className="space-y-6">
          <h3 className="text-text-primary font-semibold text-sm uppercase tracking-wider">
            Quick Links
          </h3>
          <nav className="flex flex-col gap-3">
            {footer.quickLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors duration-200"
              >
                <span>{link.label}</span>
                <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200" />
              </a>
            ))}
          </nav>
        </div>

        {/* Column 3: Contact Info */}
        <div className="space-y-6">
          <h3 className="text-text-primary font-semibold text-sm uppercase tracking-wider">
            Contact Us
          </h3>
          <div className="space-y-4">
            <a
              href={`mailto:${company.email}`}
              className="flex items-center gap-3 text-text-muted hover:text-accent transition-colors duration-200 group"
            >
              <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center group-hover:border-accent/30 transition-colors">
                <Mail className="w-4 h-4" />
              </div>
              <span className="text-sm">{company.email}</span>
            </a>
            <a
              href={`tel:${company.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-3 text-text-muted hover:text-accent transition-colors duration-200 group"
            >
              <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center group-hover:border-accent/30 transition-colors">
                <Phone className="w-4 h-4" />
              </div>
              <span className="text-sm">{company.phone}</span>
            </a>
          </div>
        </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-text-muted text-sm text-center md:text-left">
              {footer.copyright}
            </p>
            <p className="text-text-muted text-xs flex items-center gap-1">
              {footer.madeIn.replace("love", "")}
              <motion.span
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
                className="text-red-500"
              >
                &hearts;
              </motion.span>
              in Cambodia 🇰🇭
            </p>
            <div className="flex items-center gap-6 text-xs text-text-muted">
              {footer.legal.map((item, index) => (
                <span key={item.label} className="flex items-center gap-6">
                  <a
                    href={item.href}
                    className="hover:text-text-primary transition-colors duration-200"
                  >
                    {item.label}
                  </a>
                  {index < footer.legal.length - 1 && (
                    <span className="text-border">|</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
