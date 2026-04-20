/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  serverActions: {
    bodySizeLimit: '50mb', // Allow larger audio/image uploads
  },
}

export default nextConfig
