# Shared Packages

This directory is reserved for shared workspace packages used across apps in this monorepo.

## Adding a Package

Create a new directory here with its own `package.json`, e.g.:

```
packages/
  ui/           ← shared UI components
  utils/        ← shared utility functions
  types/        ← shared TypeScript types
```

Each package should be added to `pnpm-workspace.yaml` (already configured via `packages/*` glob) and can be consumed by apps using the workspace protocol:

```json
{
  "dependencies": {
    "@repo/ui": "workspace:*"
  }
}
```
