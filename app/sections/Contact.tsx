"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, Phone, CheckCircle, ArrowRight } from "lucide-react";
import { SectionLabel } from "../components/ui/SectionLabel";
import { Button } from "../components/ui/Button";
import { fadeInUp, staggerContainer } from "../lib/animations";
import { siteConfig } from "@/app/data/siteData";

const { contact } = siteConfig;

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Mail,
  Phone,
};

interface FormData {
  name: string;
  email: string;
  company: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  company?: string;
  message?: string;
}

export function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.company.trim()) {
      newErrors.company = "Company name is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Mock submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Form submitted:", formData);

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after showing success
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", company: "", message: "" });
    }, 3000);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-surface/50 via-background to-surface/30 pointer-events-none" />
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-10 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse, rgba(79, 124, 255, 0.2) 0%, transparent 70%)`,
          filter: "blur(80px)",
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
            <SectionLabel number="" label={contact.sectionLabel} />
          </div>

          {/* Headline */}
          <motion.h2
            variants={fadeInUp}
            className="mt-6 text-3xl md:text-4xl lg:text-5xl font-bold"
          >
            <span className="bg-gradient-to-r from-text-primary via-accent to-neon bg-clip-text text-transparent">
              {contact.headline}
            </span>
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="mt-4 text-text-muted text-lg max-w-2xl mx-auto"
          >
            {contact.subtitle}
          </motion.p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Contact Info - Left Side */}
          <motion.div
            className="lg:col-span-2 space-y-8"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-6">
              Get in Touch
            </h3>
            <p className="text-text-muted leading-relaxed mb-8">
              Ready to transform your business? We&apos;re here to help you
              navigate the digital landscape and build solutions that drive
              growth.
            </p>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            {contact.info.map((item) => {
              const IconComponent = iconMap[item.icon];
              return (
                <motion.a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-4 p-4 rounded-xl bg-surface border border-border hover:border-accent/50 transition-all duration-300 group"
                  whileHover={{ x: 4 }}
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    {IconComponent && <IconComponent className="w-5 h-5 text-accent" />}
                  </div>
                  <div>
                    <p className="text-xs font-mono text-text-muted uppercase tracking-wide">
                      {item.label}
                    </p>
                    <p className="text-text-primary group-hover:text-accent transition-colors">
                      {item.value}
                    </p>
                  </div>
                </motion.a>
              );
            })}
          </div>
          </motion.div>

          {/* Contact Form - Right Side */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {isSubmitted ? (
              <motion.div
                className="h-full flex flex-col items-center justify-center p-8 rounded-xl bg-surface border border-neon/30 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                >
                  <CheckCircle className="w-16 h-16 text-neon mb-4" />
                </motion.div>
              <h3 className="text-2xl font-bold text-text-primary mb-2">
                {contact.form.submitButton.successLabel}
              </h3>
              <p className="text-text-muted">
                {contact.form.successMessage}
              </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="p-8 rounded-xl bg-surface border border-border"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-text-primary"
                >
                  {contact.form.fields[0].label}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={contact.form.fields[0].placeholder}
                      className={`w-full px-4 py-3 rounded-lg bg-background border text-text-primary placeholder:text-text-muted focus:outline-none transition-all duration-300 focus:scale-[1.02] ${
                        errors.name
                          ? "border-red-500 focus:border-red-500"
                          : "border-border focus:border-accent focus:shadow-[0_0_0_3px_rgba(79,124,255,0.2)]"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500">{errors.name}</p>
                    )}
                  </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-text-primary"
                >
                  {contact.form.fields[1].label}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={contact.form.fields[1].placeholder}
                      className={`w-full px-4 py-3 rounded-lg bg-background border text-text-primary placeholder:text-text-muted focus:outline-none transition-all duration-300 focus:scale-[1.02] ${
                        errors.email
                          ? "border-red-500 focus:border-red-500"
                          : "border-border focus:border-accent focus:shadow-[0_0_0_3px_rgba(79,124,255,0.2)]"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500">{errors.email}</p>
                    )}
                  </div>
                </div>

            {/* Company Field */}
            <div className="space-y-2 mb-6">
              <label
                htmlFor="company"
                className="text-sm font-medium text-text-primary"
              >
                {contact.form.fields[2].label}
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder={contact.form.fields[2].placeholder}
                    className={`w-full px-4 py-3 rounded-lg bg-background border text-text-primary placeholder:text-text-muted focus:outline-none transition-all duration-300 focus:scale-[1.02] ${
                      errors.company
                        ? "border-red-500 focus:border-red-500"
                        : "border-border focus:border-accent focus:shadow-[0_0_0_3px_rgba(79,124,255,0.2)]"
                    }`}
                  />
                  {errors.company && (
                    <p className="text-xs text-red-500">{errors.company}</p>
                  )}
                </div>

            {/* Message Field */}
            <div className="space-y-2 mb-6">
              <label
                htmlFor="message"
                className="text-sm font-medium text-text-primary"
              >
                {contact.form.fields[3].label}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={contact.form.fields[3].placeholder}
                    rows={5}
                    className={`w-full px-4 py-3 rounded-lg bg-background border text-text-primary placeholder:text-text-muted focus:outline-none transition-all duration-300 resize-none focus:scale-[1.01] ${
                      errors.message
                        ? "border-red-500 focus:border-red-500"
                        : "border-border focus:border-accent focus:shadow-[0_0_0_3px_rgba(79,124,255,0.2)]"
                    }`}
                  />
                  {errors.message && (
                    <p className="text-xs text-red-500">{errors.message}</p>
                  )}
                </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isSubmitting}
              className="w-full sm:w-auto group"
            >
              {isSubmitting ? (
                contact.form.submitButton.loadingLabel
              ) : (
                <>
                  {contact.form.submitButton.label}
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
