import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.loca.lt", "*.trycloudflare.com"],
  async redirects() {
    // Greek is disabled for now — permanently redirect all /el URLs to the
    // English equivalents so stale links and indexed pages resolve (and
    // search engines drop the Greek pages). Listed first so /el paths never
    // reach the service-page rules below.
    return [
      {
        source: "/el/:path*",
        destination: "/en/:path*",
        permanent: true,
      },
      // Merged/retired service pages → their new canonical landing pages.
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
