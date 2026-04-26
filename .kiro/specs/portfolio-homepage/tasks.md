# Implementation Plan: TomNerb Digital Solutions Portfolio Homepage

## Overview

This implementation plan breaks down the portfolio homepage feature into actionable coding tasks following the 10-phase roadmap from the design document. The homepage is a single-page React application built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, and Framer Motion, featuring heavy animations, Three.js particles, D3.js timeline, and comprehensive accessibility support.

**Tech Stack:**
- Next.js 16 (App Router)
- React 19
- TypeScript (strict mode)
- Tailwind CSS v4
- Framer Motion (animations)
- Three.js (particle system)
- D3.js (timeline visualization)
- Resend (email service)

**Performance Targets:**
- LCP < 1.8s
- Lighthouse scores ≥ 95
- 60 FPS animations
- WCAG AA compliance

## Tasks

### Phase 1: Foundation and Design System

- [ ] 1. Set up project configuration and design system
  - [ ] 1.1 Configure Tailwind CSS v4 with custom theme
    - Update `globals.css` with CSS variables for colors, spacing, animations
    - Define custom animation utilities (fade-in, slide-in, glow-hover, etc.)
    - Set up responsive breakpoints and z-index layers
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  
  - [ ] 1.2 Create animation configuration library
    - Implement `app/lib/animations.ts` with easing curves, durations, springs, staggers
    - Define Framer Motion variants (fadeInUp, scaleIn, slideInLeft, staggerContainer)
    - Export reusable animation configurations
    - _Requirements: 12.1, 12.2, 12.3, 22.1, 22.2_
  
  - [ ] 1.3 Create base UI component library
    - Implement `Button.tsx` with variants (primary, secondary, ghost) and loading states
    - Implement `Card.tsx` with hover effects and glassmorphism
    - Implement `Input.tsx` with focus states and validation styling
    - Add TypeScript interfaces for all component props
    - _Requirements: 16.1, 16.2, 16.3_

- [ ] 2. Implement core layout and navigation
  - [ ] 2.1 Create root layout with metadata
    - Implement `app/layout.tsx` with font loading (Geist Sans, Geist Mono)
    - Add SEO metadata (title, description, Open Graph tags)
    - Add structured data (JSON-LD Organization schema)
    - Configure viewport and theme-color meta tags
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5_
  
  - [ ] 2.2 Implement Navigation component with sticky behavior
    - Create `app/components/layout/Navigation.tsx` with section links
    - Implement scroll-triggered blur effect (threshold: 50px)
    - Add Intersection Observer for active section tracking
    - Implement smooth scroll with offset for fixed header (80px)
    - Add mobile hamburger menu with slide-in drawer
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 29.1, 29.2, 29.3_
  
  - [ ] 2.3 Create site data structure
    - Implement `app/data/siteData.ts` with TypeScript interfaces
    - Define data models for company info, hero, about, vision, timeline, services, team, contact
    - Populate with actual content for all sections
    - _Requirements: 23.1, 23.2, 23.3, 24.1, 24.2, 24.3_

- [ ] 3. Checkpoint - Verify foundation
  - Ensure all tests pass, ask the user if questions arise.

### Phase 2: Hero Section and Particle System

- [ ] 4. Implement Hero section with animations
  - [ ] 4.1 Create Hero section component
    - Implement `app/sections/Hero.tsx` with tagline and stats
    - Add section layout with proper semantic HTML (h1, section)
    - Integrate with siteData for content
    - _Requirements: 4.1, 4.3, 18.1, 18.4_
  
  - [ ] 4.2 Implement typewriter effect
    - Create `app/components/effects/TypewriterText.tsx`
    - Implement character-by-character animation (50ms delay)
    - Add blinking cursor with fade-out after completion
    - Respect prefers-reduced-motion setting
    - _Requirements: 27.1, 27.2, 27.3, 27.4, 27.5_
  
  - [ ] 4.3 Implement stat counter animations
    - Create `app/components/ui/StatCounter.tsx`
    - Animate from 0 to target value (2000ms duration)
    - Add stagger delay (100ms between counters)
    - Format numbers with locale-aware formatting
    - _Requirements: 4.4, 4.5_

