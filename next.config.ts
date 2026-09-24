import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "white-velvet.se",
        pathname: "/ws/media-library/**",
      },
    ],
  },
};

export default nextConfig;
