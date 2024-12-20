import dotenv from 'dotenv';
import path from 'path';
import { NextConfig } from 'next';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/:path*',
      },
    ];
  },
  images: {
    domains: ['videogamewingman.com'],
  },
  env: {
    NEXT_PUBLIC_TWITCH_CLIENT_ID: process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID || '',
    TWITCH_CLIENT_SECRET: process.env.TWITCH_CLIENT_SECRET || '',
    TWITCH_REDIRECT_URI: process.env.TWITCH_REDIRECT_URI || '',
    RAWG_API_KEY: process.env.RAWG_API_KEY || '',
    MONGODB_URI: process.env.MONGODB_URI || '',
    NEXT_PUBLIC_DOMAIN: 'https://videogamewingman.com',
  },
};

export default nextConfig;