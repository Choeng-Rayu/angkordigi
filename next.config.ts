import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack configuration (Next.js 16 default bundler)
  // Keep empty to use Turbopack defaults - webpack config is used for production builds
  turbopack: {},

  // Image optimization configuration
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Compression for gzip/brotli
  compress: true,

  // Production optimizations
  productionBrowserSourceMaps: false,
  poweredByHeader: false,

  // Build output configuration
  output: "standalone",

  // Experimental features for performance
  experimental: {
    // Optimize package imports for commonly used libraries
    optimizePackageImports: [
      "framer-motion",
      "lucide-react",
    ],
    // CSS optimization
    cssChunking: true,
  },

  // Webpack optimization (production builds only)
  // Note: Development uses Turbopack by default in Next.js 16
  webpack: (config, { isServer, dev }) => {
    // Code splitting optimization - only applied in production
    if (!isServer && !dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            // Vendor libraries
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              chunks: "all",
              priority: 10,
            },
            // Framer Motion chunk
            framer: {
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              name: "framer-motion",
              chunks: "all",
              priority: 20,
            },
            // Lucide icons chunk
            lucide: {
              test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
              name: "lucide",
              chunks: "all",
              priority: 20,
            },
            // Common UI components
            ui: {
              test: /[\\/]app[\\/]components[\\/]ui[\\/]/,
              name: "ui-components",
              chunks: "all",
              priority: 15,
            },
          },
        },
        // Module concatenation for tree shaking
        concatenateModules: true,
        // Remove unused code
        usedExports: true,
        // Side effects optimization
        sideEffects: false,
      };
    }

    return config;
  },

  // HTTP headers configuration
  async headers() {
    const securityHeaders = [
      {
        key: "X-DNS-Prefetch-Control",
        value: "on",
      },
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
      {
        key: "X-Frame-Options",
        value: "SAMEORIGIN",
      },
      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },
      {
        key: "X-XSS-Protection",
        value: "1; mode=block",
      },
      {
        key: "Referrer-Policy",
        value: "origin-when-cross-origin",
      },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
    ];

    return [
      {
        // Apply security headers to all routes
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Cache control for static assets
        source: "/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },

    {
      // Cache control for media files
      source: "/:path*.{jpg,jpeg,png,svg,webp,avif}",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
      {
        // Cache control for fonts
        source: "/:path*.woff2",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Vary",
            value: "Accept-Encoding",
          },
        ],
      },
    // Note: Cache-Control for _next/static is handled by Next.js automatically
    // Custom headers removed to avoid conflicts with Turbopack
    ];
  },

  // Redirects configuration
  async redirects() {
    return [];
  },

  // Rewrites configuration
  async rewrites() {
    return [];
  },
};

export default nextConfig;
