# GitHub Configuration

This directory contains GitHub-specific configuration files for the Pict'Oh repository.

## Workflows

### `copilot-setup-steps.yml`

This is a special GitHub Actions workflow that is automatically executed by GitHub Copilot agents before they start working on the repository.

**Purpose:** Pre-configure the development environment to save time and ensure consistency when Copilot agents work on the project.

**Key Requirements:**
- File must be named exactly `copilot-setup-steps.yml`
- Job must be named exactly `copilot-setup-steps`
- Must be on the default branch to work

**What it does:**
1. Sets up Node.js 20
2. Installs project dependencies
3. Builds the application
4. Runs tests

For more information on maintaining this workflow, see [COPILOT-AGENT-GUIDE.md](../COPILOT-AGENT-GUIDE.md#github-copilot-agent-environment-setup).
