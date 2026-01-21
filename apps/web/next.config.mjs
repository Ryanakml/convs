/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],

  // 1. Matikan tracing excludes yang terlalu agresif dulu untuk testing
  experimental: {
    // Jika ingin mengecilkan output, fokus ke .map dan .d.ts saja
    outputFileTracingExcludes: {
      "*": ["**/node_modules/**/*.map", "**/node_modules/**/*.d.ts"],
    },
  },

  // 2. Hapus atau comment bagian Webpack minimize jika tidak ada alasan khusus
  // Biarkan Next.js handle optimasi module ID-nya sendiri
  /* webpack: (config, { isServer }) => {
    if (isServer) {
      config.optimization.minimize = false;
    }
    return config;
  },
  */
};

export default nextConfig;
