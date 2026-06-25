import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.loca.lt", "*.trycloudflare.com"],
  async redirects() {
    // Merged/retired service pages → their new canonical landing pages.
    return [
      {
        source: "/:lang(en|el)/services/private-chauffeur",
        destination: "/:lang/services/on-disposal-chauffeur",
        permanent: true,
      },
      {
        source: "/:lang(en|el)/services/on-disposal-driver",
        destination: "/:lang/services/on-disposal-chauffeur",
        permanent: true,
      },
      {
        source: "/:lang(en|el)/services/per-route-transfers",
        destination: "/:lang/services",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
