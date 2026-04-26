"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// ============================================================================
// Event Name Constants
// ============================================================================

export const ANALYTICS_EVENTS = {
  PAGE_VIEW: "page_view",
  SCROLL_DEPTH: "scroll_depth",
  ANCHOR_CLICK: "anchor_click",
  FORM_SUBMIT: "form_submit",
  FORM_ERROR: "form_error",
} as const;

// ============================================================================
// Type Definitions
// ============================================================================

export type AnalyticsEventName =
  | typeof ANALYTICS_EVENTS.PAGE_VIEW
  | typeof ANALYTICS_EVENTS.SCROLL_DEPTH
  | typeof ANALYTICS_EVENTS.ANCHOR_CLICK
  | typeof ANALYTICS_EVENTS.FORM_SUBMIT
  | typeof ANALYTICS_EVENTS.FORM_ERROR
  | string;

export interface AnalyticsProperties {
  [key: string]: string | number | boolean | undefined;
}

export interface ScrollDepthOptions {
  thresholds?: number[];
  throttleMs?: number;
}

export interface UseAnalyticsOptions {
  enableScrollTracking?: boolean;
  scrollOptions?: ScrollDepthOptions;
  enableAnchorTracking?: boolean;
}

export interface ConsentState {
  analytics: boolean;
  marketing: boolean;
}

declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "consent",
      eventName: string,
      eventParams?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
  }
}

// ============================================================================
// Consent Management
// ============================================================================

const STORAGE_KEY = "analytics_consent";

export function getConsentState(): ConsentState {
  if (typeof window === "undefined") {
    return { analytics: false, marketing: false };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as ConsentState;
    }
  } catch {
    // localStorage might be disabled or unavailable
  }

  return { analytics: false, marketing: false };
}

export function setConsentState(consent: ConsentState): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    
    // Update gtag consent if available
    if (window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: consent.analytics ? "granted" : "denied",
        ad_storage: consent.marketing ? "granted" : "denied",
      });
    }
  } catch {
    // localStorage might be disabled or unavailable
  }
}

export function hasAnalyticsConsent(): boolean {
  return getConsentState().analytics;
}

export function optOut(): void {
  setConsentState({ analytics: false, marketing: false });
}

export function optIn(analytics = true, marketing = false): void {
  setConsentState({ analytics, marketing });
}

// ============================================================================
// Core Tracking Function
// ============================================================================

export function trackEvent(
  eventName: AnalyticsEventName,
  properties: AnalyticsProperties = {}
): void {
  // Check consent before tracking
  if (!hasAnalyticsConsent()) {
    if (process.env.NODE_ENV === "development") {
      console.log("[Analytics] Blocked (no consent):", eventName, properties);
    }
    return;
  }

  const eventData = {
    event_name: eventName,
    ...properties,
    timestamp: new Date().toISOString(),
  };

  // Send to GA4 if available
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, {
      ...properties,
      event_category: properties.category || "engagement",
      event_label: properties.label,
      value: properties.value,
    });
  }

  // Push to dataLayer for GTM if available
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...properties,
    });
  }

  // Log in development
  if (process.env.NODE_ENV === "development") {
    console.log("[Analytics]", eventName, eventData);
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

export function trackPageView(url: string, properties: AnalyticsProperties = {}): void {
  trackEvent(ANALYTICS_EVENTS.PAGE_VIEW, {
    page_location: url,
    page_path: url,
    ...properties,
  });

  // Update GA4 config if available
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", "GA_MEASUREMENT_ID", {
      page_path: url,
      page_location: url,
    });
  }
}

export function trackScrollDepth(percentage: number, properties: AnalyticsProperties = {}): void {
  trackEvent(ANALYTICS_EVENTS.SCROLL_DEPTH, {
    depth_percentage: percentage,
    category: "engagement",
    label: `${percentage}%`,
    ...properties,
  });
}

export function trackAnchorClick(sectionId: string, properties: AnalyticsProperties = {}): void {
  trackEvent(ANALYTICS_EVENTS.ANCHOR_CLICK, {
    section_id: sectionId,
    category: "navigation",
    label: sectionId,
    ...properties,
  });
}