- [ ] 5. Implement Three.js particle system
  - [ ] 5.1 Create ParticleCanvas component
    - Implement `app/components/ui/ParticleCanvas.tsx` with Three.js
    - Set up scene, camera, renderer with WebGL
    - Create particle geometry with BufferGeometry
    - Implement particle movement with Perlin noise flow field
    - Add mouse interaction (150px radius, 0.3 strength)
    - Draw connection lines when particles are close (< 120px)
    - _Requirements: 4.2, 4.6, 22.4_
  
  - [ ] 5.2 Optimize particle system performance
    - Implement FPS monitoring and quality adjustment
    - Reduce particle count on mobile (50 vs 100 desktop)
    - Disable mouse interaction on touch devices
    - Pause animation when tab is inactive
    - Use requestAnimationFrame for smooth rendering
    - _Requirements: 22.1, 22.2, 22.3, 22.4, 22.5_
  
  - [ ] 5.3 Add WebGL fallback
    - Detect WebGL support on component mount
    - Show static gradient fallback if WebGL unavailable
    - Log warning to console for debugging
    - _Requirements: 21.5_

- [ ] 6. Implement scroll-triggered animation system
  - [ ] 6.1 Create animation hooks and utilities
    - Implement `useInView` hook with Intersection Observer
    - Create `useResponsiveAnimation` hook for device-specific configs
    - Implement `usePrefersReducedMotion` hook
    - _Requirements: 12.1, 12.2, 12.4, 12.5_
  
  - [ ] 6.2 Create reusable animated section wrapper
    - Implement `AnimatedSection` component with scroll triggers
    - Configure intersection thresholds and margins
    - Apply animation variants based on viewport entry
    - _Requirements: 12.1, 12.2, 12.3_

- [ ] 7. Checkpoint - Verify hero and animations
  - Ensure all tests pass, ask the user if questions arise.

### Phase 3: About, Vision, and Timeline Sections

- [ ] 8. Implement About section with Cambodia map
  - [ ] 8.1 Create About section layout
    - Implement `app/sections/About.tsx` with two-column layout
    - Add company story text with paragraph stagger animations
    - Make responsive (stack vertically on mobile < 1024px)
    - _Requirements: 5.1, 5.2, 5.5_
  
  - [ ] 8.2 Implement Cambodia map SVG animation
    - Create Cambodia map SVG with path data
    - Implement stroke-dasharray draw-in animation (1500ms)
    - Add marker with fade-in and pulse effect
    - Style map to match dark theme with accent colors
    - _Requirements: 28.1, 28.2, 28.3, 28.4, 28.5, 5.3, 5.4_

- [ ] 9. Implement Vision/Mission/Goal cards
  - [ ] 9.1 Create VisionCard component
    - Implement `app/components/ui/VisionCard.tsx` with props interface
    - Add hover effects (scale 1.05, border glow, shadow)
    - Implement border gradient animation (3000ms loop)
    - Add icon rotation micro-interaction on hover
    - _Requirements: 6.2, 6.3_
  
  - [ ] 9.2 Create VisionMissionGoal section
    - Implement `app/sections/VisionMissionGoal.tsx`
    - Render three cards with stagger entrance animations (150ms)
    - Make responsive (3 columns → 1 column on mobile)
    - Integrate with siteData for content
    - _Requirements: 6.1, 6.4, 6.5_

- [ ] 10. Implement Timeline visualization with D3.js
  - [ ] 10.1 Create Timeline component
    - Implement `app/sections/Timeline.tsx` with D3.js
    - Create horizontal timeline axis with gradient
    - Render milestones as circles (filled for completed, outlined for planned)
    - Add connection lines (dashed for future milestones)
    - _Requirements: 7.1, 7.2_
  
  - [ ] 10.2 Add timeline animations and interactions
    - Implement sequential milestone fade-in (400ms per milestone, 100ms stagger)
    - Add hover interactions (scale 1.15, tooltip fade-in)
    - Implement horizontal scroll for mobile with snap-to-milestone
    - Add scroll indicator that fades out after 3s
    - _Requirements: 7.3, 7.4, 7.5_

- [ ] 11. Checkpoint - Verify content sections
  - Ensure all tests pass, ask the user if questions arise.

### Phase 4: Services and Team Sections

