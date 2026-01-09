# 🧩 AI Agent Prompt — Project **Pict'Oh**
*(internal project name: `pictho`)*

You are an expert **frontend architect and React/TypeScript engineer**.  
Your task is to **design and implement the frontend application** described below with clean architecture, strong typing, and offline-first behavior.

---

## 1. Project Identity

- **Commercial name**: **Pict'Oh**
- **Internal project name**: `pictho`
- **Target platform**: **Tablet only**
- **Orientation**: **Portrait only**
   - The UI must remain portrait even if the tablet is rotated
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
   - Download and cache:
      - Frontend code
      - Picture library
      - Text-to-speech model
- Use **Web Workers** for offline support and background downloads
- Persist configuration using **localStorage**  
  *(IndexedDB may be used if necessary)*

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

- Clicking a square:
   - Reads the **associated text aloud**
   - Uses a **local text-to-speech model**
   - One **female voice**, preloaded
- If the square defines a target page:
   - Navigate to that page after speech (if applicable)

---

### Edit mode

- Activated by **clicking 5 times on any square**
- Edit mode applies to the **entire page**, regardless of which square was clicked

#### Edit mode UI

A **top band** is displayed with:

1. **Create new page**
   - Opens a popup
   - User enters page name
   - Page is created and immediately opened

2. **Manage pages**
   - Popup with page list
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

- Pictures come from `/assets/pictures/*`
- Never load or display all pictures at once
- Display pictures:
   - **Alphabetical order**
   - **Filtered by text input**
- By default:
   - Only **favorite pictures** are shown
- A picture becomes **favorite once it is used at least once**
- Favorites are part of the **persisted configuration**

### Picture metadata

- Each picture has an associated **text**
   - Default text = file name
- Option per picture:
   - Show text **above** the image or not

---

## 7. Navigation & Pages

### Page model

Each page has:

- `pageName`
- `squares[]` with fixed positions (6×4 grid)

### Square attributes

Each square contains:

- `selectedPicture`
- `associatedText`
- `displayTextAbovePicture` (boolean)
- `openPageName` (string, empty = no navigation)

### App-level attributes

- `homePageName`
- `pages[]`

- A **Home page** is created by default

---

## 8. Persistence Rules

- **Every change** (square edit, page edit, favorites update, etc.):
   - Must be **saved immediately**
   - Stored in browser local storage
- State must rehydrate fully on reload
- Offline behavior must be deterministic

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
- Clear separation of concerns:
   - UI components
   - State (Valtio)
   - Persistence
   - Offline / worker logic
- Strong TypeScript typing for:
   - App configuration
   - Pages
   - Squares
   - Pictures
- Scalable architecture suitable for future Next.js backend integration

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
