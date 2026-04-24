# Requirements Document: TomNerb Digital Solutions Portfolio Homepage

## Introduction

This document specifies the requirements for the TomNerb Digital Solutions main portfolio website homepage. The system is a single-page, dark-themed, animated portfolio website designed to showcase the company's services, team, and vision to SMEs in Cambodia. The design philosophy draws inspiration from D3.js, Vercel, and Linear.app, emphasizing precision, speed, and minimalism while projecting a global SaaS company aesthetic built locally.

## Glossary

- **Homepage**: The single-page portfolio website for TomNerb Digital Solutions
- **Navigation_Bar**: The sticky navigation component at the top of the page
- **Hero_Section**: The first viewport section containing animated background and tagline
- **Particle_Canvas**: Three.js-powered animated particle background in the Hero_Section
- **About_Section**: Section containing company story and Cambodia map visualization
- **Vision_Cards**: Interactive cards displaying vision, mission, and goal statements
- **Timeline_Visualization**: D3.js-powered horizontal scrolling timeline (2026-2030)
- **Services_Grid**: Grid layout displaying four service offerings
- **Team_Grid**: Responsive grid displaying six team member profiles
- **Contact_Form**: Form component for user inquiries with email integration
- **Viewport**: The visible area of the browser window
- **LCP**: Largest Contentful Paint - performance metric measuring loading speed
- **Scroll_Trigger**: Event that activates animations when elements enter the viewport
- **Magic_Hover**: Advanced hover effect with gradient tracking and glow
- **Anchor_Link**: Navigation link that scrolls to a specific section on the same page

## Requirements

### Requirement 1: Single-Page Architecture

**User Story:** As a visitor, I want to navigate through all content on a single page, so that I can experience a seamless browsing flow without page reloads.

#### Acceptance Criteria

1. THE Homepage SHALL render all sections (Navigation, Hero, About, Vision/Mission/Goal, Timeline, Services, Team, Contact) on a single HTML page
2. WHEN a visitor clicks an Anchor_Link in the Navigation_Bar, THE Homepage SHALL smoothly scroll to the corresponding section
3. THE Homepage SHALL maintain browser history for each section navigation
4. WHEN a visitor uses browser back/forward buttons, THE Homepage SHALL scroll to the appropriate section
5. THE Homepage SHALL support deep linking to specific sections via URL hash fragments

### Requirement 2: Dark Theme with Brand Colors

**User Story:** As a visitor, I want to experience a modern dark-themed interface, so that the site feels premium and reduces eye strain.

#### Acceptance Criteria

