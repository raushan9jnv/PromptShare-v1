import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "siziyuklzcqbexvyncli.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // Some Supabase projects use CDN hostnames; keeping a safe wildcard helps.
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;