- [ ] 12. Implement Services grid with magic hover
  - [ ] 12.1 Create ServiceCard with magic hover effect
    - Implement `app/components/ui/ServiceCard.tsx`
    - Add gradient spotlight that follows cursor position
    - Calculate radial-gradient based on mouse coordinates
    - Update at 60fps using requestAnimationFrame
    - Disable on mobile/touch devices
    - _Requirements: 8.2, 8.3_
  
  - [ ] 12.2 Create Services section
    - Implement `app/sections/Services.tsx` with 2x2 grid
    - Add diagonal stagger entrance animations (100ms)
    - Implement hover state (background lighten, border, shadow, icon rotation)
    - Make responsive (2x2 → 1 column on mobile)
    - Integrate with siteData for four services
    - _Requirements: 8.1, 8.4, 8.5, 24.4_

- [ ] 13. Implement Team section
  - [ ] 13.1 Create TeamMemberCard component
    - Implement `app/components/ui/TeamMemberCard.tsx`
    - Add avatar hover effects (scale 1.1, grayscale to color, border glow)
    - Implement bio reveal on hover (height 0 → auto)
    - Add social media icon links with hover effects
    - _Requirements: 9.5, 9.6_
  
  - [ ] 13.2 Create Team section
    - Implement `app/sections/Team.tsx` with responsive grid
    - Render six team member profiles with row-by-row stagger (80ms)
    - Make responsive (3 → 2 → 1 columns)
    - Integrate with siteData for team members
    - Handle missing avatars with placeholder
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 23.4, 23.5_

- [ ] 14. Checkpoint - Verify services and team
  - Ensure all tests pass, ask the user if questions arise.

### Phase 5: Contact Form and API Integration

- [ ] 15. Implement Contact form UI
  - [ ] 15.1 Create form field components
    - Implement `app/components/ui/FormField.tsx` with label, input, error display
    - Add focus animations (label translate up, border color change, glow)
    - Implement validation feedback animations (error shake, message slide-down)
    - Add success state with checkmark icon animation
    - _Requirements: 10.1, 30.1, 30.2, 30.3, 30.4, 30.5_
  
  - [ ] 15.2 Create Contact section
    - Implement `app/sections/Contact.tsx` with form fields (name, email, subject, message)
    - Add form entrance animation (fade-in + slide-up 40px)
    - Implement submit button with loading state (spinner rotation)
    - Add success/error message display with live regions
    - _Requirements: 10.1, 26.1, 26.2_

- [ ] 16. Implement form validation
  - [ ] 16.1 Create validation functions
    - Implement `validateContactForm` in `app/lib/validation.ts`
    - Validate name (required, 2-100 characters)
    - Validate email (required, valid format)
    - Validate subject (required, 5-200 characters)
    - Validate message (required, 10-2000 characters)
    - _Requirements: 10.5, 10.6, 20.1, 20.2, 20.5_
  
  - [ ] 16.2 Add client-side validation
    - Implement real-time validation on blur
    - Show field-specific error messages
    - Clear errors when input is corrected
    - Disable submit button until form is valid
    - _Requirements: 30.1, 30.2, 30.3_

- [ ] 17. Implement contact API route
  - [ ] 17.1 Create contact API endpoint
    - Implement `app/api/contact/route.ts` with POST handler
    - Validate request body using validation functions
    - Integrate Resend email service
    - Format email HTML with submission details
    - Return appropriate HTTP status codes (200, 400, 500)
    - _Requirements: 10.2, 20.3, 20.4_
  
  - [ ] 17.2 Add error handling and retry logic
    - Implement try-catch for network errors
    - Add exponential backoff retry (max 3 attempts)
    - Handle Resend API errors gracefully
    - Log errors for debugging
    - _Requirements: 20.3, 20.4_

- [ ] 18. Checkpoint - Verify contact form
  - Ensure all tests pass, ask the user if questions arise.

### Phase 6: Polish and Interactive Effects

