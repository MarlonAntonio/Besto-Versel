// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
    output: 'server',
    adapter: vercel({
        webAnalytics: true,
        speedInsights: true,
        imageService: true,
    }),
    integrations: [
        tailwind(), 
        react()
    ],
    vite: {
        build: {
            cssCodeSplit: true,
            minify: 'terser',
            terserOptions: {
                compress: {
                    drop_console: true,
                    drop_debugger: true
                }
            },
            rollupOptions: {
                output: {
                    manualChunks: {
                        'vendor': ['react', 'react-dom'],
                    }
                }
            }
        },
        ssr: {
            noExternal: ['@astrojs/*']
        }
    },
    image: {
        service: {
            entrypoint: 'astro/assets/services/sharp'
        },
        domains: ['cdn.jsdelivr.net'],
        remotePatterns: [
            {
                protocol: 'https'
            }
        ]
    }
});
