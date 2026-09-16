# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server (Next.js)
npm run build        # Type-check then build for production
npm run start        # Serve the production build locally
npm run lint         # ESLint + TypeScript type checking
npm run lint:fix     # ESLint with auto-fix
npm run format       # Format with Prettier
npm test             # Vitest
```

## Architecture

**Feature-based modular structure** under `src/`:

- `modules/` — Domain modules (auth, property, stay, finance, error). Each module contains:
  - `service/` — API methods (`*Service.ts`) and React Query hooks (`*Service.hooks.ts`)
  - `view/` — Page components
  - `components/` — Module-specific UI components
  - `types/` — TypeScript types and Zod schemas
- `components/` — Shared UI: `ui/` (Radix UI primitives), `layout/`, `ProtectedRoute`, `PublicRoute`
- `app/` — Next.js App Router. Thin `page.tsx`/`layout.tsx` files that render module views. Two root layouts, `(pt-br)` and `(en)`, so `<html lang>` matches the URL. Landing and guides are statically rendered Server Components with `generateMetadata`/JSON-LD from `seo/`. Everything under `(pt-br)/(spa)` (product, auth, guest links) renders client-only through `SpaShell`, since it depends on `localStorage`. Inside `(spa)/app`, the layout only requires a session; the `(product)` group adds `AppLayout` and the Stripe checkout return handler, and `choose-plan` (shown right after signup) stays outside it
- `routes/` — Route constants in `routes.ts`
- `seo/` — Metadata and JSON-LD builders for public pages
- `app/api/version` — Static route handler that echoes `NEXT_PUBLIC_BUILD_ID` (set in `next.config.ts` from `VERCEL_DEPLOYMENT_ID`, inlined at build on both sides). `components/AppUpdateToast.tsx`, mounted in `SpaShell`, polls it while the app is open and offers a reload toast when the deployed build differs from the running one — an installed PWA has no address bar to refresh, and there is no service worker since the Vite migration (`public/sw.js` only unregisters the old Workbox one)
- `proxy.ts` — Server-side gate (Next 16's renamed middleware): checks only whether the session cookie exists and redirects, so a logged-in visitor never sees the landing page and `/app/**` never renders for an anonymous one
- `hooks/` — Shared custom hooks (`useAuth`, `useFilters`, `useDisclosure`)
- `lib/` — Axios instance (`api.ts`), React Query config (`query-client.ts`), env validation (`env.ts`), utilities

## Environment

Requires `NEXT_PUBLIC_API_URL` in `.env` (default: `http://localhost:3030`). Also `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CLARITY_ID`, `NEXT_PUBLIC_GSC_VERIFICATION` and `NEXT_PUBLIC_SESSION_COOKIE_NAME` (must match `SESSION_COOKIE_NAME` in the API). Validated via Zod in `lib/env.ts`; `NEXT_PUBLIC_*` values are inlined at build time.

## Personas

**Default entry point for any non-trivial task:** `.claude/personas/maestro.md`

The Maestro dispatches the other personas in the correct order. Only invoke a persona directly when the Maestro has already determined the workflow and you are executing a specific step.

| Persona               | File                                    | When to invoke directly                        |
| --------------------- | --------------------------------------- | ---------------------------------------------- |
| **Maestro**           | `.claude/personas/maestro.md`           | Any new feature, screen, or multi-step task    |
| **Architect**         | `.claude/personas/architect.md`         | Business rule or domain clarification only     |
| **Designer**          | `.claude/personas/designer.md`          | Purely visual task with settled business logic |
| **Accessibility**     | `.claude/personas/accessibility.md`     | Accessibility audit of an existing screen      |
| **Frontend Engineer** | `.claude/personas/frontend-engineer.md` | Implementation when design spec already exists |

## Patterns

Patterns are **task-specific references** — read the relevant pattern file when you are about to implement something it covers. You do not need to load all patterns at once; load the one(s) that apply to the task at hand.

Pattern files live in `.claude/patterns/`. Examples of when to load them:

| Task                                     | Pattern to read                           |
| ---------------------------------------- | ----------------------------------------- |
| Adding an API endpoint or HTTP call      | `http-client.md`                          |
| Adding a query or mutation               | `data-fetching.md`                        |
| Adding a form                            | `forms.md`                                |
| Adding a filter that drives an API query | `debounced-filters.md`, `client-state.md` |
| Styling a component                      | `styling.md`                              |
| Accessing the current user               | `authentication.md`                       |
| Writing an import path                   | `path-alias.md`                           |
| Translating a screen or adding a string  | `i18n.md`                                 |

## Rules

Rules are **always active** — internalize them and apply them to every task without being reminded. Rule files live in `.claude/rules/`; read them all at the start of each session.

Current rules: `commit.md`, `linting.md`, `mobile-first.md`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