1. THE Homepage SHALL use a dark background color scheme as the primary theme
2. THE Homepage SHALL use electric blue (#4F7CFF) as the primary accent color
3. THE Homepage SHALL use teal neon (#00FFC2) as the secondary accent color
4. THE Homepage SHALL maintain WCAG AA contrast ratios for all text elements against dark backgrounds
5. THE Homepage SHALL apply consistent color usage across all sections

### Requirement 3: Sticky Navigation with Blur Effect

**User Story:** As a visitor, I want persistent navigation access, so that I can quickly jump to any section while scrolling.

#### Acceptance Criteria

1. THE Navigation_Bar SHALL remain fixed at the top of the viewport during scrolling
2. WHEN the page is scrolled beyond 50 pixels, THE Navigation_Bar SHALL apply a backdrop blur effect
3. WHEN the page is scrolled beyond 50 pixels, THE Navigation_Bar SHALL display a semi-transparent background
4. THE Navigation_Bar SHALL contain Anchor_Links to all major sections
5. WHEN a visitor hovers over an Anchor_Link, THE Navigation_Bar SHALL display a visual hover state with accent color

### Requirement 4: Hero Section with Particle Animation

**User Story:** As a visitor, I want to see an impressive animated hero section, so that I immediately perceive the company as innovative and technically capable.

#### Acceptance Criteria

1. THE Hero_Section SHALL render a Particle_Canvas as the background using Three.js
2. THE Particle_Canvas SHALL animate particles continuously with smooth motion
3. THE Hero_Section SHALL display the company tagline "We Turn Your Challenges Into Digital Solutions" with a typewriter animation effect
4. THE Hero_Section SHALL display at least three animated stat counters (e.g., projects completed, clients served, years of experience)
5. WHEN the Hero_Section loads, THE stat counters SHALL animate from zero to their target values within 2 seconds
6. THE Particle_Canvas SHALL respond to mouse movement with subtle particle attraction or repulsion effects

### Requirement 5: About Section with Company Story

**User Story:** As a visitor, I want to learn about TomNerb Digital Solutions' background, so that I can understand the company's expertise and local presence.

#### Acceptance Criteria

1. THE About_Section SHALL display content in a two-column layout on desktop viewports (≥1024px width)
2. THE About_Section SHALL display the company story text in the left column
3. THE About_Section SHALL display an animated Cambodia map visualization in the right column
4. WHEN the About_Section enters the viewport, THE Cambodia map SHALL animate into view
5. THE About_Section SHALL stack columns vertically on mobile viewports (<1024px width)

### Requirement 6: Vision, Mission, and Goal Cards

**User Story:** As a visitor, I want to understand the company's vision, mission, and goals, so that I can assess alignment with my business needs.

#### Acceptance Criteria

1. THE Homepage SHALL display three Vision_Cards in a horizontal layout
2. WHEN a visitor hovers over a Vision_Card, THE Vision_Card SHALL elevate with a scale transformation
3. WHEN a visitor hovers over a Vision_Card, THE Vision_Card SHALL display a colored border using accent colors
4. THE Vision_Cards SHALL display vision, mission, and goal content respectively
5. THE Vision_Cards SHALL arrange in a single column on mobile viewports (<768px width)

### Requirement 7: Company Timeline Visualization

**User Story:** As a visitor, I want to see the company's roadmap from 2026 to 2030, so that I can understand their growth trajectory and future plans.

#### Acceptance Criteria

1. THE Timeline_Visualization SHALL render using D3.js
2. THE Timeline_Visualization SHALL display milestones for years 2026 through 2030
3. THE Timeline_Visualization SHALL support horizontal scrolling on mobile viewports
4. WHEN a visitor hovers over a timeline milestone, THE Timeline_Visualization SHALL highlight that milestone with accent color
5. WHEN the Timeline_Visualization enters the viewport, THE milestones SHALL animate into view sequentially

### Requirement 8: Services Grid with Magic Hover

**User Story:** As a visitor, I want to explore the four service offerings, so that I can identify which services match my business needs.

#### Acceptance Criteria

1. THE Services_Grid SHALL display exactly four service cards in a 2x2 grid on desktop viewports (≥768px width)
2. WHEN a visitor hovers over a service card, THE service card SHALL display a Magic_Hover effect with gradient tracking
3. THE Magic_Hover effect SHALL create a glow that follows the cursor position
4. THE Services_Grid SHALL display service cards in a single column on mobile viewports (<768px width)
5. WHEN a service card enters the viewport, THE service card SHALL fade in with a stagger delay

### Requirement 9: Team Section Display

**User Story:** As a visitor, I want to see the team members, so that I can understand who I'll be working with.

#### Acceptance Criteria

1. THE Team_Grid SHALL display exactly six team member profiles
2. THE Team_Grid SHALL arrange profiles in a 3-column layout on desktop viewports (≥1024px width)
3. THE Team_Grid SHALL arrange profiles in a 2-column layout on tablet viewports (768px-1023px width)
4. THE Team_Grid SHALL arrange profiles in a single column on mobile viewports (<768px width)
5. WHEN a visitor hovers over a team member profile, THE avatar SHALL scale up with a smooth transition
6. WHEN a team member profile enters the viewport, THE profile SHALL animate into view with a fade-in effect

### Requirement 10: Contact Form with Email Integration

**User Story:** As a visitor, I want to submit an inquiry through a contact form, so that I can reach out to TomNerb Digital Solutions without leaving the website.

#### Acceptance Criteria

1. THE Contact_Form SHALL contain input fields for name, email, subject, and message
2. WHEN a visitor submits the Contact_Form with valid data, THE Homepage SHALL send the inquiry via Resend email service
3. WHEN the email is successfully sent, THE Contact_Form SHALL display a success message
4. IF the email fails to send, THEN THE Contact_Form SHALL display an error message
5. THE Contact_Form SHALL validate that the email field contains a valid email format before submission
6. THE Contact_Form SHALL validate that all required fields are filled before enabling the submit button

### Requirement 11: Mobile-First Responsive Design

**User Story:** As a mobile visitor, I want the website to work perfectly on my device, so that I can access all content and features regardless of screen size.

#### Acceptance Criteria

1. THE Homepage SHALL render correctly on viewports from 320px to 2560px width
2. THE Homepage SHALL use mobile-first CSS media queries for responsive breakpoints
3. THE Homepage SHALL display touch-friendly interactive elements with minimum 44x44px tap targets on mobile viewports
4. THE Homepage SHALL disable hover-dependent animations on touch devices
5. THE Homepage SHALL optimize font sizes for readability across all viewport sizes (minimum 16px body text on mobile)

### Requirement 12: Scroll-Triggered Animations

**User Story:** As a visitor, I want content to animate as I scroll, so that the browsing experience feels dynamic and engaging.

#### Acceptance Criteria

1. WHEN a section enters the viewport, THE Homepage SHALL trigger reveal animations for that section's content
2. THE Homepage SHALL use Framer Motion for scroll-triggered animations
3. THE Homepage SHALL stagger animation timing for multiple elements within a section
4. THE Homepage SHALL respect user's prefers-reduced-motion accessibility setting
5. IF the user has prefers-reduced-motion enabled, THEN THE Homepage SHALL disable all scroll-triggered animations

### Requirement 13: Custom Cursor Effect

**User Story:** As a desktop visitor, I want to see a custom cursor effect, so that the interaction feels polished and unique.

#### Acceptance Criteria

1. WHERE the viewport width is ≥1024px, THE Homepage SHALL display a custom cursor effect
2. THE custom cursor SHALL follow the mouse pointer position with smooth easing
3. WHEN the cursor hovers over interactive elements, THE custom cursor SHALL change size or color
4. THE Homepage SHALL hide the custom cursor on touch devices
5. THE custom cursor SHALL not interfere with native browser text selection

### Requirement 14: Performance - Largest Contentful Paint

**User Story:** As a visitor, I want the page to load quickly, so that I don't wait for content to appear.

#### Acceptance Criteria

1. THE Homepage SHALL achieve a Largest Contentful Paint (LCP) of less than 1.8 seconds on a simulated 4G connection
2. THE Homepage SHALL preload critical fonts and images
3. THE Homepage SHALL lazy-load images below the fold
4. THE Homepage SHALL use Next.js Image component for automatic image optimization
5. THE Homepage SHALL implement code splitting for Three.js and D3.js libraries

### Requirement 15: Performance - Lighthouse Score

**User Story:** As a visitor, I want the website to perform well across all metrics, so that I have a smooth and accessible experience.

#### Acceptance Criteria

1. THE Homepage SHALL achieve a Lighthouse Performance score of 95 or higher
2. THE Homepage SHALL achieve a Lighthouse Accessibility score of 95 or higher
3. THE Homepage SHALL achieve a Lighthouse Best Practices score of 95 or higher
4. THE Homepage SHALL achieve a Lighthouse SEO score of 95 or higher
5. THE Homepage SHALL be tested with Lighthouse in both mobile and desktop modes

### Requirement 16: TypeScript Type Safety

**User Story:** As a developer, I want the codebase to use TypeScript, so that type errors are caught at compile time.

#### Acceptance Criteria

1. THE Homepage SHALL be implemented using TypeScript with strict mode enabled
2. THE Homepage SHALL define TypeScript interfaces for all component props
3. THE Homepage SHALL define TypeScript types for all API responses and form data
4. THE Homepage SHALL produce zero TypeScript compilation errors
5. THE Homepage SHALL not use the 'any' type except where explicitly necessary with justification comments

### Requirement 17: Accessibility - Keyboard Navigation

**User Story:** As a keyboard user, I want to navigate the entire website using only my keyboard, so that I can access all features without a mouse.

#### Acceptance Criteria

1. THE Homepage SHALL support Tab key navigation through all interactive elements in logical order
2. THE Homepage SHALL display visible focus indicators on all focusable elements
3. WHEN a visitor presses Enter on an Anchor_Link, THE Homepage SHALL navigate to the corresponding section
4. THE Homepage SHALL support Escape key to close any modal or overlay components
5. THE Homepage SHALL not create keyboard traps that prevent navigation

### Requirement 18: Accessibility - Screen Reader Support

**User Story:** As a screen reader user, I want proper semantic markup and ARIA labels, so that I can understand the page structure and content.

#### Acceptance Criteria

1. THE Homepage SHALL use semantic HTML5 elements (header, nav, main, section, footer)
2. THE Homepage SHALL provide ARIA labels for all icon-only buttons
3. THE Homepage SHALL provide alt text for all meaningful images
4. THE Homepage SHALL use heading tags (h1-h6) in hierarchical order
5. THE Homepage SHALL announce dynamic content changes to screen readers using ARIA live regions

### Requirement 19: SEO Metadata

**User Story:** As a business owner, I want the website to be discoverable in search engines, so that potential clients can find TomNerb Digital Solutions online.

#### Acceptance Criteria

1. THE Homepage SHALL include a descriptive title tag containing "TomNerb Digital Solutions"
2. THE Homepage SHALL include a meta description summarizing the company's services
3. THE Homepage SHALL include Open Graph meta tags for social media sharing
4. THE Homepage SHALL include a canonical URL meta tag
5. THE Homepage SHALL include structured data markup (JSON-LD) for Organization schema

### Requirement 20: Error Handling for Contact Form

**User Story:** As a visitor, I want clear feedback when something goes wrong with the contact form, so that I know how to fix the issue.

#### Acceptance Criteria

1. IF a required field is empty on Contact_Form submission, THEN THE Contact_Form SHALL display a field-specific error message
2. IF the email format is invalid, THEN THE Contact_Form SHALL display "Please enter a valid email address"
3. IF the Resend API returns an error, THEN THE Contact_Form SHALL display "Unable to send message. Please try again later."
4. IF the network request fails, THEN THE Contact_Form SHALL display "Network error. Please check your connection."
5. THE Contact_Form SHALL clear error messages when the visitor corrects the input

### Requirement 21: Browser Compatibility

**User Story:** As a visitor, I want the website to work on my browser, so that I can access the content regardless of my browser choice.

#### Acceptance Criteria

1. THE Homepage SHALL function correctly on Chrome version 120 and above
2. THE Homepage SHALL function correctly on Firefox version 120 and above
3. THE Homepage SHALL function correctly on Safari version 17 and above
4. THE Homepage SHALL function correctly on Edge version 120 and above
5. THE Homepage SHALL display a graceful fallback for browsers that don't support WebGL (for Three.js Particle_Canvas)

### Requirement 22: Animation Performance

**User Story:** As a visitor, I want smooth animations without lag, so that the website feels responsive and professional.

#### Acceptance Criteria

1. THE Homepage SHALL maintain 60 frames per second (FPS) during all animations on devices with 4GB RAM or more
2. THE Homepage SHALL use CSS transforms and opacity for animations to leverage GPU acceleration
3. THE Homepage SHALL throttle or debounce scroll event listeners to prevent performance degradation
4. THE Particle_Canvas SHALL reduce particle count on lower-performance devices
5. THE Homepage SHALL use requestAnimationFrame for all JavaScript-driven animations

### Requirement 23: Content Management for Team Section

**User Story:** As a developer, I want team member data to be easily updatable, so that new team members can be added without code changes.

#### Acceptance Criteria

1. THE Team_Grid SHALL render team members from a structured data source (JSON or TypeScript constant)
2. THE team member data structure SHALL include fields for name, role, avatar URL, and bio
3. WHEN a new team member is added to the data source, THE Team_Grid SHALL automatically render the new profile
4. THE team member data SHALL support optional social media links (LinkedIn, GitHub, Twitter)
5. THE Team_Grid SHALL handle missing avatar images with a default placeholder

### Requirement 24: Content Management for Services Section

**User Story:** As a developer, I want service offerings to be easily updatable, so that services can be modified without extensive code changes.

#### Acceptance Criteria

1. THE Services_Grid SHALL render services from a structured data source (JSON or TypeScript constant)
2. THE service data structure SHALL include fields for title, description, icon, and optional link
3. WHEN a service is modified in the data source, THE Services_Grid SHALL reflect the changes
4. THE Services_Grid SHALL support exactly four services as per design requirements
5. THE service data SHALL validate that all required fields are present at build time

### Requirement 25: Analytics Integration Readiness

**User Story:** As a business owner, I want the ability to track visitor behavior, so that I can understand how users interact with the website.

#### Acceptance Criteria

1. THE Homepage SHALL include integration points for analytics tracking (Google Analytics or similar)
2. THE Homepage SHALL track Anchor_Link clicks as custom events
3. THE Homepage SHALL track Contact_Form submissions as conversion events
4. THE Homepage SHALL track scroll depth milestones (25%, 50%, 75%, 100%)
5. THE Homepage SHALL respect user privacy preferences and support opt-out mechanisms

### Requirement 26: Loading State Management

**User Story:** As a visitor, I want to see loading indicators for dynamic content, so that I know the website is working and not frozen.

#### Acceptance Criteria

1. WHILE the Contact_Form is submitting, THE submit button SHALL display a loading spinner
2. WHILE the Contact_Form is submitting, THE submit button SHALL be disabled to prevent duplicate submissions
3. WHILE heavy assets (Three.js, D3.js) are loading, THE Homepage SHALL display a loading indicator
4. WHEN all critical assets are loaded, THE Homepage SHALL remove the loading indicator with a fade-out animation
5. THE Homepage SHALL display skeleton screens for sections that load asynchronously

### Requirement 27: Typewriter Effect Implementation

**User Story:** As a visitor, I want to see the tagline appear with a typewriter effect, so that the hero section feels dynamic and engaging.

#### Acceptance Criteria

1. WHEN the Hero_Section loads, THE tagline SHALL animate character-by-character to simulate typing
2. THE typewriter effect SHALL complete within 3 seconds
3. THE typewriter effect SHALL include a blinking cursor during animation
4. WHEN the typewriter animation completes, THE cursor SHALL fade out
5. THE typewriter effect SHALL respect prefers-reduced-motion accessibility setting

### Requirement 28: Cambodia Map Visualization

**User Story:** As a visitor, I want to see an animated Cambodia map, so that I understand TomNerb's local presence and geographic focus.

#### Acceptance Criteria

1. THE About_Section SHALL display an SVG-based Cambodia map visualization
2. WHEN the About_Section enters the viewport, THE Cambodia map SHALL animate with a draw-in effect
3. THE Cambodia map SHALL highlight Phnom Penh or the company's location with an accent color marker
4. THE Cambodia map SHALL be styled to match the dark theme with accent color highlights
5. THE Cambodia map SHALL scale proportionally on different viewport sizes

### Requirement 29: Smooth Scroll Behavior

**User Story:** As a visitor, I want smooth scrolling between sections, so that navigation feels polished and intentional.

#### Acceptance Criteria

1. WHEN a visitor clicks an Anchor_Link, THE Homepage SHALL scroll to the target section with smooth easing
2. THE smooth scroll animation SHALL complete within 800 milliseconds
3. THE smooth scroll SHALL account for the Navigation_Bar height offset
4. THE Homepage SHALL support native CSS scroll-behavior: smooth where available
5. THE Homepage SHALL provide a JavaScript fallback for browsers that don't support smooth scrolling

### Requirement 30: Form Validation Feedback

**User Story:** As a visitor, I want real-time validation feedback on the contact form, so that I can correct errors before submitting.

#### Acceptance Criteria

1. WHEN a visitor leaves a required field empty and moves focus, THE Contact_Form SHALL display an error message for that field
2. WHEN a visitor enters an invalid email format, THE Contact_Form SHALL display an error message in real-time
3. WHEN a visitor corrects an invalid field, THE Contact_Form SHALL remove the error message immediately
4. THE Contact_Form SHALL display error messages in red color with sufficient contrast
5. THE Contact_Form SHALL display success validation with a green checkmark icon for valid fields
