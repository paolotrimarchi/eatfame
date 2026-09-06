/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'eatfame.com' },
    ],
  },
};

export default nextConfig;
