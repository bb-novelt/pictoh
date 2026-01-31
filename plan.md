# 📋 Pict'Oh - Implementation Plan

**Project**: Pict'Oh (pictoh)  
**Type**: Offline-first tablet application (React + TypeScript + Nx)  
**Created**: 2026-01-31

---

## 🎯 Project Overview

Pict'Oh is an offline-first, tablet-optimized communication board application built with React, TypeScript, and Material UI. The app displays a 6×4 grid of customizable squares that can contain pictures and associated text. Users can navigate between pages, and the app reads text aloud using local text-to-speech when squares are tapped.

---

## 📊 Epic Structure

### Epic 1: Project Initialization & Infrastructure Setup
### Epic 2: Core Data Models & State Management
### Epic 3: Offline-First Architecture
### Epic 4: Main Grid Layout & Basic UI
### Epic 5: Square Interaction & TTS Integration
### Epic 6: Edit Mode & Configuration
### Epic 7: Page Management System
### Epic 8: Picture Management & Selection
### Epic 9: Persistence & Storage
### Epic 10: Polish & Testing

---

## 📝 Detailed Task Breakdown

---

## Epic 1: Project Initialization & Infrastructure Setup

**Goal**: Set up Nx monorepo with React application and all required dependencies

### 1.1 Initialize Nx Workspace
- [ ] Create new Nx workspace with React preset
- [ ] Configure workspace to support future Next.js apps
- [ ] Set up workspace structure:
  - `apps/` - for applications
  - `libs/` - for shared libraries
- [ ] Configure TypeScript strict mode
- [ ] Set up path aliases for clean imports

### 1.2 Create React Frontend Application
- [ ] Generate React app using Nx generator
  - Name: `pictho-app` or `frontend`
  - Framework: React with TypeScript
- [ ] Configure app for tablet-only viewport
- [ ] Set portrait orientation lock in manifest/config
- [ ] Remove unnecessary boilerplate files

### 1.3 Install Core Dependencies
- [ ] Install Material UI (`@mui/material`, `@emotion/react`, `@emotion/styled`)
- [ ] Install Material Icons (`@mui/icons-material`)
- [ ] Install Tailwind CSS and configure
- [ ] Install Valtio for state management
- [ ] Install type definitions for all packages

### 1.4 Configure Build Tools
- [ ] Configure Vite/Webpack for production builds
- [ ] Set up code splitting strategy
- [ ] Configure service worker for offline support
- [ ] Set up asset optimization pipeline
- [ ] Configure source maps for debugging

### 1.5 Development Environment Setup
- [ ] Configure ESLint with React/TypeScript rules
- [ ] Configure Prettier for code formatting
- [ ] Set up Git hooks (husky) for pre-commit checks
- [ ] Create `.editorconfig` for consistent code style
- [ ] Set up VS Code workspace settings (optional)

---

## Epic 2: Core Data Models & State Management

**Goal**: Define TypeScript types and Valtio state structure for the entire application

### 2.1 Define TypeScript Types
- [ ] Create `types/` directory in shared library
- [ ] Define `Picture` interface:
  - `id: string`
  - `fileName: string`
  - `path: string`
  - `defaultText: string`
  - `isFavorite: boolean`
- [ ] Define `Square` interface:
  - `id: string`
  - `position: { row: number, col: number }`
  - `selectedPicture: Picture | null`
  - `associatedText: string`
  - `displayTextAbovePicture: boolean`
  - `openPageName: string`
- [ ] Define `Page` interface:
  - `pageName: string`
  - `squares: Square[]` (24 items, 6×4 grid)
- [ ] Define `AppConfig` interface:
  - `homePageName: string`
  - `pages: Page[]`
  - `currentPageName: string`
  - `isEditMode: boolean`
  - `favoritePictures: string[]` (picture IDs)
  - `isFirstLaunch: boolean`
  - `cacheStatus: CacheStatus`

### 2.2 Create Valtio State Store
- [ ] Create `state/store.ts` with main application state
- [ ] Initialize store with default values
- [ ] Create default "Home" page structure
- [ ] Implement state utility functions:
  - `getCurrentPage()`
  - `getSquareAtPosition(row, col)`
  - `updateSquare(squareId, updates)`
  - `addPage(pageName)`
  - `deletePage(pageName)`
  - `renamePage(oldName, newName)`

