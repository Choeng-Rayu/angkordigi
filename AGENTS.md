# AGENTS.md - Coding Guidelines for AngkorDigi

## Project Overview

A Next.js 16 portfolio website for TomNerb Digital Solutions (Cambodia). Built with React 19, TypeScript, Tailwind CSS v4, and Framer Motion for animations.

## Build & Development Commands

```bash
# Development
npm run dev              # Start dev server on localhost:3000

# Build
npm run build            # Build production app
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint (flat config)
```

**Note:** No test runner is configured. To add tests, use `jest` or `vitest`.

## Critical: Next.js 16 Breaking Changes

This is **NOT** standard Next.js. This version has breaking changes:

- **ALWAYS** check `node_modules/next/dist/docs/` before using any API
- Heed deprecation notices in the codebase
- File structure and conventions may differ from standard Next.js
- Do not assume familiarity with Next.js 14/15 patterns

## Code Style Guidelines

### TypeScript

- **Strict mode enabled** - all code must pass strict type checking
- Use explicit types for function parameters and return values
- Prefer `interface` over `type` for object definitions
- Use `const` assertions for literal unions

```typescript
// Good
interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: "primary" | "secondary" | "ghost";
}

// Avoid implicit any
function process(data: unknown) { ... }
```

### Imports & Module Structure

```typescript
// 1. React/Next imports
import { useState, useEffect } from "react";
import { NextRequest, NextResponse } from "next/server";

// 2. External libraries
import { motion, type HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";

// 3. Absolute path aliases (@/*)
import { cn } from "@/lib/utils";
import { Button } from "@/app/components/ui/Button";

// 4. Relative imports (only when necessary)
import { ParticleCanvas } from "../components/ui/ParticleCanvas";
```

### Component Structure

```typescript
"use client"; // For client components only

// 1. Imports
import { useState } from "react";

// 2. Types/Interfaces
interface Props { }

// 3. Static data/constants
const variants = { ... };

// 4. Component
export function ComponentName({ prop }: Props) {
  // hooks
  // handlers
  return <div>...</div>;
}
```

### Naming Conventions

- **Components**: PascalCase (`Hero.tsx`, `Button.tsx`)
- **Functions**: camelCase (`handleClick`, `generateResponse`)
- **Types/Interfaces**: PascalCase (`ChatRequest`, `ButtonProps`)
- **Constants**: UPPER_SNAKE_CASE for true constants
- **Files**: PascalCase for components, camelCase for utilities

### Styling (Tailwind CSS v4)

- Use `@import "tailwindcss"` (v4 syntax, no directives)
- Theme colors defined in `globals.css` using CSS variables
- Use `cn()` utility from `@/lib/utils` for conditional classes
- Prefer `clsx` + `tailwind-merge` pattern for complex conditionals

```typescript
// Good
className={cn(
  "base-classes",
  conditional && "conditional-class",
  className
)}
```

### Custom CSS Classes

Available utilities in `globals.css`:
- `.glass` - Glassmorphism effect
- `.glow-hover` - Hover glow animation
- `.text-gradient` - Gradient text
- `.border-gradient` - Gradient border
- `.animate-fade-in`, `.animate-slide-in-*` - Animation utilities

### Error Handling

- API routes: Wrap in try/catch, return `NextResponse.json({ error: "..." }, { status: 500 })`
- Client components: Use error boundaries where appropriate
- Always log errors for debugging: `console.error("Context:", error)`

### Client vs Server Components

- **Server components** (default): No interactivity, fetch data
- **Client components**: `"use client"` directive, useState, useEffect, event handlers
- Keep client components as leaf nodes when possible

### Project Structure

```
app/
├── page.tsx              # Home page
├── layout.tsx            # Root layout
├── globals.css           # Global styles + Tailwind
├── api/                  # API routes
│   └── chat/
│       └── route.ts      # Chat API endpoint
├── components/
│   ├── ui/               # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── ParticleCanvas.tsx
│   └── layout/           # Layout components
│       └── Navbar.tsx
├── lib/                  # App-specific utilities
│   ├── chat.ts
│   └── animations.ts
└── sections/             # Page sections
    ├── Hero.tsx
    ├── About.tsx
    ├── Services.tsx
    ├── Team.tsx
    ├── Timeline.tsx
    ├── VisionMissionGoal.tsx
    └── Contact.tsx

lib/
└── utils.ts              # Shared utilities (cn function)
```

### Design System Colors

```css
--color-bg: #060810           /* Background */
--color-surface: #0D1117      /* Card surface */
--color-border: #1C2333       /* Borders */
--color-accent: #4F7CFF       /* Primary accent (blue) */
--color-neon: #00FFC2         /* Secondary accent (cyan) */
--color-text-primary: #F0F4FF /* Main text */
--color-text-muted: #7A8499   /* Secondary text */
```

### Animation Guidelines

- Use Framer Motion for React animations
- Custom CSS animations in `globals.css` for simple effects
- Standard durations: 300ms (hover), 600ms (entrance), 2000ms (counters)
- Use spring physics for interactive elements
- Stagger children animations for lists

### API Routes

- Use `NextRequest` and `NextResponse` from `next/server`
- Define request/response interfaces
- Validate inputs before processing
- Return appropriate HTTP status codes

### Key Dependencies

- `next`: ^16.2.4
- `react`: ^19.2.4
- `tailwindcss`: ^4
- `framer-motion`: ^12.4.7 (animations)
- `lucide-react`: ^0.475.0 (icons)
- `clsx` + `tailwind-merge`: Class name utilities
- `@anthropic-ai/sdk`: AI integration
- `resend`: Email service

### Environment Files

Do not commit `.env` files. The following are ignored:
- `.env`, `.env.local`, `.env.*.local`
- `node_modules/`, `.next/`, `out/`, `build/`
