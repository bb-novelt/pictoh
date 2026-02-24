# GitHub Copilot Agent Guide

This guide explains how GitHub Copilot agents should work with this repository's task management system.

## Task Management Workflow

### Finding Tasks

1. **Check the task/Todo folder** for available tasks when you need to find the next task to work on
   - All pending tasks are stored in `/task/Todo/` directory
   - Tasks are organized by epic and numbered (e.g., `1.1-initialize-nx-workspace.md`)
   - Each task file contains:
     - Task title and epic reference
     - Detailed task checklist
     - Implementation requirements

2. **Review task content** before starting work
   - Read the complete task file to understand requirements
   - Check dependencies on other tasks
   - Understand the context from the epic

### Completing Tasks

When you complete a task:

1. **Move the task file** from `task/Todo/` to `task/Done/`

   ```bash
   mv task/Todo/<task-file>.md task/Done/<task-file>.md
   ```

2. **Append a completion summary** to the moved file
   - Add a "## Completion Summary" section at the end of the file
   - Include:
     - Date completed
     - Brief description of what was done
     - Any important notes or decisions made
     - Links to related commits or PRs if applicable
   - **UI tasks**: if the task involved any visible UI changes, include at least
     one screenshot in the summary so reviewers can see the result at a glance.
     Take the screenshot with the `browser_take_screenshot` tool and embed it in
     the markdown using standard image syntax, for example:
     `![Screenshot](./screenshot.png)`

### Example Completion Summary

```markdown
## Completion Summary

**Date Completed**: 2026-02-03

**Work Done**:

- Initialized Nx workspace with React preset
- Configured TypeScript strict mode
- Set up path aliases for clean imports
- Configured workspace structure for future Next.js apps

**Notes**:

- Used Nx 18.x for better monorepo support
- Path aliases configured in `tsconfig.base.json`

**Related Commits**:

- abc1234: Initialize Nx workspace
- def5678: Configure TypeScript and path aliases
```

## Task File Format

Task files follow this structure:

```markdown
# Task X.Y: Task Title

**Epic**: Epic X: Epic Name

## Task Details

- [ ] Checklist item 1
- [ ] Checklist item 2
- [ ] Checklist item 3
```

## Best Practices

1. **Work on one task at a time** - Focus on completing tasks fully before moving on
2. **Keep summaries concise** - Include only relevant information
3. **Document decisions** - Note any important architectural or implementation decisions
4. **Update the task checklist** - Mark items as complete before moving the file
5. **Check dependencies** - Some tasks depend on others being completed first

## Project Context

This is the Pict'Oh (pictho) project - an offline-first, tablet-optimized communication board application. See:

- [README.md](./README.md) for project overview
- [PROJECT-OVERVIEW.md](./PROJECT-OVERVIEW.md) for detailed specifications
- [plan.md](./plan.md) for the complete implementation plan

---

## Folder Structure Convention

**Files are organised by feature/module, not by type.**

Do **not** create generic type-based folders such as `components/`, `hooks/`, `utils/`,
`services/`, or `tests/`.

Instead, group every file belonging to the same feature inside **one feature folder**:

```
src/
  firstLaunch/           ← feature: first-launch loader + download workers
  offline/               ← feature: offline detection UI + service worker registration
  state/                 ← feature: Valtio state store + actions (already feature-based)
  shared/
    types/               ← shared TypeScript types used across multiple features
  app/                   ← app entry-point (App component)
```

### Rules

1. **Feature folder** — All files related to a feature live together:
   - React components, custom hooks, utilities, workers, messages, tests
   - Example: `offline/OfflineIndicator.tsx` and `offline/useOnlineStatus.ts`
     live in the same `offline/` folder instead of separate `components/` and `hooks/` folders.
2. **`shared/` folder** — Only for files that are genuinely reused across **more than one**
   feature (e.g. shared TypeScript type definitions in `shared/types/`).
3. **New features** — When starting a task that introduces a new concern, create a new
   feature folder named after the feature. Examples of expected future folders:
   - `grid/` — Grid + Square layout components (Epic 4)
   - `editMode/` — Edit-mode toolbar + dialogs (Epic 6)
   - `pictures/` — Picture library, selector, usage tracking (Epic 8)
   - `storage/` — Persistence / auto-save (Epic 9)
   - `tts/` — Text-to-speech integration (Epic 5)

---

## GitHub Copilot Agent Environment Setup

This repository includes a GitHub Actions workflow that automatically sets up the development environment when GitHub Copilot agents start working on the project.

### The Setup Workflow

The workflow file is located at: `.github/workflows/copilot-setup-steps.yml`

**CRITICAL NAMING REQUIREMENTS:**

- The workflow file **MUST** be named exactly `copilot-setup-steps.yml`
- The job in the workflow **MUST** be named exactly `copilot-setup-steps`
- These exact names are required for GitHub Copilot agents to recognize and execute the setup

### What It Does

The setup workflow automatically:

1. Checks out the repository code
2. Sets up Node.js 20 with npm caching
3. Installs all project dependencies (`npm ci`)
4. Verifies Nx installation
5. Builds the application to ensure everything works

This saves significant time when Copilot agents start working, as the environment is pre-configured and ready.

### When to Update the Workflow

You should update `.github/workflows/copilot-setup-steps.yml` when:

1. **New dependencies are added** that require special setup
   - Example: If you add a database, add a step to start it
2. **Build process changes** significantly
   - Example: If you switch from Vite to Webpack, update the build command
3. **Additional tools are required**
   - Example: If you need Python, Docker, or other tools, add setup steps

4. **Environment variables or secrets are needed**
   - Example: Add steps to configure required environment variables

5. **New project apps are added to the monorepo**
   - Example: If you add a Next.js backend app, add a build step for it

### How to Update the Workflow

1. Edit `.github/workflows/copilot-setup-steps.yml`
2. Keep the required job name: `copilot-setup-steps`
3. Add/modify steps in the `steps:` section as needed
4. Test the workflow by:
   - Pushing changes to trigger it
   - Manually running it via GitHub Actions UI (workflow_dispatch)
5. Verify it completes successfully in the Actions tab

### Example: Adding a New Step

To add a new setup step, add it to the `steps:` section:

```yaml
- name: Your new step name
  run: |
    echo "Running your setup command"
    your-command-here
```

### Additional Resources

- [GitHub Copilot agent environment customization docs](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/customize-the-agent-environment)
- [GitHub Actions workflow syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
