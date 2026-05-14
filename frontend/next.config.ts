import type { NextConfig } from "next";

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL is required. Add it to your .env.local file.\n" +
    "Example: NEXT_PUBLIC_API_URL=http://localhost:8000/api"
  );
}

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "8000", pathname: "/media/**" },
      { protocol: "http", hostname: "127.0.0.1", port: "8000", pathname: "/media/**" },
      // Production: add your server's hostname/IP before deploying:
      // { protocol: "https", hostname: "your-domain.com", pathname: "/media/**" },
    ],
  },
};

export default nextConfig;
