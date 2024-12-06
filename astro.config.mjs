// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    mode: 'directory',
    runtime: {
      mode: 'local',
      type: 'pages'
    }
  }),
  integrations: [
    tailwind({
      // Minificar CSS en producción
      minify: true,
      // Configuración de purge para CSS
      config: { 
        purge: {
          enabled: true,
          content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}']
        }
      }
    }),
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
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'ui-components': [
              '@cloudflare/stream-react'
            ]
          }
        }
      }
    },
    ssr: {
      noExternal: ['@cloudflare/stream-react']
    },
    optimizeDeps: {
      exclude: ['@cloudflare/stream-react']
    }
  },
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
    assets: 'assets'
  }
});