export function trackFormSubmit(
  formType: string,
  success: boolean,
  properties: AnalyticsProperties = {}
): void {
  const eventName = success ? ANALYTICS_EVENTS.FORM_SUBMIT : ANALYTICS_EVENTS.FORM_ERROR;
  
  trackEvent(eventName, {
    form_type: formType,
    form_status: success ? "success" : "error",
    category: "conversion",
    label: formType,
    ...properties,
  });
}

// ============================================================================
// Hook: useAnalytics
// ============================================================================

export function useAnalytics(options: UseAnalyticsOptions = {}) {
  const {
    enableScrollTracking = true,
    scrollOptions = { thresholds: [25, 50, 75, 100], throttleMs: 250 },
    enableAnchorTracking = true,
  } = options;

  const [consent, setConsentState] = useState<ConsentState>({ analytics: false, marketing: false });
  const [isInitialized, setIsInitialized] = useState(false);
  
  const trackedDepths = useRef<Set<number>>(new Set());
  const scrollThrottled = useRef(false);
  const anchorHandlers = useRef<Map<string, EventListener>>(new Map());

  // Initialize consent state
  useEffect(() => {
    setConsentState(getConsentState());
    setIsInitialized(true);
  }, []);

  // ============================================================================
  // Scroll Depth Tracking
  // ============================================================================

  const handleScroll = useCallback(() => {
    if (!hasAnalyticsConsent() || scrollThrottled.current) {
      return;
    }

    scrollThrottled.current = true;

    setTimeout(() => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      const thresholds = scrollOptions.thresholds ?? [25, 50, 75, 100];

      thresholds.forEach((threshold) => {
        if (scrollPercent >= threshold && !trackedDepths.current.has(threshold)) {
          trackedDepths.current.add(threshold);
          trackScrollDepth(threshold);
        }
      });

      scrollThrottled.current = false;
    }, scrollOptions.throttleMs ?? 250);
  }, [scrollOptions.thresholds, scrollOptions.throttleMs]);

  // Setup scroll tracking
  useEffect(() => {
    if (!enableScrollTracking || !isInitialized) {
      return;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [enableScrollTracking, handleScroll, isInitialized]);

  // ============================================================================
  // Anchor Link Tracking
  // ============================================================================

  const handleAnchorClick = useCallback((event: Event) => {
    const target = event.currentTarget as HTMLAnchorElement;
    const href = target.getAttribute("href");

    if (href && href.startsWith("#")) {
      const sectionId = href.substring(1);
      trackAnchorClick(sectionId);
    }
  }, []);

  // Setup anchor tracking
  useEffect(() => {
    if (!enableAnchorTracking || !isInitialized) {
      return;
    }

    // Find all anchor links with hash
    const anchorLinks = document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');

    anchorLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href) {
        link.addEventListener("click", handleAnchorClick);
        anchorHandlers.current.set(href, handleAnchorClick);
      }
    });

    return () => {
      anchorHandlers.current.forEach((handler, href) => {
        const link = document.querySelector<HTMLAnchorElement>(`a[href="${href}"]`);
        if (link) {
          link.removeEventListener("click", handler);
        }
      });
      anchorHandlers.current.clear();
    };
  }, [enableAnchorTracking, handleAnchorClick, isInitialized]);

  // ============================================================================
  // Hook API
  // ============================================================================

  const track = useCallback(
    (eventName: AnalyticsEventName, properties: AnalyticsProperties = {}) => {
      trackEvent(eventName, properties);
    },
    []
  );

  const updateConsent = useCallback((newConsent: ConsentState) => {
    setConsentState(newConsent);
    setConsentState(newConsent);
  }, []);

  const resetScrollTracking = useCallback(() => {
    trackedDepths.current.clear();
  }, []);

  return {
    // Core tracking
    track,
    trackEvent,
    
    // Helper functions
    trackPageView,
    trackScrollDepth,
    trackAnchorClick,
    trackFormSubmit,
    
    // Consent
    consent,
    updateConsent,
    hasConsent: hasAnalyticsConsent,
    optIn,
    optOut,
    
    // State
    isInitialized,
    resetScrollTracking,
  };
}

// ============================================================================
// Named Exports (Constants)
// ============================================================================

export { ANALYTICS_EVENTS as EVENTS };

// Convenience re-exports for destructuring
export const { PAGE_VIEW, SCROLL_DEPTH, ANCHOR_CLICK, FORM_SUBMIT, FORM_ERROR } = ANALYTICS_EVENTS;
