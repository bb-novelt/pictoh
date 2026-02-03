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
- [ ] Set landscape orientation lock in manifest/config
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
- [ ] Set up IntelliJ IDEA workspace settings

---

## Epic 2: Core Data Models & State Management

**Goal**: Define TypeScript types alongside features (agile approach) and Valtio state structure

### 2.1 Define TypeScript Types (created alongside features)
- [ ] Create types as needed when implementing features
- [ ] Define `Picture` interface when implementing picture feature
  - Include `lastUsedTime` attribute for tracking usage
  - Support both built-in and user-added pictures
- [ ] Define `Square` interface when implementing grid feature
  - Reference pages by `pageId` instead of `pageName`
- [ ] Define `Page` interface when implementing page management
  - Include both `pageId` (unique identifier) and `pageName` (display name)
- [ ] Define `AppConfig` interface when implementing app state
  - Use `homePageId` and `currentPageId` instead of names

### 2.2 Create Valtio State Store
- [ ] Create `state/store.ts` with main application state
- [ ] Initialize store with default values
- [ ] Create default "Home" page with unique `pageId`
- [ ] Implement state utility functions:
  - `getCurrentPage()` - get by `pageId`
  - `getSquareAtPosition(row, col)`
  - `updateSquare(squareId, updates)`
  - `addPage(pageName)` - generate unique `pageId`
  - `deletePage(pageId)` - delete by ID
  - `renamePage(pageId, newName)` - rename using ID

### 2.3 Create State Actions
- [ ] Create `actions/` directory
- [ ] Implement page actions:
  - `createPage(name: string)` - auto-generate unique `pageId`
  - `deletePage(pageId: string)` - delete by ID
  - `renamePage(pageId: string, newName: string)` - rename by ID
  - `navigateToPage(pageId: string)` - navigate by ID
- [ ] Implement square actions:
  - `updateSquareContent(squareId, picture, text)`
  - `toggleTextDisplay(squareId)`
  - `setSquareNavigation(squareId, targetPageId)` - reference by page ID
- [ ] Implement edit mode actions:
  - `toggleEditMode()`
  - `activateEditMode()`
  - `deactivateEditMode()`
- [ ] Implement picture tracking actions:
  - `updateLastUsedTime(pictureId)` - track when pictures are used
  - `getPicturesSortedByLastUsed()` - for managing 50-picture limit

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
- [ ] Implement **complete image library caching**:
  - **All images** from `/assets/pictures/*` cached on first load
  - When user adds a new image to a square, **add it to cache immediately**
  - Cache persists across sessions for offline availability
- [ ] Implement runtime caching for user-added pictures
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
- [ ] Load everything completely before allowing app use (no lazy loading)
- [ ] Track download progress for:
  - App assets (30%)
  - Picture library (40%)
  - TTS model (30%)
- [ ] Store first launch completion flag
- [ ] Handle download errors gracefully
- [ ] Only show app when 100% loaded

### 3.5 Offline Detection & Feedback
- [ ] Implement online/offline detection
- [ ] Show offline indicator in UI (optional, subtle)
- [ ] Ensure all features work offline after first launch
- [ ] Test full offline functionality

---

## Epic 4: Main Grid Layout & Basic UI

**Goal**: Create the main 6×4 grid layout with Material UI components

### 4.1 App Layout Structure
- [ ] Create `Layout` component with landscape lock
- [ ] Set up viewport meta tags for tablet
- [ ] Configure for landscape-only (not portrait, not phone, not desktop)
- [ ] Ensure proper touch target sizes (min 44×44px)

### 4.2 Grid Component
- [ ] Create `Grid` component (6 columns × 4 rows)
- [ ] Use CSS Grid or MUI Grid for layout
- [ ] Ensure squares scale to fill space but stay square
- [ ] Add rounded corners to squares
- [ ] Implement responsive padding/gaps
- [ ] Handle different tablet sizes gracefully

### 4.3 Square Component
- [ ] Create `Square` component
- [ ] Props: `square: Square`, `onClick: () => void`, `isEditMode: boolean`
- [ ] Display selected picture (if any)
- [ ] Display text above picture (if configured)
- [ ] Style empty squares differently
- [ ] Add visual feedback on touch (not release):
  - **Border changes color for 1 second** when touched
  - Trigger TTS on touch start
- [ ] **Edit mode visual feedback**:
  - Show **red border** when edit mode is active