### 2.3 Create State Actions
- [ ] Create `actions/` directory
- [ ] Implement page actions:
  - `createPage(name: string)`
  - `deletePage(name: string)`
  - `renamePage(oldName: string, newName: string)`
  - `navigateToPage(name: string)`
- [ ] Implement square actions:
  - `updateSquareContent(squareId, picture, text)`
  - `toggleTextDisplay(squareId)`
  - `setSquareNavigation(squareId, targetPage)`
- [ ] Implement edit mode actions:
  - `toggleEditMode()`
  - `activateEditMode()`
  - `deactivateEditMode()`
- [ ] Implement favorites actions:
  - `addToFavorites(pictureId)`
  - `removeFromFavorites(pictureId)`

---

## Epic 3: Offline-First Architecture

**Goal**: Implement service worker, caching strategy, and background downloads

### 3.1 Service Worker Setup
- [ ] Create custom service worker file
- [ ] Configure service worker registration in main app
- [ ] Implement cache-first strategy for app shell
- [ ] Implement network-first fallback to cache for assets
- [ ] Handle service worker lifecycle events

### 3.2 Asset Caching Strategy
- [ ] Create cache manifest for static assets
- [ ] Implement precaching for critical resources:
  - App bundle (JS/CSS)
  - Material UI fonts
  - Core icons
- [ ] Implement runtime caching for pictures
- [ ] Set cache expiration policies

### 3.3 Web Worker for Background Tasks
- [ ] Create Web Worker for background downloads
- [ ] Implement picture library download logic
- [ ] Implement TTS model download logic
- [ ] Add progress tracking for downloads
- [ ] Implement message passing between main thread and worker

### 3.4 First Launch Experience
- [ ] Create `FirstLaunchLoader` component
- [ ] Show progress bar with percentage
- [ ] Track download progress for:
  - App assets (30%)
  - Picture library (40%)
  - TTS model (30%)
- [ ] Store first launch completion flag
- [ ] Handle download errors gracefully

### 3.5 Offline Detection & Feedback
- [ ] Implement online/offline detection
- [ ] Show offline indicator in UI (optional, subtle)
- [ ] Ensure all features work offline after first launch
- [ ] Test full offline functionality

---

## Epic 4: Main Grid Layout & Basic UI

**Goal**: Create the main 6×4 grid layout with Material UI components

### 4.1 App Layout Structure
- [ ] Create `Layout` component with portrait lock
- [ ] Set up viewport meta tags for tablet
- [ ] Configure responsive breakpoints (tablet-only)
- [ ] Ensure proper touch target sizes (min 44×44px)

### 4.2 Grid Component
- [ ] Create `Grid` component (6 columns × 4 rows)
- [ ] Use CSS Grid or MUI Grid for layout
- [ ] Ensure equal-sized squares
- [ ] Add rounded corners to squares
- [ ] Implement responsive padding/gaps
- [ ] Handle different tablet sizes gracefully

### 4.3 Square Component
- [ ] Create `Square` component
- [ ] Props: `square: Square`, `onClick: () => void`, `isEditMode: boolean`
- [ ] Display selected picture (if any)
- [ ] Display text above picture (if configured)
- [ ] Style empty squares differently
- [ ] Add visual feedback on click/tap
- [ ] Ensure accessibility (ARIA labels)

### 4.4 Theme Configuration
- [ ] Create custom MUI theme
- [ ] Define French-specific font stack
- [ ] Set color palette (primary, secondary)
- [ ] Configure typography for tablet readability
- [ ] Set default touch target sizes
- [ ] Configure elevation/shadows for cards

---

## Epic 5: Square Interaction & TTS Integration

**Goal**: Implement click handling and text-to-speech functionality

### 5.1 Click Tracking for Edit Mode Activation
- [ ] Implement click counter per square
- [ ] Track clicks within time window (e.g., 3 seconds)
- [ ] Activate edit mode on 5th click
- [ ] Reset counter on timeout or mode change
- [ ] Add visual feedback during click counting (optional)

### 5.2 Normal Mode Click Behavior
- [ ] Handle square click in normal mode
- [ ] Trigger TTS for associated text
- [ ] Wait for TTS completion
- [ ] Navigate to target page (if configured)
- [ ] Prevent multiple simultaneous clicks

