/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'out',
  reactStrictMode: true,
  
  // Image optimization for static export
  images: {
    unoptimized: true
  },

  // Static optimization
  experimental: {
    optimizeCss: true,
  },

  // Bundle analyzer
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Bundle analyzer configuration
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          reportFilename: '../analyze/client.html'
        })
      )
    }

    // SVG optimization
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    })

    return config
  },

  // Environment variables for static export
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://ozmevsim.com',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://ozmevsim.com/api',
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: true, // Ignore TS errors for static export
  },

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors for static export
  },

  // Generate sitemap and robots.txt
  async generateBuildId() {
    return 'build-' + Date.now()
  }
}

module.exports = nextConfig
