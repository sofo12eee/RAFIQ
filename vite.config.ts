import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5174,
    allowedHosts: true,
  },
  plugins: [react(), tailwindcss(), VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.svg', 'logo.png'],
    manifest: {
      name: 'رفيق - المرافق الرقمي لمريض السرطان',
      short_name: 'رفيق',
      description: 'كل ما لم يقوله لك الطبيب، تلقاه هنا',
      theme_color: '#0d9488',
      background_color: '#f0fdfa',
      display: 'standalone',
      dir: 'rtl',
      lang: 'ar-DZ',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
      ]
    },
    workbox: {
      runtimeCaching: [
        {
          urlPattern: /^https?.*/,
          handler: 'NetworkFirst',
          options: { cacheName: 'rafiq-cache' }
        }
      ]
    }
  }), cloudflare()],
})