### 5.3 Text-to-Speech Integration
- [ ] Research and select local TTS library
  - Options: Web Speech API, Piper TTS, Coqui TTS
  - Must support French
  - Must support female voice
  - Must work offline
- [ ] Create `TTSService` class/module
- [ ] Implement `speak(text: string)` method
- [ ] Download and cache TTS model on first launch
- [ ] Add to Web Worker download queue
- [ ] Handle TTS errors gracefully
- [ ] Add TTS state management (speaking, idle, error)

### 5.4 Navigation Logic
- [ ] Implement page navigation on square click
- [ ] Trigger navigation after TTS completes
- [ ] Handle navigation to non-existent pages
- [ ] Animate page transitions (optional)

---

## Epic 6: Edit Mode & Configuration

**Goal**: Implement edit mode UI and square editing functionality

### 6.1 Edit Mode Toolbar
- [ ] Create `EditModeToolbar` component
- [ ] Position at top of screen
- [ ] Add "Create New Page" button
- [ ] Add "Manage Pages" button
- [ ] Add "Exit Edit Mode" button
- [ ] Style with Material UI AppBar
- [ ] Ensure toolbar is always visible

### 6.2 Create New Page Dialog
- [ ] Create `CreatePageDialog` component
- [ ] Use MUI Dialog component
- [ ] Add text input for page name
- [ ] Validate page name (unique, not empty)
- [ ] Create page and navigate on submit
- [ ] Handle cancel action
- [ ] Show error messages for validation

### 6.3 Manage Pages Dialog
- [ ] Create `ManagePagesDialog` component
- [ ] Display list of all pages
- [ ] Highlight current page
- [ ] Prevent deletion of Home page
- [ ] Add actions per page:
  - Open/navigate to page
  - Rename page
  - Delete page
- [ ] Confirm before deletion
- [ ] Handle edge cases (deleting current page)

### 6.4 Square Edit Modal
- [ ] Create `SquareEditModal` component
- [ ] Show current selected image (large preview)
- [ ] Display square attribute editors:
  - Associated text (TextField)
  - Display text above picture (Checkbox)
  - Navigate to page (Select/Autocomplete)
- [ ] Show picture selection list below
- [ ] Auto-save changes on edit
- [ ] Close modal on outside click or close button

### 6.5 Edit Mode Visual Feedback
- [ ] Add visual indicators for edit mode
- [ ] Highlight editable areas
- [ ] Show borders around squares in edit mode
- [ ] Add hover effects on squares
- [ ] Show edit icon on square hover (optional)

---

## Epic 7: Page Management System

**Goal**: Implement full page creation, navigation, and management

### 7.1 Page Navigation
- [ ] Implement `navigateToPage(pageName)` function
- [ ] Update current page in state
- [ ] Render new page grid
- [ ] Handle navigation history (optional)
- [ ] Prevent navigation to non-existent pages

### 7.2 Page Creation
- [ ] Implement `createPage(name)` function
- [ ] Validate unique page name
- [ ] Initialize with 24 empty squares
- [ ] Add to pages array in state
- [ ] Navigate to new page immediately
- [ ] Persist to localStorage

### 7.3 Page Deletion
- [ ] Implement `deletePage(name)` function
- [ ] Prevent deletion of Home page
- [ ] Show confirmation dialog
- [ ] Remove page from state
- [ ] Navigate to Home if deleting current page
- [ ] Update any squares pointing to deleted page
- [ ] Persist changes

### 7.4 Page Rename
- [ ] Implement `renamePage(oldName, newName)` function
- [ ] Validate new name is unique
- [ ] Update page name in state
- [ ] Update currentPageName if renaming current page
- [ ] Update all square navigations pointing to old name
- [ ] Persist changes

### 7.5 Home Page Initialization
- [ ] Create default Home page on first launch
- [ ] Set as homePageName in config
- [ ] Set as currentPageName on app load
- [ ] Ensure Home page cannot be deleted
- [ ] Ensure Home page can be renamed

---

## Epic 8: Picture Management & Selection

**Goal**: Implement picture library, favorites, and selection UI

### 8.1 Picture Library Setup
- [ ] Create `/public/assets/pictures/` directory
- [ ] Add initial set of sample pictures
- [ ] Create picture manifest/index file
- [ ] Implement picture loading utility
- [ ] Generate Picture objects from files
- [ ] Extract metadata (filename, path)

