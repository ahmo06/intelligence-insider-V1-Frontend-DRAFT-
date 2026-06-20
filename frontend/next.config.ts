import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:4000/api/:path*",
      },
      {
        source: "/_next/static/:path*",
        destination: "/captured-static/_next/static/:path*",
      },
      {
        source: "/fonts/:path*",
        destination: "/captured-static/fonts/:path*",
      },
    ];
  },
};

export default nextConfig;
