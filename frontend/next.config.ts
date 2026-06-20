import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:4000/api/:path*",
      },
      {
        source: "/_states/:path*",
        destination: "/states/:path*",
      },
    ];
  },
};

export default nextConfig;
