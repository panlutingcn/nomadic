import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['html2canvas', 'qrcode'],
  },
};

export default nextConfig;
