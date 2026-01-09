# Pict'Oh - Development Documentation

## Project Overview

Pict'Oh is a tablet-based communication application using pictograms. Users click on images that are read aloud, enabling easier communication.

## Key Requirements (from AGENTS.md)

### Platform
- **Target**: Tablets only
- **Orientation**: Portrait only (locked)
- **Language**: French only

### Core Features
1. **6x4 Grid**: 24 squares with rounded corners
2. **Edit Mode**: Activated by clicking any square 5 times
3. **Text-to-Speech**: Local TTS, female voice, French
4. **Page System**: Multiple pages with navigation
5. **Offline-First**: Works 100% offline after first launch
6. **Persistence**: Auto-save everything to localStorage

### Technical Stack
- React 19 + TypeScript
- Material UI for components
- Valtio for state management
- Tailwind CSS (minimal usage)
- Nx for monorepo
- Vite for bundling

## Architecture

### State Management (Valtio)

The application uses a single global state (`appState`) with automatic persistence:

```typescript
appState = {
  homePageName: "Accueil",
  pages: Page[],
  pictures: Picture[],
  currentPageName: string,
  isEditMode: boolean
}
```

Every state change triggers an automatic save to localStorage.

### Data Models

#### Square
- `id`: 0-23 (position in grid)
- `selectedPicture`: picture ID or undefined
- `associatedText`: text to speak
- `displayTextAbovePicture`: boolean
- `openPageName`: target page for navigation

#### Page
- `pageName`: unique identifier
- `squares`: array of 24 Square objects

#### Picture
- `id`: unique identifier (filename without extension)
- `fileName`: full filename
- `text`: display text (default = capitalized id)
- `isFavorite`: becomes true when used

### Component Structure

```
App (ThemeProvider + portrait lock)
└── Grid
    ├── EditModeBar (conditional)
    │   ├── CreatePageDialog
    │   └── ManagePagesDialog
    ├── Square (x24)
    └── EditSquareModal
```

## User Interactions

### Normal Mode
1. Click square → Read `associatedText` aloud
2. If `openPageName` set → Navigate after speech
3. Click any square 5 times → Activate edit mode

### Edit Mode
1. Top bar appears with:
   - Create new page
   - Manage pages
   - Exit edit mode
2. Click square → Open EditSquareModal
3. Modal allows:
   - Select picture from library
   - Edit text
   - Toggle text position
   - Set navigation target

## Picture System

### Storage
Pictures are in `public/assets/pictures/` as SVG files.

### Loading
- Lazy loaded on demand
- Metadata stored in state
- Becomes favorite when used

### Search & Filter
- Alphabetical sorting
- Text-based search
- Favorites-only filter (default)

## Persistence

All data saved to localStorage under key: `pictho-config`

Saved data:
- All pages and their squares
- Picture metadata and favorites
- Current page
- Edit mode state

## Text-to-Speech

Uses Web Speech API (browser native):
- Language: `fr-FR`
- Rate: 0.9
- Attempts to select female voice
- Falls back to any French voice

## Future Development

### Offline-First Completion
1. Add Service Worker
2. Cache all assets
3. Add Web Worker for downloads
4. Create loading screen with progress

### TTS Enhancement
Use a local TTS model instead of Web Speech API:
- Download model on first launch
- Cache for offline use
- Ensure female voice

### Picture Library
- Expand pictogram collection
- Dynamic picture loading
- Picture categories

## Testing

```bash
# Development
npm start

# Build
npm run build

# E2E tests (placeholder)
npm test
```

## Common Tasks

### Add a New Picture
1. Add SVG to `public/assets/pictures/name.svg`
2. Add entry to `src/utils/pictureLoader.ts`:
   ```typescript
   'name',  // in samplePictures array
   ```

### Add a New Component
1. Create in `src/components/ComponentName.tsx`
2. Import where needed
3. Follow existing patterns (TypeScript, Material UI)

### Modify State
Use actions from `src/state/appState.ts`:
```typescript
import { actions } from '../state/appState';

actions.createPage(pageName);
actions.updateSquare(pageIndex, squareId, updates);
```

## Debugging

### State Issues
Check browser console and localStorage:
```javascript
localStorage.getItem('pictho-config')
```

### TTS Issues
Check browser compatibility:
```javascript
'speechSynthesis' in window
window.speechSynthesis.getVoices()
```

### Portrait Lock
Note: Only works on mobile devices, not desktop browsers.

## Known Limitations

1. **TTS**: Uses browser API (limited offline support)
2. **Offline**: Not fully implemented (requires Service Worker)
3. **Pictures**: Currently hardcoded list (needs dynamic loading)
4. **Orientation Lock**: May not work in all browsers

## Contact & Contribution

This project follows the specifications from AGENTS.md. Any changes should respect the original requirements:
- Tablet-only, portrait orientation
- French language
- Offline-first after first launch
- Clean, maintainable code
