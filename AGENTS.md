# 🧩 AI Agent Prompt — Project **Pict'Oh**
*(internal project name: `pictho`)*

You are an expert **frontend architect and React/TypeScript engineer**.  
Your task is to **design and implement the frontend application** described below with clean architecture, strong typing, and offline-first behavior.

---

## 1. Project Identity

- **Commercial name**: **Pict'Oh**
- **Internal project name**: `pictho`
- **Target platform**: **Tablet only**
- **Orientation**: **Landscape only**
   - The UI must remain landscape even if the tablet is rotated
- **Language**: **French only**
   - No internationalization required

---

## 2. Technical Stack & Constraints

### Core stack

- **React**
- **TypeScript**
- **Material UI (MUI)** as the main UI library
- **Material Icons**
- **Tailwind CSS**
   - Enabled but **used only when strictly necessary**
- **Valtio** for state management

### Project structure

- Use **Nx** to manage the project
- Monorepo-ready architecture:
   - Frontend app only for now
   - Must allow adding a **Next.js server-side app later**

---

## 3. Offline-First Requirements

- The app must work **100% offline** after the first launch
- On first launch:
   - Display a **loader with progress percentage**
   - Load everything completely (no lazy loading):
      - Frontend code
      - Picture library (all images cached)
      - Text-to-speech model
   - Only when everything is loaded, the app can be used
- Use **Web Workers** for offline support and background downloads
- Persist configuration using **localStorage**  
  *(IndexedDB may be used if necessary)*
- **No lazy loading** - all resources must be fully loaded on first access

### Image Caching Strategy

- **All images** from the picture library are cached on first load
- When a user adds a new image to a square:
   - The image is **immediately added to the cache**
   - Ensures offline availability
- Cache persists across sessions

---

## 4. App Purpose & Layout

### Main grid

- Display **24 squares**
- Layout:
   - **6 columns**
   - **4 rows**
- Squares have **rounded corners**
- Each square:
   - Can be empty
   - Can contain a selected picture from `/assets/pictures/*`

---

## 5. Interaction Modes

### Normal mode (default)

- **Touching** a square (on touch start, not on release):
   - Reads the **associated text aloud**
   - Uses a **local text-to-speech model**
   - One **female voice**, preloaded
   - Square border **changes color for 1 second** as visual feedback
- If the square defines a target page:
   - Navigate to that page immediately (do not wait for speech to complete)

---

### Edit mode

- Activated by **clicking 5 times quickly anywhere on the screen**
- Edit mode applies to the **entire page**
- When in edit mode, **all squares** can be edited by clicking on them
- **Visual feedback**: All squares display **red borders** when edit mode is active

#### Edit mode UI

A **toolbar** is displayed (only visible in edit mode) with:

1. **Create new page**
   - Opens a popup
   - User enters page name
   - Page is created and immediately opened

2. **Manage pages**
   - Popup with page list
   - **Pages are sorted by name**
   - Actions:
      - Open page
      - Rename page
      - Delete page

3. **Exit edit mode**

---

## 6. Square Editing Behavior

- In edit mode, clicking a square opens a **modal**
- Modal content:
   - Current selected image
   - Square attributes editor
   - Below: picture selection list

### Picture selection rules

- Pictures come from:
   - Built-in library: `/assets/pictures/*`
   - User-added pictures (uploaded by the user)
- Display pictures:
   - **Alphabetical order**
   - **Filtered by text input** (search tool)
   - **Filter toggle**: Show built-in pictures, user-added pictures, or both
- Picture limit:
   - Maximum **50 pictures** displayed at once
   - New pictures replace the **last used** picture
   - Pictures have a **lastUsedTime** attribute for tracking
- **Do not display favorite count**
- **Note**: The repository currently has no test images

### Picture library management

- **Auto-discovery approach** (preferred):
   - Automatically discover images from `/assets/pictures/*` directory
   - No need to maintain a manual list of image names
- **Fallback approach** (if auto-discovery not possible):
   - Create a script to update the list of available images
   - Script should be run when new images are added to the library

### Picture metadata

- Each picture has an associated **text**
   - Default text = file name
- Option per picture:
   - Show text **above** the image or not

### User-Added Pictures

- Users can add their own pictures (not from the built-in library)
- User-added pictures are:
   - Stored separately from built-in library
   - Cached immediately for offline use
   - Tracked with `lastUsedTime` like built-in pictures
   - Included in the 50-picture display limit
- Picture selection dialog provides:
   - **Filter toggle**: Built-in, User-added, or Both
   - **Search functionality** across all pictures

---

## 7. Navigation & Pages

### Page model

Each page has:

- `pageId` (unique identifier, used as the key)
- `pageName` (display name, can be changed)
- `squares[]` with fixed positions (6×4 grid)

**Important**: Pages use **pageId** as the unique key, not `pageName`. This ensures:
- Pages can be renamed without breaking references
- No conflicts when renaming pages

### Square attributes

Each square contains:

- `selectedPicture` (built-in or user-added)
- `associatedText`
- `displayTextAbovePicture` (boolean)
- `openPageId` (string, references page by ID, empty = no navigation)

### App-level attributes

- `homePageId` (references the home page by ID)
- `pages[]`
- `currentPageId` (current active page)

- A **Home page** is created by default

---

## 8. Persistence Rules

- **Every change** (square edit, page edit, picture tracking, etc.):
   - Must be **saved immediately**
   - Stored in browser local storage
- State must rehydrate fully on reload
- Offline behavior must be deterministic
- **Save indicator**:
   - Show a **discrete save indicator** when saving
   - Brief, non-intrusive visual feedback
- **Import/Export**: Not implemented yet (future feature)

---

## 9. Text-to-Speech (TTS)

- Use a **local TTS model**, not a cloud service
- Female voice only
- Model is:
   - Downloaded in background on first app launch
   - Cached for offline use
- On first app launch:
   - Display a loader with **download progress percentage**

---

## 10. UX & Code Quality Expectations

- Tablet-friendly UI (large touch targets)
- **Landscape-only** orientation (not portrait, not phone, not desktop)
- Not fully responsive - **squares scale to fill space but stay square**
- **No hover effects** (tablet-only app)
- **No ARIA labels** (not for blind people)
- **No page transition animations**
- **No navigation history**
- Clear separation of concerns:
   - UI components
   - State (Valtio)
   - Persistence
   - Offline / worker logic
- **Agile approach to types**: Create types **alongside features**, not before
- Strong TypeScript typing for:
   - App configuration
   - Pages
   - Squares
   - Pictures
- Scalable architecture suitable for future Next.js backend integration
- **IDE**: IntelliJ (not VS Code)

---

## 11. Deliverables

- Nx monorepo structure
- React app using Material UI
- Offline-first implementation
- Edit mode logic
- Page & square configuration system
- Local persistence
- Text-to-speech integration
- Clean, readable, production-quality code

---

### Important Notes

- Do **not** over-engineer
- Favor **clarity, maintainability, and correctness**
- Avoid unnecessary abstractions

---
