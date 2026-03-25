import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "committed-growth-070b6aa043.media.strapiapp.com",
        port: "",
        pathname: "/**",
      },

      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "1337",
        pathname: "/uploads/**",
      },

      {
        hostname: "vienkhongni.com",
        protocol: "https",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        port: "",
        pathname: "/vi/**",
      },
    ],
    // unoptimized: process.env.NODE_ENV === "development",
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: "/wp-sitemap.xml",
        destination: "/",
        permanent: true,
      },
      {
        source: "/wp-(.*)",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
