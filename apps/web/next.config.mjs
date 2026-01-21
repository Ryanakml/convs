/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  experimental: {
    outputFileTracingExcludes: {
      "*": [
        "**/node_modules/**/*.map",
        "**/node_modules/**/*.d.ts",
        "**/node_modules/**/*.json",
      ],
    },
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.optimization.minimize = false;
    }
    return config;
  },
};

export default nextConfig;
