import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "llwwfgqomveahcsiavaj.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  redirects: async () => {
    return [
      {
        source: "/account",
        destination: "/account/bookmarks",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
