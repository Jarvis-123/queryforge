import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  // LinkedInBot and other crawlers get blocking metadata in <head>.
  htmlLimitedBots: /.*/,
};

export default nextConfig;
