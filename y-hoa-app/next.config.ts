import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "upload.wikimedia.org", pathname: "/**" },
      { protocol: "https", hostname: "cdn.pixabay.com", pathname: "/**" },
      { protocol: "https", hostname: "tracuuduoclieu.vn", pathname: "/**" },
      { protocol: "https", hostname: "bvyhctbaoloc.vn", pathname: "/**" },
      { protocol: 'https', hostname: 'i.vnecdn.net', pathname: '/**' },
      { protocol: 'https', hostname: 'vcdn-vnexpress.vnecdn.net', pathname: '/**' },
      // Bổ sung các host ảnh RSS phổ biến
      { protocol: 'https', hostname: 'i1-suckhoe.vnecdn.net', pathname: '/**' },
      { protocol: 'https', hostname: 'i1-vnexpress.vnecdn.net', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn.tuoitre.vn', pathname: '/**' },
      { protocol: 'https', hostname: 'photo.znews.vn', pathname: '/**' },
      { protocol: 'https', hostname: 'dantri.com.vn', pathname: '/**' },
    ],
  },
};

export default nextConfig;
