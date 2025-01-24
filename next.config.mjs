/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pslbqnqjaqwcmltvidho.supabase.co',
        pathname: '/storage/v1/object/public/listingImages/**',
      },
    ],
  },
};

export default nextConfig;
