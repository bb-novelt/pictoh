# Pict'Oh

Pict'Oh (pictho) is an offline-first, tablet-optimized communication board application built with React, TypeScript, and Material UI.

## Platform

- **Target**: Tablet only
- **Orientation**: Landscape only
- **Language**: French only
- **IDE**: IntelliJ IDEA

## Key Features

- Offline-first architecture (100% functional offline after first launch)
- 6×4 grid of customizable squares
- Text-to-speech with local French female voice
- Page navigation system
- Edit mode with full configuration
- Complete loading on first access (no lazy loading)

## Documentation

- See [PROJECT-OVERVIEW.md](./PROJECT-OVERVIEW.md) for detailed technical specifications
- See [plan.md](./plan.md) for implementation plan
- See [COPILOT-AGENT-GUIDE.md](./COPILOT-AGENT-GUIDE.md) for GitHub Copilot agent task workflow

## Test Pictures

The repository currently includes 8 test images in `/public/assets/pictures/` (arbre.svg, chat.svg, eau.svg, fleur.svg, maison.svg, manger.svg, soleil.svg, voiture.svg). More images will be added in the future as the library grows to eventually contain thousands of images.

## Getting started — Dev

After cloning the repo, run these commands in WSL (bash).

1. Install nvm and Node 20 (if not already installed):

```bash
# install nvm (run once)
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.6/install.sh | bash
# restart your shell or source nvm, then:
nvm install 20
nvm use 20
```

2. Install dependencies:

```bash
npm ci
```

3. Start the dev server (Nx -> Vite):

```bash
npx nx serve pictho-app
# then open: http://localhost:4200
```

Quick notes:

- To listen on all interfaces: `npx nx serve pictho-app -- --host 0.0.0.0`
- To change port: `npx nx serve pictho-app -- --port 4201`
