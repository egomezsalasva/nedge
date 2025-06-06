import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
