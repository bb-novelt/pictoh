# Pict'Oh – Copilot Instructions

## Project Overview

**Pict'Oh** (internal name: `pictho`) is an **offline-first, tablet-optimized communication board** application.

- **Target platform**: tablet only, landscape orientation
- **Language**: French only (no i18n required)
- **Tech stack**: React 19, TypeScript, Material UI (MUI), Tailwind CSS (sparingly), Valtio (state management)
- **Project structure**: Nx monorepo, single frontend app (`apps/pictho-app`)

## Development Commands

```bash
# Install dependencies
npm ci

# Build the app
npx nx build pictho-app

# Run tests
npx nx test pictho-app

# Lint
npm run lint
npm run lint:fix

# Format
npm run format
npm run format:check
```

Pre-commit hooks run lint-staged automatically (ESLint + Prettier on staged files).

## Folder Structure Convention

Files are **organised by feature/module**, never by type. Do **not** create generic folders like `components/`, `hooks/`, `utils/`, or `services/`.

```
apps/pictho-app/src/
  app/            ← app entry-point (App component)
  firstLaunch/    ← first-launch loader + download workers
  offline/        ← offline indicator, useOnlineStatus, service worker registration
  state/          ← Valtio store + actions (sub-folders per domain)
    actions/      ← pageActions, squareActions, editModeActions, pictureActions …
  grid/           ← Grid and Square layout components
  editMode/       ← edit-mode toolbar and dialogs
  pictures/       ← picture library, selector, usage tracking
  storage/        ← localStorage persistence
  tts/            ← text-to-speech integration
  shared/
    types/        ← TypeScript types shared across features
```

Rules:

1. All files for a feature live together (component, hook, utils, worker, tests).
2. `shared/` is only for files genuinely reused across **more than one** feature.
3. When adding a new concern, create a new feature folder named after it.

## Key Coding Standards

- **TypeScript**: strong typing throughout; create types alongside their feature, not ahead of time.
- **State management**: Valtio store in `src/state/store.ts`; exported via `src/state/index.ts`.
- **IDs**: use `crypto.randomUUID()` — no external ID libraries.
- **No hover effects** — tablet-only, touch-first UI.
- **No ARIA labels** — not required for this app.
- **No page transition animations**.
- **No lazy loading** — all resources must be fully loaded before the app is usable.
- **Material UI** is the primary UI library; Tailwind CSS only when strictly necessary.
- **Offline-first**: every user action is saved to `localStorage` immediately; the app must work 100% offline after the first launch.
- The home page (`homePageId`) cannot be deleted.

## Task Management

- Pending tasks: `task/Todo/` — read the task file before starting.
- When a task is done: move the file to `task/Done/` and append a `## Completion Summary` section.
- See `COPILOT-AGENT-GUIDE.md` for the full task workflow and file format.

## Additional References

- `PROJECT-OVERVIEW.md` — full product specification (grid layout, edit mode, TTS, persistence rules …)
- `COPILOT-AGENT-GUIDE.md` — agent workflow, folder structure convention, setup workflow details
- `.github/workflows/copilot-setup-steps.yml` — automated environment setup (Node 20, `npm ci`, build)
