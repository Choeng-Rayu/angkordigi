"use client";

import { Variants, Transition } from "framer-motion";
import { useReducedMotion } from "./hooks/useReducedMotion";

export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

export const glowPulse: Variants = {
  initial: {
    boxShadow: "0 0 20px rgba(79, 124, 255, 0.2)",
  },
  animate: {
    boxShadow: [
      "0 0 20px rgba(79, 124, 255, 0.2)",
      "0 0 40px rgba(79, 124, 255, 0.3), 0 0 60px rgba(79, 124, 255, 0.2)",
      "0 0 20px rgba(79, 124, 255, 0.2)",
    ],
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

export const neonGlow: Variants = {
  initial: {
    textShadow: "0 0 10px rgba(0, 255, 194, 0.3)",
  },
  animate: {
    textShadow: [
      "0 0 10px rgba(0, 255, 194, 0.3)",
      "0 0 20px rgba(0, 255, 194, 0.5), 0 0 30px rgba(0, 255, 194, 0.3)",
      "0 0 10px rgba(0, 255, 194, 0.3)",
    ],
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

export const hoverScale = {
  scale: 1.02,
  transition: { duration: 0.2 },
};

export const hoverLift = {
  y: -4,
  transition: { duration: 0.2 },
};

export const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

// =============================================================================
// ACCESSIBLE ANIMATION UTILITIES
// =============================================================================

/**
 * Hook that returns animation variants respecting reduced motion preference
 * When reduced motion is preferred, returns instant animations (duration: 0.01)
 * Otherwise returns the normal animations
 */
export function useAccessibleAnimations(animations: Variants): Variants {
  const prefersReducedMotion = useReducedMotion();

  if (!prefersReducedMotion) {
    return animations;
  }

  // Create reduced motion variants by stripping animations
  const reducedVariants: Variants = {};

  for (const key in animations) {
    const variant = animations[key];

    if (key === "hidden") {
      reducedVariants[key] = { opacity: 0 };
    } else if (key === "visible") {
      reducedVariants[key] = {
        opacity: 1,
        transition: { duration: 0.01 },
      };
    } else if (key === "initial") {
      reducedVariants[key] = variant as Variants["initial"];
    } else if (key === "animate") {
      reducedVariants[key] = {
        ...(variant as Record<string, unknown>),
        transition: { duration: 0.01 },
      } as Variants["animate"];
    } else {
      // For other keys, keep them but with minimal transition
      reducedVariants[key] = variant as Variants[string];
    }
  }

  return reducedVariants;
}

/**
 * Higher-order function that wraps any variant to respect reduced motion
 * Returns a function that can be used as a hook
 */
export function withReducedMotion(variants: Variants): () => Variants {
  return function useReducedMotionVariant(): Variants {
    const prefersReducedMotion = useReducedMotion();

    if (!prefersReducedMotion) {
      return variants;
    }

  // Create reduced motion variants
  const reducedVariants: Variants = {};

  for (const key in variants) {
    const variant = variants[key];

    if (key === "hidden") {
      reducedVariants[key] = { opacity: 0 };
    } else if (key === "visible") {
      reducedVariants[key] = {
        opacity: 1,
        transition: { duration: 0.01 },
      };
    } else if (key === "initial") {
      reducedVariants[key] = variant as Variants["initial"];
    } else if (key === "animate") {
      reducedVariants[key] = {
        ...(variant as Record<string, unknown>),
        transition: { duration: 0.01 },
      } as Variants["animate"];
    } else {
      reducedVariants[key] = variant as Variants[string];
    }
  }

  return reducedVariants;
};
}

/**
 * Hook for accessible fade in animation
 */
export function useAccessibleFadeIn(): Variants {
  return useAccessibleAnimations(fadeIn);
}

/**
 * Hook for accessible fade in up animation
 */
export function useAccessibleFadeInUp(): Variants {
  return useAccessibleAnimations(fadeInUp);
}

/**
 * Hook for accessible stagger animation
 * Takes stagger delay and delay children as parameters
 */
export function useAccessibleStagger(
  staggerChildren: number = 0.08,
  delayChildren: number = 0.1
): Variants {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.01,
          delayChildren: 0.01,
        },
      },
    };
  }

  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };
}

/**
 * Transition config that respects reduced motion
 * Returns a transition object with duration 0.01 if reduced motion is preferred
 */
export function accessibleTransition(
  transition: Transition
): Transition {
  // This function is designed to be used within a component that calls useReducedMotion
  // Since hooks can only be called within components, we return the transition as-is
  // Components should use useReducedMotion() directly to conditionally apply transitions
  return transition;
}

/**
 * Hook that returns a transition config respecting reduced motion preference
 * Use this inside components to get the appropriate transition
 */
export function useAccessibleTransition(transition: Transition): Transition {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return { duration: 0.01 };
  }

  return transition;
}