- [ ] No ARIA labels needed (not for blind people)
- [ ] No hover effects (tablet-only)

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
- [ ] Implement click counter for the screen (not per square)
- [ ] Track clicks within time window (e.g., short time)
- [ ] Activate edit mode on 5th click anywhere on screen
- [ ] Reset counter on timeout or mode change
- [ ] Add visual feedback during click counting (optional)

### 5.2 Normal Mode Click Behavior
- [ ] Handle square touch in normal mode
- [ ] Trigger on **touch start** (not on release)
- [ ] **Border color changes for 1 second** as visual feedback
- [ ] Trigger TTS for associated text
- [ ] Navigate to target page immediately (do not wait for TTS)
- [ ] Prevent multiple simultaneous touches

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
- [ ] Implement page navigation on square touch
- [ ] Navigate by `pageId` (not `pageName`)
- [ ] Trigger navigation immediately (do not wait for TTS)
- [ ] Handle navigation to non-existent pages
- [ ] No page transition animations
- [ ] No navigation history

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
- [ ] Toolbar only visible in edit mode

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
- [ ] **Sort pages by name alphabetically**
- [ ] Highlight current page
- [ ] Prevent deletion of Home page
- [ ] Add actions per page:
  - Open/navigate to page (by `pageId`)
  - Rename page (update `pageName`, keep `pageId` unchanged)
  - Delete page (by `pageId`)
- [ ] Confirm before deletion
- [ ] Handle edge cases (deleting current page)

### 6.4 Square Edit Modal
- [ ] Create `SquareEditModal` component
- [ ] Show current selected image (large preview)
- [ ] Display square attribute editors:
  - Associated text (TextField)
  - Display text above picture (Checkbox)
  - Navigate to page (Select/Autocomplete - by `pageId`, display `pageName`)
- [ ] Show picture selection list below (built-in + user-added)
- [ ] Auto-save changes on edit
- [ ] Close modal on outside click or close button

### 6.5 Edit Mode Visual Feedback
- [ ] Add visual indicators for edit mode
- [ ] **All squares show red borders** when edit mode is active
- [ ] Highlight editable areas
- [ ] All squares are editable when in edit mode
- [ ] No hover effects (tablet-only app)

---

## Epic 7: Page Management System

**Goal**: Implement full page creation, navigation, and management

### 7.1 Page Navigation
- [ ] Implement `navigateToPage(pageId)` function - navigate by ID
- [ ] Update current page in state (`currentPageId`)
- [ ] Render new page grid
- [ ] No navigation history needed
- [ ] Prevent navigation to non-existent pages
- [ ] No page transition animations

### 7.2 Page Creation
- [ ] Implement `createPage(name)` function
- [ ] Generate unique `pageId` (e.g., UUID or timestamp-based)
- [ ] Validate unique page name (display name can be same, but warn user)
- [ ] Initialize with 24 empty squares
- [ ] Add to pages array in state
- [ ] Navigate to new page immediately (by `pageId`)
- [ ] Persist to localStorage

### 7.3 Page Deletion
- [ ] Implement `deletePage(pageId)` function - delete by ID
- [ ] Prevent deletion of Home page (check `homePageId`)
- [ ] Show confirmation dialog
- [ ] Remove page from state
- [ ] Navigate to Home if deleting current page
- [ ] Update any squares pointing to deleted page (clear `openPageId`)
- [ ] Persist changes

### 7.4 Page Rename
- [ ] Implement `renamePage(pageId, newName)` function - rename by ID
- [ ] Validate new name is unique (warn if duplicate)
- [ ] Update `pageName` in state (keep `pageId` unchanged)
- [ ] Update `currentPageId` reference if renaming current page
- [ ] **No need to update square navigations** (they reference `pageId`, not name)
- [ ] Persist changes

### 7.5 Home Page Initialization
- [ ] Create default Home page on first launch
- [ ] Generate unique `homePageId`
- [ ] Set as `homePageId` in config
- [ ] Set as `currentPageId` on app load
- [ ] Ensure Home page cannot be deleted (check by `pageId`)
- [ ] Ensure Home page can be renamed (update `pageName` only)

---

## Epic 8: Picture Management & Selection

**Goal**: Implement picture library, favorites, and selection UI

### 8.1 Picture Library Setup
- [ ] Create `/public/assets/pictures/` directory
- [ ] **Note**: Repository currently includes 8 test images (arbre.svg, chat.svg, eau.svg, fleur.svg, maison.svg, manger.svg, soleil.svg, voiture.svg)
- [ ] **Image discovery approach** (preferred):
  - Automatically discover all images in `/public/assets/pictures/`
  - Use dynamic import or manifest generation
  - No manual list maintenance required
