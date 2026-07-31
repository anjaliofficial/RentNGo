import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.72.1"],
  async rewrites() {
    return [
      { source: "/api/:path*", destination: "http://localhost:5000/api/:path*" },
      { source: "/uploads/:path*", destination: "http://localhost:5000/uploads/:path*" },
    ];
  },
};

export default nextConfig;
