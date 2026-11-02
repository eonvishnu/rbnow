import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  allowedDevOrigins: ['10.38.67.249', 'localhost', '127.0.0.1'],
  turbopack: { root: path.resolve(process.cwd(), '..') },
};

export default nextConfig;
