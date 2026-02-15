/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { VitePWA } from 'vite-plugin-pwa';
import { compression } from 'vite-plugin-compression2';
import { imagetools } from 'vite-imagetools';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/apps/pictho-app',
  server: {
    port: 4200,
    host: 'localhost',
  },
  preview: {
    port: 4200,
    host: 'localhost',
  },
  plugins: [
    react(), 
    nxViteTsPaths(), 
    nxCopyAssetsPlugin(['*.md']),
    // Image optimization
    imagetools(),
    // Compression for production builds
    compression({
      algorithm: 'gzip',
      exclude: [/\.(br)$/, /\.(gz)$/],
    }),
    compression({
      algorithm: 'brotliCompress',
      exclude: [/\.(br)$/, /\.(gz)$/],
    }),
    // PWA support with service worker (basic setup, will be customized in Task 3.1)
    VitePWA({
      registerType: 'autoUpdate',
      manifest: false, // Using existing manifest.json
      workbox: {
        // Placeholder configuration - will be enhanced in Task 3.1
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,svg,woff,woff2}'],
        runtimeCaching: [],
      },
      // Don't generate service worker yet - will be customized in Task 3.1
      injectRegister: false,
      strategies: 'generateSW',
    }),
  ],
  // Uncomment this if you are using workers.
  // worker: {
  //   plugins: () => [ nxViteTsPaths() ],
  // },
  build: {
    outDir: '../../dist/apps/pictho-app',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    // Source maps for debugging
    sourcemap: true,
    // Code splitting strategy
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'mui-vendor': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          'state-vendor': ['valtio'],
        },
        // Asset naming for better cache control
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // Minification
    minify: 'esbuild',
    // Asset optimization
    assetsInlineLimit: 4096, // 4kb - inline small assets as base64
    // CSS code splitting
    cssCodeSplit: true,
    // Target modern browsers (tablets typically run modern browsers)
    target: 'es2020',
  },
  test: {
    name: 'pictho-app',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/pictho-app',
      provider: 'v8' as const,
    },
  },
}));
