import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["images.unsplash.com"],
  },

  // Tắt Dev Indicators
  devIndicators: false,
};

export default nextConfig;
