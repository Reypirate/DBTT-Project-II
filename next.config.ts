import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["gsap", "lenis", "recharts"],
  turbopack: {
    root: "./",
  },
};

export default nextConfig;
