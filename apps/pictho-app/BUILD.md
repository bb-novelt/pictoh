# Build Tools Configuration

This document describes the build tools configuration for the Pict'Oh application.

## Build System

The application uses **Vite** as the build tool, configured via `vite.config.mts`.

### Key Features

1. **Production Build Optimizations**
   - ES2020 target for modern browsers (tablets)
   - ESBuild minification for fast builds
   - Tree shaking to eliminate dead code
   - Asset inlining for small files (< 4KB)

2. **Code Splitting Strategy**
   - **react-vendor**: React, React DOM, React Router
   - **mui-vendor**: Material UI and Emotion styling libraries
   - **state-vendor**: Valtio state management
   - **Main bundle**: Application code
   
   This strategy enables:
   - Better browser caching (vendor code rarely changes)
   - Faster page loads (parallel downloads)
   - Reduced initial bundle size

3. **Source Maps**
   - Full source maps generated for debugging
   - Maps stored separately (.map files)
   - Enable debugging of production builds

4. **Asset Optimization Pipeline**
   - **Image Optimization**: vite-imagetools for automatic image processing
   - **Compression**: Dual compression strategy
     - Gzip (.gz) for broad compatibility
     - Brotli (.br) for better compression ratios
   - Assets organized by type in output directory

5. **PWA & Service Worker** (Prepared for Task 3.1)
   - vite-plugin-pwa configured with basic setup
   - Service worker generation ready for customization
   - Workbox integration for offline support
   - Configuration will be enhanced in Epic 3

## Build Commands

```bash
# Development build with hot reload
npx nx serve pictho-app

# Production build
npx nx build pictho-app

# Preview production build locally
npx nx preview pictho-app
```

## Output Structure

```
dist/apps/pictho-app/
├── index.html              # Entry point (compressed: .gz, .br)
├── manifest.json           # PWA manifest (compressed)
├── favicon.ico             # App icon
├── sw.js                   # Service worker
├── workbox-*.js           # Workbox runtime
└── assets/
    ├── css/
    │   └── index-[hash].css     # Styles (compressed)
    ├── js/
    │   ├── index-[hash].js      # Main bundle (compressed)
    │   ├── react-vendor-[hash].js   # React chunk
    │   ├── mui-vendor-[hash].js     # MUI chunk
    │   ├── state-vendor-[hash].js   # Valtio chunk
    │   └── *.map                # Source maps
    └── [ext]/
        └── [name]-[hash].[ext]  # Other assets
```

## Performance Characteristics

- **Code Splitting**: Vendor chunks cached separately from app code
- **Compression**: ~70% size reduction with Brotli, ~60% with Gzip
- **Source Maps**: Available but separate from production bundles
- **Hashed Filenames**: Enables long-term caching strategies

## Future Enhancements

These will be implemented in later tasks:

- **Task 3.1**: Custom service worker with offline-first caching
- **Task 3.2**: Asset caching strategy for picture library
- **Task 3.3**: Web Worker setup for background tasks
- **Epic 8**: Picture library optimization and loading

## Dependencies

Build-time dependencies:
- `vite` - Build tool and dev server
- `@vitejs/plugin-react` - React support
- `vite-plugin-pwa` - PWA and service worker support
- `vite-plugin-compression2` - Asset compression
- `vite-imagetools` - Image optimization
- `@nx/vite` - Nx integration
