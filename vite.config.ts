/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

import { NOME_APP, DESCRICAO_APP } from './src/marca';
import { calcularBase } from './src/lib/base';

// Caminho base detectado automaticamente na publicação (ver src/lib/base.ts):
// "/" em drlucasoares.github.io, "/Plantaoapp/" enquanto o repositório tiver esse nome.
const BASE = calcularBase(process.env.BASE_PATH);

export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: `${NOME_APP} — ${DESCRICAO_APP}`,
        short_name: NOME_APP,
        description: `${DESCRICAO_APP}. Não substitui o julgamento clínico.`,
        lang: 'pt-BR',
        start_url: BASE,
        scope: BASE,
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#0f1419',
        theme_color: '#0f1419',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,json}'],
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    globals: false,
  },
});
