import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  assetPrefix: '',
  images: {
    remotePatterns: [
      new URL('https://ejxzslfkaxsbcabuiqzs.supabase.co/storage/v1/object/public/**'),
      new URL('https://image.tmdb.org/t/p/**'),
      new URL('http://k.kakaocdn.net/**'),
      new URL('https://randomuser.me/api/portraits/med/men/**'),
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb', // 요청 본문 크기 제한을 4MB로 설정
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/assets': path.resolve(__dirname, 'public/assets'),
    };
    return config;
  },
};

export default nextConfig;
