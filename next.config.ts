import type { NextConfig } from "next";

// In production the browser calls same-origin /api/* paths. Next rewrites them to
// the Express API on the server, which also avoids cross-origin/CORS problems.
const configuredApi = process.env.NEXT_PUBLIC_API_URL || "";
const productionApi =
  configuredApi && !/localhost|127\.0\.0\.1/.test(configuredApi)
    ? configuredApi.replace(/\/$/, "")
    : "https://salonbook-server-one-mu.vercel.app";

const apiPrefixes = ["services", "admin", "appointments", "payments", "me", "upload", "dashboard"];

const nextConfig: NextConfig = {
  async rewrites() {
    return apiPrefixes.map((prefix) => ({
      source: `/api/${prefix}/:path*`,
      destination: `${productionApi}/api/${prefix}/:path*`,
    }));
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
