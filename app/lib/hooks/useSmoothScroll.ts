"use client";

import { useCallback } from "react";

interface ScrollOptions {
  offset?: number;
  behavior?: ScrollBehavior;
  duration?: number;
}

export function useSmoothScroll() {
  const scrollToElement = useCallback(
    (elementId: string, options: ScrollOptions = {}) => {
      const { offset = 0, behavior = "smooth", duration = 800 } = options;

      const element = document.getElementById(elementId);
      if (!element) {
        console.warn(`Element with id "${elementId}" not found`);
        return;
      }

      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      // Use native smooth scroll if supported and no custom duration
      if (behavior === "smooth" && duration === undefined) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      // Custom smooth scroll with duration
      const startPosition = window.scrollY;
      const distance = offsetPosition - startPosition;
      let startTime: number | null = null;

      const animation = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        // Ease-in-out cubic function
        const ease =
          progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        window.scrollTo(0, startPosition + distance * ease);

        if (progress < 1) {
          requestAnimationFrame(animation);
        }
      };

      requestAnimationFrame(animation);
    },
    []
  );

  const scrollToTop = useCallback((options: ScrollOptions = {}) => {
    const { behavior = "smooth", duration = 800 } = options;

    if (behavior === "smooth" && duration === undefined) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const startPosition = window.scrollY;
    let startTime: number | null = null;

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      const ease =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo(0, startPosition * (1 - ease));

      if (progress < 1) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  }, []);

  const scrollToSection = useCallback(
    (sectionRef: React.RefObject<HTMLElement | null>, options: ScrollOptions = {}) => {
      const { offset = 80, behavior = "smooth" } = options;

      if (!sectionRef.current) {
        console.warn("Section ref is not available");
        return;
      }

      const elementPosition = sectionRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior,
      });
    },
    []
  );

  return {
    scrollToElement,
    scrollToTop,
    scrollToSection,
  };
}
