/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      '@react-native-async-storage/async-storage': false,
    };
    
    // Ignore specific warnings
    config.ignoreWarnings = [
      /Module not found: Can't resolve '@react-native-async-storage\/async-storage'/,
    ];

    return config;
  },
  // Fix the workspace root warning
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;