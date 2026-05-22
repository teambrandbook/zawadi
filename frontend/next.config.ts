import type { NextConfig } from "next";

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL is required. Add it to your .env.local file.\n" +
    "Example: NEXT_PUBLIC_API_URL=http://localhost:8000/api"
  );
}

// Derive media hostname from NEXT_PUBLIC_API_URL at build time so production
// images work without manually editing this file.
const apiOrigin = process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, "").replace(/\/$/, "");
let mediaHost = { protocol: "https" as "http" | "https", hostname: "localhost", port: undefined as string | undefined };
try {
  const parsed = new URL(apiOrigin);
  mediaHost = {
    protocol: parsed.protocol.replace(":", "") as "http" | "https",
    hostname: parsed.hostname,
    port: parsed.port || undefined,
  };
} catch {
  // fallback to localhost if URL is malformed
}

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "8000", pathname: "/media/**" },
      { protocol: "http", hostname: "localhost", port: "8000", pathname: "/recipes/**" },
      { protocol: "http", hostname: "localhost", port: "8000", pathname: "/profile_photos/**" },
      { protocol: "http", hostname: "127.0.0.1", port: "8000", pathname: "/media/**" },
      { protocol: "http", hostname: "127.0.0.1", port: "8000", pathname: "/recipes/**" },
      { protocol: "http", hostname: "127.0.0.1", port: "8000", pathname: "/profile_photos/**" },
      // Derived from NEXT_PUBLIC_API_URL — covers production automatically
      { protocol: mediaHost.protocol, hostname: mediaHost.hostname, ...(mediaHost.port ? { port: mediaHost.port } : {}), pathname: "/media/**" },
      { protocol: mediaHost.protocol, hostname: mediaHost.hostname, ...(mediaHost.port ? { port: mediaHost.port } : {}), pathname: "/recipes/**" },
      { protocol: mediaHost.protocol, hostname: mediaHost.hostname, ...(mediaHost.port ? { port: mediaHost.port } : {}), pathname: "/profile_photos/**" },
      // Google profile photos
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      // Cloudinary profile photos
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