- [ ] 19. Implement custom cursor (desktop only)
  - [ ] 19.1 Create CustomCursor component
    - Implement `app/components/effects/CustomCursor.tsx`
    - Follow mouse with 100ms delay and smooth easing
    - Update at 60fps using requestAnimationFrame
    - Hide on touch devices and mobile viewports
    - _Requirements: 13.1, 13.2, 13.4_
  
  - [ ] 19.2 Add cursor hover states
    - Implement default state (20px circle, accent color, 0.5 opacity)
    - Add link hover state (scale to 40px, opacity 0.3)
    - Add button hover state (scale to 50px, accent glow)
    - Add text hover state (scale to 10px, full opacity)
    - Use mix-blend-mode: difference for contrast
    - _Requirements: 13.3, 13.5_

- [ ] 20. Implement scroll effects
  - [ ] 20.1 Create ScrollProgress component
    - Implement `app/components/ui/ScrollProgress.tsx`
    - Calculate scroll percentage and update width
    - Add glow effect with box-shadow
    - Fade in after 100px scroll, fade out at top
    - _Requirements: Custom enhancement_
  
  - [ ] 20.2 Create BackToTop button
    - Implement `app/components/ui/BackToTop.tsx`
    - Show button after scrolling past first section
    - Animate entrance with scale and fade
    - Smooth scroll to top on click
    - _Requirements: Custom enhancement_

- [ ] 21. Add micro-interactions and polish
  - [ ] 21.1 Enhance button interactions
    - Add hover scale (1.02) and shadow increase
    - Implement active state (scale 0.98)
    - Add ripple effect on click (optional)
    - _Requirements: 22.2_
  
  - [ ] 21.2 Create loading skeletons
    - Implement skeleton components for ParticleCanvas and Timeline
    - Add shimmer animation effect
    - Match layout of actual components
    - _Requirements: 26.5_

- [ ] 22. Checkpoint - Verify polish and effects
  - Ensure all tests pass, ask the user if questions arise.

### Phase 7: Accessibility and SEO

- [ ] 23. Implement accessibility features
  - [ ] 23.1 Add semantic HTML and ARIA labels
    - Add skip-to-content link (visible on focus)
    - Use proper heading hierarchy (h1 → h2 → h3)
    - Add ARIA labels for icon-only buttons
    - Add ARIA live regions for dynamic content
    - Add aria-required, aria-invalid, aria-describedby to form fields
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 18.1, 18.2, 18.3, 18.4, 18.5_
  
  - [ ] 23.2 Implement keyboard navigation
    - Ensure all interactive elements are keyboard accessible
    - Add visible focus indicators (outline, box-shadow)
    - Implement focus trap for modals (if any)
    - Support Enter key for anchor links
    - _Requirements: 17.1, 17.2, 17.3, 17.5_
  
  - [ ] 23.3 Add reduced motion support
    - Implement usePrefersReducedMotion hook
    - Create simplified animation variants for reduced motion
    - Apply CSS media query fallback
    - Test with prefers-reduced-motion enabled
    - _Requirements: 12.4, 12.5, 27.5_
  
  - [ ] 23.4 Ensure color contrast compliance
    - Verify all text meets WCAG AA contrast ratios (4.5:1 for normal, 3:1 for large)
    - Test with contrast checker tools
    - Adjust colors if needed to meet standards
    - _Requirements: 2.4_

- [ ] 24. Implement SEO optimization
  - [ ] 24.1 Add comprehensive metadata
    - Add title, description, keywords meta tags
    - Add Open Graph tags (og:title, og:description, og:image, og:url)
    - Add Twitter Card tags
    - Add canonical URL
    - _Requirements: 19.1, 19.2, 19.3, 19.4_
  
  - [ ] 24.2 Add structured data
    - Implement JSON-LD Organization schema
    - Include company name, logo, contact info, social profiles
    - Add to root layout head
    - _Requirements: 19.5_
  
  - [ ] 24.3 Optimize images for SEO
    - Add descriptive alt text to all images
    - Use empty alt for decorative images
    - Optimize image file sizes
    - Use Next.js Image component for automatic optimization
    - _Requirements: 18.3, 14.3_

- [ ] 25. Checkpoint - Verify accessibility and SEO
  - Ensure all tests pass, ask the user if questions arise.

### Phase 8: Performance Optimization

