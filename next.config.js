const { withNetlify } = require('@netlify/next')

let userConfig = {}
try {
  userConfig = require('./v0-user-next.config.js')
} catch (e) {
  try {
    userConfig = require('./v0-user-next.config')
  } catch (innerError) {
    userConfig = {}
  }
}

/** @type {import('next').NextConfig} */
let nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
}

// Merge user config if any
for (const key in userConfig) {
  if (
    typeof nextConfig[key] === 'object' &&
    !Array.isArray(nextConfig[key])
  ) {
    nextConfig[key] = {
      ...nextConfig[key],
      ...userConfig[key],
    }
  } else {
    nextConfig[key] = userConfig[key]
  }
}

module.exports = withNetlify(nextConfig)
