/** @type {import('next').NextConfig} */
const nextConfig = {
  // pdf-parse는 서버 전용 — 클라이언트 번들에서 제외 (Next.js 14)
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse"],
  },
};

export default nextConfig;
