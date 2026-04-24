"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

// Dragon text content
const dragonContent = `TomNerb Digital Solutions represents the intersection of technology and creativity. As a Cambodian startup, we bring world-class digital solutions to local businesses. Our team combines expertise in software development, automation, and digital transformation. We believe every business deserves access to modern technology. The ethereal dragon you see represents our approach - powerful, elegant, and transformative. Just as the dragon navigates through space, we navigate through digital challenges. We specialize in custom software development, creating tailor-made systems designed for your exact workflow. No two businesses are the same, and neither are our solutions. Digital transformation for SMEs is our passion. We help transform manual operations into modern digital systems, improving efficiency and scalability. Our business management systems provide integrated platforms for managing your entire operation. From inventory to HR, we connect everything. Automation tools streamline repetitive tasks with intelligent solutions. Let technology handle the routine while you focus on growth. Founded in 2026, we're building Cambodia's digital future. Our timeline shows our ambitious roadmap from startup to regional leader. The team behind TomNerb brings diverse expertise - from technical architecture to marketing strategy. Together, we turn challenges into solutions. Contact us to begin your digital transformation journey. Let's build something extraordinary together.`;

// Physics constants
const SEGMENT_COUNT = 40;
const SEGMENT_LENGTH = 12;
const DRAGON_COLOR = "#ff4500";
const DRAGON_GLOW = "rgba(255, 69, 0, 0.6)";
const PARTICLE_COUNT = 30;
const MOUSE_INFLUENCE_RADIUS = 150;
const FORCE_STRENGTH = 0.5;
const FRICTION = 0.92;
const ELASTICITY = 0.15;
const FONT_SIZE = 14;
const LINE_HEIGHT = 22;

