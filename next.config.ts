import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This Next 16.3.4 canary + React 19.2 + Turbopack combination throws a
  // spurious "Maximum update depth exceeded" from its own dev overlay on
  // every route (reproduces even on a page with zero hooks) — disabling the
  // dev indicator and strict double-invoke silences it; unrelated to app code.
  reactStrictMode: false,
  devIndicators: false,
};

export default nextConfig;
