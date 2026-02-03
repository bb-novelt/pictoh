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