- [ ] **Fallback approach** (if auto-discovery not feasible):
  - Create a script to scan and generate image list
  - Script updates manifest when new images are added
- [ ] Implement picture loading utility
- [ ] Generate Picture objects from files
- [ ] Extract metadata (filename, path)
- [ ] Add `lastUsedTime` attribute to track usage

### 8.2 Picture Service
- [ ] Create `PictureService` class
- [ ] Implement `getAllPictures()` - returns built-in + user-added (all loaded on first access)
- [ ] Implement `getBuiltInPictures()` - from `/assets/pictures/*`
- [ ] Implement `getUserAddedPictures()` - user uploaded pictures
- [ ] Implement `searchPictures(query: string)` - filter by name/text
- [ ] Implement `getPicturesSortedByLastUsed()` - for 50-picture limit management
- [ ] Implement `updateLastUsedTime(pictureId)` - track picture usage
- [ ] Implement alphabetical sorting
- [ ] Cache loaded pictures in memory
- [ ] **Note**: Library will eventually contain thousands of images

### 8.3 Picture Selection UI
- [ ] Create `PictureSelector` component
- [ ] Show **search/filter text input** for finding pictures
- [ ] Add **filter toggle**: Built-in pictures, User-added pictures, or Both
- [ ] Display filtered pictures in grid
- [ ] Display maximum **50 pictures** at once
- [ ] New pictures replace the **last used** picture (based on `lastUsedTime`)
- [ ] Implement pagination or virtual scrolling for performance
- [ ] Show picture name below each thumbnail
- [ ] Highlight currently selected picture
- [ ] Handle picture click/selection
- [ ] **Do not show favorite count**
- [ ] Support user adding new pictures (upload functionality)

### 8.4 Picture Usage Tracking
- [ ] Track `lastUsedTime` when picture is selected for a square
- [ ] Update timestamp in app state
- [ ] Persist tracking data to localStorage
- [ ] Implement 50-picture display limit logic:
  - Sort pictures by `lastUsedTime`
  - Show 50 most recently used
  - New selections replace least recently used
- [ ] **Do not track or display favorite count**

### 8.5 Picture Display in Squares
- [ ] Optimize image loading and display
- [ ] Use appropriate image sizes
- [ ] All images **cached on first load** (no lazy loading)
- [ ] **User-added images cached immediately** when added to a square
- [ ] Cache loaded images in browser for offline use
- [ ] Handle missing/broken images gracefully
- [ ] Show text above picture when configured

### 8.6 User-Added Pictures Support
- [ ] Allow users to upload/add custom pictures (not from built-in library)
- [ ] Store user-added pictures separately from built-in library
- [ ] Implement picture upload functionality in picture selection dialog
- [ ] Cache user-added pictures immediately for offline use
- [ ] Track user-added pictures with `lastUsedTime`
- [ ] Apply same 50-picture limit across built-in + user-added
- [ ] Persist user-added picture references in localStorage
- [ ] Include in search/filter functionality

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
- [ ] Show **discrete save indicator** when saving:
  - Brief, non-intrusive visual feedback
  - Small icon or text (e.g., "Saved" or checkmark)
  - Fades out after 1-2 seconds

### 9.3 State Rehydration
- [ ] Load config from localStorage on app start
- [ ] Restore pages (by `pageId`), squares, picture tracking
- [ ] Restore current page (`currentPageId`) and edit mode state
- [ ] Handle missing/corrupted data
- [ ] Initialize with defaults if no saved data
- [ ] Restore user-added pictures

### 9.4 Data Validation
- [ ] Validate loaded data structure
- [ ] Check for required fields
- [ ] Fix or discard invalid data
- [ ] Ensure backwards compatibility
- [ ] Log validation errors

### 9.5 Data Import/Export
- [ ] **Not implemented yet** - future feature
- [ ] Reserved for future implementation:
  - Export config to JSON
  - Import config from JSON
  - Validation of imported data

---

## Epic 10: Polish & Testing

**Goal**: Finalize UI, test all features, and optimize performance

### 10.1 UI Polish
- [ ] Review all components for tablet usability
- [ ] Ensure consistent spacing and alignment
- [ ] No page transition animations
- [ ] Optimize touch targets (min 44×44px)
- [ ] Improve loading states and feedback
- [ ] Add error boundaries for graceful failures
- [ ] No ARIA labels needed (not for blind people)
- [ ] No hover effects (tablet-only)
- [ ] No navigation history