- [ ] 26. Implement code splitting and lazy loading
  - [ ] 26.1 Lazy load heavy components
    - Use dynamic imports for ParticleCanvas (ssr: false)
    - Use dynamic imports for Timeline (ssr: false)
    - Use dynamic imports for CustomCursor (ssr: false)
    - Add loading skeletons for lazy-loaded components
    - _Requirements: 14.4, 14.5_
  
  - [ ] 26.2 Optimize bundle size
    - Use tree-shaking for lodash imports (import specific functions)
    - Analyze bundle with ANALYZE=true next build
    - Ensure initial bundle < 500KB gzipped
    - _Requirements: 14.1, 14.2_

- [ ] 27. Optimize images and fonts
  - [ ] 27.1 Configure Next.js Image optimization
    - Set up image formats (AVIF, WebP)
    - Configure device sizes and image sizes
    - Add blur placeholders for images
    - Use priority prop for above-fold images
    - _Requirements: 14.3, 14.4_
  
  - [ ] 27.2 Optimize font loading
    - Preload critical fonts (Geist Sans, Geist Mono)
    - Use font-display: swap for faster rendering
    - Add system font fallback stack
    - _Requirements: 14.2_

- [ ] 28. Implement caching and headers
  - [ ] 28.1 Configure Next.js headers
    - Add cache headers for static assets (fonts, images)
    - Add security headers (HSTS, X-Frame-Options, CSP)
    - Add DNS prefetch for external services
    - _Requirements: 21.1, 21.2, 21.3, 21.4_
  
  - [ ] 28.2 Optimize API routes
    - Use Edge Runtime for contact API
    - Set appropriate cache headers
    - Implement rate limiting (optional)
    - _Requirements: Custom enhancement_

- [ ] 29. Implement performance monitoring
  - [ ] 29.1 Add Core Web Vitals tracking
    - Implement `app/lib/monitoring.ts` with web-vitals library
    - Track LCP, FID, FCP, CLS, TTFB
    - Send metrics to analytics service
    - Log metrics in development
    - _Requirements: 14.1, 15.1, 15.2, 15.3, 15.4, 15.5_
  
  - [ ] 29.2 Add FPS monitoring for animations
    - Implement FPS counter for particle system
    - Reduce quality if FPS drops below 30
    - Log performance warnings
    - _Requirements: 22.1, 22.4_

- [ ] 30. Checkpoint - Verify performance
  - Ensure all tests pass, ask the user if questions arise.

### Phase 9: Testing and Quality Assurance

- [ ] 31. Write unit tests
  - [ ]* 31.1 Test validation functions
    - Test validateContactForm with valid data
    - Test validation errors for each field
    - Test edge cases (empty strings, max length, special characters)
    - _Requirements: 10.5, 10.6, 20.1, 20.2, 20.5_
  
  - [ ]* 31.2 Test animation utilities
    - Test useResponsiveAnimation hook for mobile/desktop
    - Test usePrefersReducedMotion hook
    - Test useSmoothScroll utility
    - _Requirements: 12.4, 12.5, 29.1, 29.2, 29.3_

- [ ] 32. Write integration tests
  - [ ]* 32.1 Test contact API route
    - Test successful email submission with valid data
    - Test 400 error for invalid data
    - Test 500 error for Resend API failure
    - Mock Resend service for testing
    - _Requirements: 10.2, 10.3, 10.4, 20.3, 20.4_

- [ ] 33. Perform cross-browser testing
  - [ ]* 33.1 Test on target browsers
    - Test on Chrome 120+
    - Test on Firefox 120+
    - Test on Safari 17+
    - Test on Edge 120+
    - Document and fix browser-specific issues
    - _Requirements: 21.1, 21.2, 21.3, 21.4_
  
  - [ ]* 33.2 Test on mobile devices
    - Test on iOS Safari
    - Test on Android Chrome
    - Verify touch interactions work correctly
    - Verify responsive layouts
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ] 34. Run accessibility audits
  - [ ]* 34.1 Automated accessibility testing
    - Run axe DevTools on all sections
    - Run Lighthouse accessibility audit (target ≥ 95)
    - Fix all identified issues
    - _Requirements: 15.2, 17.1, 17.2, 17.3, 17.4, 17.5, 18.1, 18.2, 18.3, 18.4, 18.5_
  
  - [ ]* 34.2 Manual accessibility testing
    - Test keyboard navigation through entire site
    - Test with screen reader (NVDA, JAWS, or VoiceOver)
    - Test with browser zoom at 200%
    - Test with prefers-reduced-motion enabled
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 12.4, 12.5_

