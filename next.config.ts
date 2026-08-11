import type { NextConfig } from "next";
import { getSecurityHeaders } from "./security-headers";

const development = process.env.NODE_ENV !== "production";
const securityHeaders = getSecurityHeaders({ development, https: !development });

const nextConfig: NextConfig = {
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: Object.entries(securityHeaders).map(([key, value]) => ({ key, value })),
      },
    ];
  },
};

export default nextConfig;