### 10.2 French Localization
- [ ] Review all UI text in French
- [ ] Ensure proper French grammar and spelling
- [ ] Use appropriate French typography
- [ ] Test with French TTS voice

### 10.3 Performance Optimization
- [ ] Optimize re-renders with React.memo
- [ ] Optimize image loading and caching
- [ ] Minimize bundle size
- [ ] All resources loaded on first access (no lazy loading)
- [ ] Profile and optimize slow operations

### 10.4 Manual Testing
- [ ] Test first launch experience
- [ ] Test offline functionality
- [ ] Test edit mode activation (5 clicks anywhere on screen)
- [ ] Test square editing and saving
- [ ] Test page creation, rename, delete
- [ ] Test navigation between pages (immediate, no waiting for TTS)
- [ ] Test TTS with various texts
- [ ] Test favorites system
- [ ] Test persistence (reload app)
- [ ] Test on multiple tablet sizes
- [ ] Test landscape orientation lock

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
5. **Images**: Store in public assets, reference by path, all loaded on first access
6. **Build**: Nx for monorepo, Vite/Webpack for bundling
7. **Orientation**: Landscape-only (not portrait)
8. **Loading**: No lazy loading - everything loaded on first access
9. **IDE**: IntelliJ (not VS Code)
10. **Types**: Created alongside features (agile approach)
11. **Page References**: Use unique `pageId` instead of `pageName` to handle renames
12. **Picture Limit**: Maximum 50 pictures displayed, sorted by `lastUsedTime`
13. **Picture Discovery**: Auto-discover images from directory (preferred) or use generation script
14. **User Pictures**: Support user-added pictures with same caching/tracking as built-in

### Scalability Considerations

- Monorepo structure allows future Next.js backend
- Shared libraries for types and utilities
- State management can be extended for sync
- Picture library can be loaded from external source
- Pages/squares structure supports unlimited growth

### Performance Targets

- First Launch: < 30 seconds (with downloads, everything loaded before app is usable)
- Subsequent Loads: < 2 seconds
- Offline: 100% functional
- TTS Response: < 500ms delay
- Square Touch Response: Immediate visual feedback (border color change for 1 second)
- Picture Search: < 100ms for filtering (even with thousands of images)
- Navigation: Immediate (does not wait for TTS)
- Save Indicator: Discrete, fades within 1-2 seconds

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
- **Mitigation**: Implement efficient search/filter, virtual scrolling, 50-picture display limit
- **Note**: Library will eventually contain thousands of images
- **Strategy**: Use `lastUsedTime` tracking to show most relevant pictures first
- **Fallback**: Pagination or lazy loading for picture selection UI only

---

## ✅ Definition of Done

The project is complete when:

1. ✅ Nx monorepo is set up with React app
2. ✅ 6×4 grid displays correctly on tablets
3. ✅ Landscape orientation is locked
4. ✅ All text is in French
5. ✅ App works 100% offline after first launch
6. ✅ First launch shows progress loader and loads everything before app is usable
7. ✅ **All images from library cached on first load**
8. ✅ **User-added images cached immediately when used**
9. ✅ TTS reads square text aloud with female voice
10. ✅ **Touch (not release) triggers TTS and border color change for 1 second**
11. ✅ 5 clicks anywhere on screen activates edit mode
12. ✅ **Edit mode shows red borders on all squares**
13. ✅ Edit mode allows square customization (all squares editable)
14. ✅ Pages use **unique `pageId`** for references (not `pageName`)
15. ✅ Pages can be created, renamed, deleted
16. ✅ **Pages dialog sorts pages by name**
17. ✅ Pictures can be selected and displayed
18. ✅ **User can add custom pictures (not from built-in library)**
19. ✅ **Picture selection has search and filter (built-in/user-added toggle)**
20. ✅ **Max 50 pictures displayed, tracked by `lastUsedTime`**
21. ✅ **No favorite count displayed**
22. ✅ **Image auto-discovery from directory or generation script**
23. ✅ All changes persist to localStorage
24. ✅ **Discrete save indicator shown on save**
25. ✅ App rehydrates state on reload
26. ✅ Code is clean, typed, and maintainable
27. ✅ No lazy loading - everything loaded on first access
28. ✅ Navigation does not wait for TTS completion
29. ✅ No page transition animations
30. ✅ Toolbar only visible in edit mode
31. ✅ No ARIA labels (not for blind people)
32. ✅ No hover effects (tablet-only)
33. ✅ No navigation history
34. ✅ Squares scale to fill space but stay square
35. ✅ **Note: Repository currently includes 8 test images**

---

**End of Implementation Plan**
