<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Monorepo Architecture

This project uses **Turborepo** + **pnpm workspaces**.

## Workspace Structure

```
urbandetox/
├── apps/
│   ├── detox-frontend/      # Next.js 16 customer app (port 3000)
│   ├── detox-dashboard/      # Next.js 16 admin dashboard (port 3001)
│   └── detox-backend/        # Node.js/Express API (port 4000) — TypeScript
├── packages/
│   ├── typescript-config/      # Shared TS configs (base, nextjs, node, build)
│   ├── eslint-config/          # Shared ESLint configs (next.js, node.js)
│   ├── tailwind-config/        # Shared Tailwind CSS theme tokens
│   ├── utils/                  # Shared utilities, types, constants, formatters
│   └── ui/                     # Shared shadcn/ui components
├── turbo.json                  # Turborepo task pipeline
├── pnpm-workspace.yaml         # pnpm workspace definition
└── package.json                # Root scripts
```

## Package Manager

**pnpm** is required. Do not use npm or yarn.

```bash
pnpm install
```

## Running Apps

Use root scripts (Turborepo orchestration):

```bash
# Run everything in dev mode
pnpm dev

# Run specific apps
pnpm frontend      # detox-frontend on :3000
pnpm dashboard     # detox-dashboard on :3001
pnpm backend       # detox-backend on :4000

# Build everything
pnpm build

# Lint / typecheck everything
pnpm lint
pnpm typecheck
```

Or run via Turbo filters:

```bash
turbo run dev --filter=detox-frontend
turbo run build --filter=detox-backend
```

## Shared Packages

### `@urbandetox/utils`

Pure TypeScript utilities. Built with **tsup** (`dist/` output).

- `types.ts` — Domain types (Destination, Package, Departure, etc.)
- `constants.ts` — BRAND, filters, dropdown options
- `formatters.ts` — formatPrice, formatDateRange, getDurationLabel, pluralize
- `utils.ts` — `cn()` className helper

Import in any app:
```ts
import { formatPrice, BRAND, cn } from "@urbandetox/utils";
```

### `@urbandetox/ui`

Shared React components (shadcn/ui primitives). Source is transpiled by Next.js — **no build step**.

- button, card, dialog, sheet, tabs, accordion, badge, input, label, etc.

Import in any app:
```ts
import { Button, Card } from "@urbandetox/ui";
```

### `@urbandetox/tailwind-config`

Shared Tailwind v4 theme tokens (`theme.css`). Imported in each app's `globals.css`.

### `@urbandetox/typescript-config`

Shared tsconfig bases:
- `base.json` — universal strict settings
- `nextjs.json` — extends base for Next.js apps
- `node.json` — extends base for Node.js apps
- `build.json` — for packages that emit `.d.ts` (tsup compatible)

### `@urbandetox/eslint-config`

Shared ESLint configs:
- `next.js` — Next.js + TypeScript (core-web-vitals)
- `node.js` — Node.js recommended

## Adding Dependencies

Always add from the **workspace root** using pnpm:

```bash
# Add to a specific app
pnpm add <pkg> --filter detox-frontend

# Add to a shared package
pnpm add <pkg> --filter @urbandetox/utils

# Add dev dependency
pnpm add -D <pkg> --filter detox-dashboard
```

## Turborepo Pipeline

Defined in `turbo.json`:

- `build` — depends on `^build`, outputs `.next/**`, `dist/**`
- `dev` — persistent, no cache
- `lint` — depends on `^build`
- `typecheck` — depends on `^build`

## Important Notes

- Next.js apps use `transpilePackages: ["@urbandetox/ui", "@urbandetox/utils"]` in `next.config.ts` so workspace packages compile correctly.
- TypeScript path aliases in each app resolve workspace packages to their source files during development.
- The backend is fully TypeScript (`src/index.ts`), compiled to `dist/` with `tsc`.
