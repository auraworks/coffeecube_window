import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Electron 패키징을 위한 standalone 모드
};

export default nextConfig;
