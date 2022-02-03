const nextBuildId = require('next-build-id')
const withPlugins = require('next-compose-plugins')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

const nextConfiguration = {
  images: {
    domains: ['orgbling.s3.amazonaws.com']
  },
  eslint: {
    // Warning: Dangerously allow production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true
  },
  generateBuildId: async () => nextBuildId({ dir: __dirname })
}

module.exports = withPlugins([withBundleAnalyzer], nextConfiguration)