### 8.2 Picture Service
- [ ] Create `PictureService` class
- [ ] Implement `getAllPictures()` - lazy load
- [ ] Implement `getFavoritePictures()`
- [ ] Implement `searchPictures(query: string)`
- [ ] Implement alphabetical sorting
- [ ] Cache loaded pictures in memory
- [ ] Optimize for performance (don't load all at once)

### 8.3 Picture Selection UI
- [ ] Create `PictureSelector` component
- [ ] Show search/filter text input
- [ ] Display filtered pictures in grid
- [ ] Show only favorites by default
- [ ] Implement infinite scroll or pagination
- [ ] Show picture name below each thumbnail
- [ ] Highlight currently selected picture
- [ ] Handle picture click/selection

### 8.4 Favorites Management
- [ ] Auto-add picture to favorites on first use
- [ ] Track favorites in app state
- [ ] Persist favorites to localStorage
- [ ] Show favorites count (optional)
- [ ] Allow manual favorite toggle (optional)

### 8.5 Picture Display in Squares
- [ ] Optimize image loading and display
- [ ] Use appropriate image sizes
- [ ] Implement lazy loading for grid images
- [ ] Cache loaded images in browser
- [ ] Handle missing/broken images gracefully
- [ ] Show text above picture when configured

---

## Epic 9: Persistence & Storage

**Goal**: Implement localStorage persistence with auto-save

### 9.1 Storage Service
- [ ] Create `StorageService` class/module
- [ ] Implement `saveAppConfig(config: AppConfig)`
- [ ] Implement `loadAppConfig(): AppConfig | null`
- [ ] Implement `clearAppConfig()` for reset
- [ ] Handle localStorage quota errors
- [ ] Implement data migration if needed

### 9.2 Auto-Save Implementation
- [ ] Subscribe to Valtio state changes
- [ ] Debounce save operations (e.g., 500ms)
- [ ] Save to localStorage on every change
- [ ] Handle save errors gracefully
- [ ] Show save status indicator (optional)

### 9.3 State Rehydration
- [ ] Load config from localStorage on app start
- [ ] Restore pages, squares, favorites
- [ ] Restore current page and edit mode state
- [ ] Handle missing/corrupted data
- [ ] Initialize with defaults if no saved data

### 9.4 Data Validation
- [ ] Validate loaded data structure
- [ ] Check for required fields
- [ ] Fix or discard invalid data
- [ ] Ensure backwards compatibility
- [ ] Log validation errors

### 9.5 Export/Import (Optional Enhancement)
- [ ] Implement export config to JSON
- [ ] Implement import config from JSON
- [ ] Add export button in settings
- [ ] Add import button in settings
- [ ] Validate imported data

---

## Epic 10: Polish & Testing

**Goal**: Finalize UI, test all features, and optimize performance

### 10.1 UI Polish
- [ ] Review all components for tablet usability
- [ ] Ensure consistent spacing and alignment
- [ ] Add smooth transitions and animations
- [ ] Optimize touch targets (min 44×44px)
- [ ] Improve loading states and feedback
- [ ] Add error boundaries for graceful failures
- [ ] Review accessibility (ARIA labels, keyboard nav)

### 10.2 French Localization
- [ ] Review all UI text in French
- [ ] Ensure proper French grammar and spelling
- [ ] Use appropriate French typography
- [ ] Test with French TTS voice

### 10.3 Performance Optimization
- [ ] Optimize re-renders with React.memo
- [ ] Implement virtual scrolling for large lists
- [ ] Optimize image loading and caching
- [ ] Minimize bundle size
- [ ] Lazy load non-critical components
- [ ] Profile and optimize slow operations

### 10.4 Manual Testing
- [ ] Test first launch experience
- [ ] Test offline functionality
- [ ] Test edit mode activation (5 clicks)
- [ ] Test square editing and saving
- [ ] Test page creation, rename, delete
- [ ] Test navigation between pages
- [ ] Test TTS with various texts
- [ ] Test favorites system
- [ ] Test persistence (reload app)
- [ ] Test on multiple tablet sizes
- [ ] Test portrait orientation lock

### 10.5 Automated Testing (if applicable)
- [ ] Set up Jest and React Testing Library
- [ ] Write unit tests for utilities
- [ ] Write unit tests for state actions
- [ ] Write component tests for key components
- [ ] Write integration tests for main flows
- [ ] Set up test coverage reporting

### 10.6 Documentation
- [ ] Write README with setup instructions
- [ ] Document architecture and folder structure
- [ ] Document state management patterns
- [ ] Document how to add new pictures
- [ ] Document build and deployment process
- [ ] Add code comments where needed

### 10.7 Build & Deployment
- [ ] Configure production build
- [ ] Optimize bundle size
- [ ] Generate service worker
- [ ] Test production build locally
- [ ] Set up deployment pipeline (optional)
- [ ] Deploy to hosting service (optional)

---

## 🔧 Technical Considerations

### Architecture Decisions

1. **State Management**: Valtio for simplicity and reactivity
2. **Persistence**: localStorage for immediate saves, IndexedDB if quota issues
3. **Offline**: Service Worker + Web Worker for downloads
4. **TTS**: Evaluate Web Speech API vs. local model (Piper/Coqui)
5. **Images**: Store in public assets, reference by path
6. **Build**: Nx for monorepo, Vite/Webpack for bundling

### Scalability Considerations

- Monorepo structure allows future Next.js backend
- Shared libraries for types and utilities
- State management can be extended for sync
- Picture library can be loaded from external source
- Pages/squares structure supports unlimited growth

### Performance Targets

- First Launch: < 30 seconds (with downloads)
- Subsequent Loads: < 2 seconds
- Offline: 100% functional
- TTS Response: < 500ms delay
- Square Click Response: Immediate visual feedback
- Picture Search: < 100ms for filtering

---

## 📦 Dependencies Summary

### Core Dependencies
- `react` - UI framework
- `react-dom` - React DOM rendering
- `typescript` - Type safety
- `@mui/material` - UI components
- `@mui/icons-material` - Icons
- `@emotion/react` & `@emotion/styled` - MUI styling
- `valtio` - State management
- `tailwindcss` - Utility CSS

### Dev Dependencies
- `@nx/react` - Nx React plugin
- `@nx/vite` or `@nx/webpack` - Build tools
- `eslint` - Linting
- `prettier` - Code formatting
- `typescript` - Type checking
- `@testing-library/react` (optional) - Testing
- `jest` (optional) - Test runner

### Additional Libraries (to be determined)
- TTS library (Web Speech API or local model)
- Service Worker tooling (Workbox)

---

## 🚀 Implementation Phases

### Phase 1: Foundation (Epics 1-2)
Setup project infrastructure and define data models

### Phase 2: Core Features (Epics 3-5)
Implement offline support, grid layout, and basic interactions

### Phase 3: Advanced Features (Epics 6-8)
Add edit mode, page management, and picture selection

### Phase 4: Persistence & Polish (Epics 9-10)
Finalize storage, testing, and UI polish

---

## ⚠️ Risks & Mitigations

### Risk: TTS Model Size
- **Mitigation**: Evaluate multiple TTS options, choose smallest viable model
- **Fallback**: Use Web Speech API if local model too large

### Risk: localStorage Quota Limits
- **Mitigation**: Implement IndexedDB fallback for large datasets
- **Fallback**: Warn user and implement data cleanup

### Risk: Browser Compatibility
- **Mitigation**: Target modern browsers, test on Safari and Chrome
- **Fallback**: Show unsupported browser message

### Risk: Picture Library Size
- **Mitigation**: Implement lazy loading and optimize images
- **Fallback**: Limit picture library size or use external CDN

---

## ✅ Definition of Done

The project is complete when:

1. ✅ Nx monorepo is set up with React app
2. ✅ 6×4 grid displays correctly on tablets
3. ✅ Portrait orientation is locked
4. ✅ All text is in French
5. ✅ App works 100% offline after first launch
6. ✅ First launch shows progress loader
7. ✅ TTS reads square text aloud with female voice
8. ✅ 5 clicks activates edit mode
9. ✅ Edit mode allows square customization
10. ✅ Pages can be created, renamed, deleted
11. ✅ Pictures can be selected and displayed
12. ✅ Favorites system works correctly
13. ✅ All changes persist to localStorage
14. ✅ App rehydrates state on reload
15. ✅ Code is clean, typed, and maintainable

---

**End of Implementation Plan**