interface Point {
  x: number;
  y: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

interface WordData {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  homeX: number;
  homeY: number;
  vx: number;
  vy: number;
  isPushed: boolean;
}

export default function DragonPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isReady, setIsReady] = useState(false);

  // Physics state refs
  const dragonSegments = useRef<Point[]>([]);
  const dragonVelocities = useRef<Point[]>([]);
  const particles = useRef<Particle[]>([]);
  const words = useRef<WordData[]>([]);
  const mousePos = useRef<Point>({ x: 0, y: 0 });
  const targetPos = useRef<Point>({ x: 0, y: 0 });
  const isTouching = useRef(false);

  // Initialize dragon segments
  const initDragon = useCallback((startX: number, startY: number) => {
    dragonSegments.current = [];
    dragonVelocities.current = [];
    for (let i = 0; i < SEGMENT_COUNT; i++) {
      dragonSegments.current.push({ x: startX - i * SEGMENT_LENGTH * 0.5, y: startY });
      dragonVelocities.current.push({ x: 0, y: 0 });
    }
  }, []);

  // Initialize particles
  const initParticles = useCallback(() => {
    particles.current = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.current.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        life: Math.random() * 100,
        maxLife: 100 + Math.random() * 100,
        size: Math.random() * 2 + 1,
      });
    }
  }, [dimensions]);

  // Parse text into words
  const initWords = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.font = `400 ${FONT_SIZE}px var(--font-geist-sans), Inter, sans-serif`;

    const words_list = dragonContent.split(/\s+/);
    const maxWidth = dimensions.width - 120;
    const startX = 60;
    const startY = 100;

    words.current = [];
    let currentX = startX;
    let currentY = startY;

    words_list.forEach((word) => {
      const metrics = ctx.measureText(word + " ");
      const wordWidth = metrics.width;

      if (currentX + wordWidth > maxWidth && currentX > startX) {
        currentX = startX;
        currentY += LINE_HEIGHT;
      }

      words.current.push({
        text: word,
        x: currentX,
        y: currentY,
        width: wordWidth,
        height: FONT_SIZE,
        homeX: currentX,
        homeY: currentY,
        vx: 0,
        vy: 0,
        isPushed: false,
      });

      currentX += wordWidth;
    });
  }, [dimensions]);

  // Update dragon physics (inverse kinematics)
  const updateDragon = useCallback(() => {
    if (dragonSegments.current.length === 0) return;

    // Head follows mouse/target with spring physics
    const head = dragonSegments.current[0];
    const headVel = dragonVelocities.current[0];

    const dx = targetPos.current.x - head.x;
    const dy = targetPos.current.y - head.y;

    headVel.x += dx * 0.02;
    headVel.y += dy * 0.02;
    headVel.x *= FRICTION;
    headVel.y *= FRICTION;

    head.x += headVel.x;
    head.y += headVel.y;

    // Body segments follow previous segment (inverse kinematics)
    for (let i = 1; i < SEGMENT_COUNT; i++) {
      const prev = dragonSegments.current[i - 1];
      const curr = dragonSegments.current[i];
      const vel = dragonVelocities.current[i];

      const dx = prev.x - curr.x;
      const dy = prev.y - curr.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 0) {
        const targetX = prev.x - (dx / dist) * SEGMENT_LENGTH;
        const targetY = prev.y - (dy / dist) * SEGMENT_LENGTH;

        vel.x += (targetX - curr.x) * ELASTICITY;
        vel.y += (targetY - curr.y) * ELASTICITY;
        vel.x *= FRICTION;
        vel.y *= FRICTION;

        curr.x += vel.x;
        curr.y += vel.y;
      }
    }
  }, []);

  // Update word physics (force field effect)
  const updateWords = useCallback(() => {
    const head = dragonSegments.current[0];
    if (!head) return;

    words.current.forEach((word) => {
      // Calculate distance to dragon head
      const wordCenterX = word.x + word.width / 2;
      const wordCenterY = word.y + word.height / 2;

      const dx = wordCenterX - head.x;
      const dy = wordCenterY - head.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < MOUSE_INFLUENCE_RADIUS) {
        // Push away from dragon
        const force = (1 - dist / MOUSE_INFLUENCE_RADIUS) * FORCE_STRENGTH;
        const angle = Math.atan2(dy, dx);

        word.vx += Math.cos(angle) * force * 2;
        word.vy += Math.sin(angle) * force * 2;
        word.isPushed = true;
      } else {
        word.isPushed = false;
      }

      // Spring back to home position
      const homeDx = word.homeX - word.x;
      const homeDy = word.homeY - word.y;

      word.vx += homeDx * 0.02;
      word.vy += homeDy * 0.02;

      // Apply friction
      word.vx *= 0.9;
      word.vy *= 0.9;

      // Update position
      word.x += word.vx;
      word.y += word.vy;
    });
  }, []);

  // Update particles
  const updateParticles = useCallback(() => {
    particles.current.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life--;

      // Reset dead particles
      if (particle.life <= 0) {
        particle.x = Math.random() * dimensions.width;
        particle.y = Math.random() * dimensions.height;
        particle.life = particle.maxLife;
        particle.vx = (Math.random() - 0.5) * 0.5;
        particle.vy = (Math.random() - 0.5) * 0.5;
      }

      // Wrap around screen
      if (particle.x < 0) particle.x = dimensions.width;
      if (particle.x > dimensions.width) particle.x = 0;
      if (particle.y < 0) particle.y = dimensions.height;
      if (particle.y > dimensions.height) particle.y = 0;
    });
  }, [dimensions]);

  // Draw dragon
  const drawDragon = useCallback((ctx: CanvasRenderingContext2D) => {
    if (dragonSegments.current.length === 0) return;

    // Draw connection lines (wireframe)
    ctx.beginPath();
    ctx.moveTo(dragonSegments.current[0].x, dragonSegments.current[0].y);

    for (let i = 1; i < dragonSegments.current.length; i++) {
      const curr = dragonSegments.current[i];
      const prev = dragonSegments.current[i - 1];

      // Smooth curve
      const cpX = (prev.x + curr.x) / 2;
      const cpY = (prev.y + curr.y) / 2;
      ctx.quadraticCurveTo(prev.x, prev.y, cpX, cpY);
    }

    ctx.strokeStyle = DRAGON_COLOR;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.shadowColor = DRAGON_GLOW;
    ctx.shadowBlur = 20;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw segments (skeletal structure)
    dragonSegments.current.forEach((segment, i) => {
      const size = i === 0 ? 8 : 6 - (i / SEGMENT_COUNT) * 4;
      const alpha = 1 - (i / SEGMENT_COUNT) * 0.7;

      ctx.beginPath();
      ctx.arc(segment.x, segment.y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 69, 0, ${alpha})`;
      ctx.shadowColor = DRAGON_GLOW;
      ctx.shadowBlur = i < 5 ? 30 - i * 4 : 0;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw wireframe ring
      ctx.beginPath();
      ctx.arc(segment.x, segment.y, size + 3, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 100, 50, ${alpha * 0.5})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Draw head details
    const head = dragonSegments.current[0];
    if (head) {
      // Head glow
      const gradient = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 30);
      gradient.addColorStop(0, "rgba(255, 69, 0, 0.8)");
      gradient.addColorStop(0.5, "rgba(255, 100, 50, 0.3)");
      gradient.addColorStop(1, "rgba(255, 69, 0, 0)");

      ctx.beginPath();
      ctx.arc(head.x, head.y, 30, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Eyes
      const second = dragonSegments.current[1];
      if (second) {
        const angle = Math.atan2(second.y - head.y, second.x - head.x);
        const eyeOffset = 4;

        const eye1X = head.x + Math.cos(angle + 0.5) * eyeOffset;
        const eye1Y = head.y + Math.sin(angle + 0.5) * eyeOffset;
        const eye2X = head.x + Math.cos(angle - 0.5) * eyeOffset;
        const eye2Y = head.y + Math.sin(angle - 0.5) * eyeOffset;

        ctx.beginPath();
        ctx.arc(eye1X, eye1Y, 2, 0, Math.PI * 2);
        ctx.arc(eye2X, eye2Y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
      }
    }
  }, []);

  // Draw words
  const drawWords = useCallback((ctx: CanvasRenderingContext2D) => {
    words.current.forEach((word) => {
      ctx.font = `${word.isPushed ? "600" : "400"} ${FONT_SIZE}px var(--font-geist-sans), Inter, sans-serif`;

      // Calculate distance to dragon for color interpolation
      const head = dragonSegments.current[0];
      let glowIntensity = 0;

      if (head) {
        const wordCenterX = word.x + word.width / 2;
        const wordCenterY = word.y + word.height / 2;
        const dx = wordCenterX - head.x;
        const dy = wordCenterY - head.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        glowIntensity = Math.max(0, 1 - dist / MOUSE_INFLUENCE_RADIUS);
      }

      // Text glow when near dragon
      if (glowIntensity > 0) {
        ctx.shadowColor = `rgba(255, 69, 0, ${glowIntensity * 0.8})`;
        ctx.shadowBlur = 15 * glowIntensity;
        ctx.fillStyle = `rgba(255, 150, 100, ${0.6 + glowIntensity * 0.4})`;
      } else {
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(200, 200, 220, 0.5)";
      }

      ctx.fillText(word.text, word.x, word.y);
    });
    ctx.shadowBlur = 0;
  }, []);

  // Draw particles
  const drawParticles = useCallback((ctx: CanvasRenderingContext2D) => {
    particles.current.forEach((particle) => {
      const alpha = particle.life / particle.maxLife;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 69, 0, ${alpha * 0.6})`;
      ctx.fill();
    });
  }, []);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // Update physics
    updateDragon();
    updateWords();
    updateParticles();

    // Draw everything
    drawParticles(ctx);
    drawWords(ctx);
    drawDragon(ctx);

    animationRef.current = requestAnimationFrame(animate);
  }, [dimensions, updateDragon, updateWords, updateParticles, drawDragon, drawWords, drawParticles]);

  // Handle mouse move
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      targetPos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  }, []);

  // Handle touch move
  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect && e.touches[0]) {
      targetPos.current = {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    isTouching.current = true;
  }, []);

  const handleTouchStart = useCallback(() => {
    isTouching.current = true;
  }, []);

  const handleTouchEnd = useCallback(() => {
    isTouching.current = false;
  }, []);

  // Handle resize
  const handleResize = useCallback(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  }, []);

  // Initialize
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsReady(true);
    }, 1000);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, [handleResize]);

  // Setup canvas after loading
  useEffect(() => {
    if (!isReady || dimensions.width === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Set canvas size
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Initialize dragon at center
    initDragon(dimensions.width / 2, dimensions.height / 2);

    // Initialize particles and words
    initParticles();
    initWords(ctx);

    // Set initial target
    targetPos.current = { x: dimensions.width / 2, y: dimensions.height / 2 };
    mousePos.current = { x: dimensions.width / 2, y: dimensions.height / 2 };

    // Add event listeners
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchend", handleTouchEnd);

    // Start animation
    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isReady, dimensions, initDragon, initParticles, initWords, animate, handleMouseMove, handleTouchMove, handleTouchStart, handleTouchEnd]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-[#0a0a0a] overflow-hidden cursor-none"
    >
      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <Loader2 className="w-8 h-8 text-[#ff4500] animate-spin" />
              <p className="text-text-muted text-sm">Summoning the dragon...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isReady ? 1 : 0, y: isReady ? 0 : -20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-40 p-4 sm:p-6"
      >
        <div className="flex items-center justify-between">
          {/* Back to Home */}
          <Link
            href="/"
            className="group flex items-center gap-2 px-4 py-2 rounded-full glass hover:bg-surface/80 transition-all duration-300"
          >
            <motion.span
              className="text-[#ff4500] group-hover:-translate-x-1 transition-transform duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
            </motion.span>
            <span className="text-sm text-text-primary">Back to Home</span>
          </Link>

          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#ff4500] rounded-full animate-pulse" />
            <span className="text-sm font-medium text-text-primary">TOMNERB</span>
          </div>
        </div>
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isReady ? 0.6 : 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
      >
        <p className="text-xs text-text-muted text-center">
          Move your cursor to guide the dragon through the words
        </p>
      </motion.div>

      {/* Main Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 touch-none"
        style={{ cursor: "none" }}
      />

      {/* Custom Cursor (follows dragon head) */}
      {isReady && (
        <motion.div
          className="fixed pointer-events-none z-30"
          style={{
            left: dragonSegments.current[0]?.x ?? 0,
            top: dragonSegments.current[0]?.y ?? 0,
          }}
        >
          <div className="relative -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 rounded-full bg-[#ff4500] shadow-[0_0_20px_rgba(255,69,0,0.8)]" />
          </div>
        </motion.div>
      )}
    </div>
  );
}