- [ ] 35. Run performance audits
  - [ ]* 35.1 Lighthouse performance testing
    - Run Lighthouse in mobile mode (target ≥ 95)
    - Run Lighthouse in desktop mode (target ≥ 95)
    - Verify LCP < 1.8s
    - Verify CLS < 0.1
    - Fix performance issues
    - _Requirements: 14.1, 15.1, 15.2, 15.3, 15.4, 15.5_
  
  - [ ]* 35.2 Animation performance testing
    - Monitor FPS during animations (target 60, minimum 30)
    - Test particle system on low-end devices
    - Verify animations respect reduced motion
    - _Requirements: 22.1, 22.2, 22.3, 22.4, 22.5_

- [ ] 36. Checkpoint - Verify all tests pass
  - Ensure all tests pass, ask the user if questions arise.

### Phase 10: Deployment and Launch

- [ ] 37. Configure deployment
  - [ ] 37.1 Set up environment variables
    - Create .env.example with required variables
    - Document RESEND_API_KEY, CONTACT_EMAIL, NEXT_PUBLIC_GA_ID
    - Add environment validation function
    - _Requirements: Custom enhancement_
  
  - [ ] 37.2 Configure Vercel deployment
    - Create vercel.json with build configuration
    - Set up environment variables in Vercel dashboard
    - Configure custom domain and SSL
    - Set deployment region (Singapore for Cambodia proximity)
    - _Requirements: Custom enhancement_

- [ ] 38. Set up monitoring and analytics
  - [ ] 38.1 Integrate analytics
    - Add Google Analytics tracking code
    - Track page views and custom events
    - Track scroll depth milestones
    - Track contact form submissions
    - _Requirements: 25.1, 25.2, 25.3, 25.4, 25.5_
  
  - [ ] 38.2 Set up error tracking
    - Integrate error tracking service (Sentry or similar)
    - Configure error boundaries
    - Set up global error handlers
    - Test error reporting
    - _Requirements: Custom enhancement_

- [ ] 39. Create CI/CD pipeline
  - [ ] 39.1 Set up GitHub Actions workflow
    - Create workflow for linting on PR
    - Create workflow for building on PR
    - Create workflow for Lighthouse CI
    - Create workflow for deployment to production
    - _Requirements: Custom enhancement_
  
  - [ ] 39.2 Configure Lighthouse CI
    - Create lighthouserc.json with performance budgets
    - Set assertions for performance, accessibility, SEO scores
    - Configure budget for bundle sizes
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

- [ ] 40. Pre-launch checklist and deployment
  - [ ] 40.1 Final QA pass
    - Test all sections and interactions
    - Verify all links work correctly
    - Check all content is accurate
    - Test contact form end-to-end
    - Verify analytics tracking
    - _Requirements: All requirements_
  
  - [ ] 40.2 Deploy to production
    - Deploy to Vercel production
    - Verify deployment successful
    - Test live site on production URL
    - Monitor for errors in first 24 hours
    - _Requirements: All requirements_

- [ ] 41. Final checkpoint - Launch complete
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional testing tasks and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation throughout implementation
- The design document does not include Correctness Properties, so no property-based tests are included
- Unit tests and integration tests validate specific functionality and edge cases
- Manual testing is required for animations, accessibility, and cross-browser compatibility
- Performance targets: LCP < 1.8s, Lighthouse ≥ 95, 60 FPS animations, WCAG AA compliance

## Implementation Guidelines

**TypeScript:**
- Use strict mode with explicit types for all functions
- Define interfaces for all component props and data models
- Avoid using `any` type

**Styling:**
- Use Tailwind CSS v4 utility classes
- Use `cn()` utility for conditional classes
- Define custom animations in globals.css
- Use CSS variables for theme colors

**Animations:**
- Use Framer Motion for React animations
- Use CSS animations for simple effects
- Respect prefers-reduced-motion setting
- Target 60 FPS, minimum 30 FPS on low-end devices

**Performance:**
- Lazy load heavy libraries (Three.js, D3.js)
- Use Next.js Image component for images
- Implement code splitting
- Monitor Core Web Vitals

**Accessibility:**
- Use semantic HTML elements
- Add ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers
- Maintain WCAG AA contrast ratios
