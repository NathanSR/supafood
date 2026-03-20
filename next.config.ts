import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vvjwivwmrquzjnmhveit.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Ensure we use standalone output for potential simpler deployments (optional)
  // output: 'standalone',
  experimental: {
    // No Next.js 16+, perfis de cache customizados devem ser registrados aqui
    cacheLife: {
      layout: {
        stale: 3600,    // Tempo em segundos que o dado é considerado 'fresco' (1 hora)
        revalidate: 86400, // Tempo para revalidação total (24 horas)
        expire: 604800,   // Tempo máximo de vida no cache (1 semana)
      },
    },
  },
};

export default withNextIntl(nextConfig);
