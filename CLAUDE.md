# Easy Admin — Frontend

Homework project for the WM "AI Frontend Training" (backend developers building frontend with
Claude Code). Easy is a hyperlocal grocery + food delivery service (Indian cities, COD only) whose
backend lives in `D:\Easy-Backend-v2` (Express + Mongoose). Its admin panel is server-rendered EJS;
this repo rebuilds the **Delivery agents** feature in Next.js + PrimeReact following the WM rules.

- **HW1** — `/delivery-agents/list`: KPI tiles, search + filters, sortable table, paging, loading /
  empty / error / filled states, all WM screen sizes. Mock data behind the real service contract.
- **HW2** — login + create / details / edit / approve / suspend / delete on the real admin API
  (`/api/admin/delivery-agents`), Playwright (read-only + mutation), test cases, QA build report.

Stack: Next.js 15 (App Router) · React 19 · TypeScript (strict) · PrimeReact 10.2 · SCSS · TanStack Query 5 · Axios · react-hook-form · Playwright
Backend API: `NEXT_PUBLIC_API_BASE_URL` = `http://localhost:8080/api/admin` (see `.env.local.example`)

## Commands

```
npm run dev                  # localhost:3000 → /login → /delivery-agents/list
npm run type-check           # tsc --noEmit — run after every change
npm run lint
npm run build
npm run test:e2e             # Playwright: auth.setup (login once) + read-only specs + responsive; backend must run
npm run test:e2e:mutations   # *.mutation.spec.ts only — local backend only, never a shared server without telling the team
npm run shots                # responsive spec alone: 4 screens × 11 widths (WM list + 1440) → ./screenshots + no-horizontal-scroll assertion
```

Backend for HW2: `cd D:\Easy-Backend-v2 && node scripts/seed-delivery-agents.js && npm run dev`
(seed admin `admin@example.com`; password = `SEED_ADMIN_PASSWORD` or the local default inside `lib/seed/deliveryAgents.js`). Playwright reads `E2E_ADMIN_EMAIL` / `E2E_ADMIN_PASSWORD` from the environment.

## Folders

```
src/app/(full-page)/login/        login (no admin chrome)
src/app/(main)/delivery-agents/   list / create / details/[id] / edit/[id]   (route convention per entity)
src/api-services/                 CoreAPIService (axios, Bearer token, error folding, 401 → /login), AuthService,
                                  DeliveryAgentService (picks the mock when IS_MOCK), *.types.ts = the shared contract
src/hooks/API/<domain>/           TanStack Query hooks — the only way a screen gets server data
src/components/                   reusable UI pieces — look here BEFORE creating anything new
src/components/delivery-agents/   feature pieces: AgentStats, AgentFilters, AgentTable, AgentForm, AgentBadges, useAgentActions
src/providers/                    QueryClient, PrimeReact, theme, Toast + ConfirmDialog (global), AuthGate
src/types/                        request / response types — no `any`
src/mocks/                        in-memory API (same contract) for the HW1 demo; off when NEXT_PUBLIC_USE_MOCK=0
src/utils/                        api-integration (endpoints + query keys), formatters, constants (labels, AGENT_RULES, nav = only real pages), env
src/styles/                       _variables (tokens), _mixins (breakpoints), components/, pages/, globals.scss
e2e/                              auth.setup.ts, delivery-agents.spec.ts, delivery-agents.mutation.spec.ts, responsive.spec.ts
docs/                             test-cases.md, qa-build-report.md, design-check.md, wm-rules.md, hw1-next-steps.md, session-prompts.md
```

## Rules

- **Plan first.** Never build a whole page in one prompt: plan → one step → `npm run type-check` → next step.
- **Reuse** `src/components/*` and PrimeReact parts before making new ones. New components stay small (one job).
- **Class names** are lowercase-with-hyphens: `main-container` ✅ `mainContainer` ❌ `main_container` ❌.
- **Colours only through tokens.** SCSS names are colour + code (`$blue-b1`), never a meaning (`$blue-dark`).
  Components use the CSS custom property `var(--blue-b1)`. Every `[day]` colour has exactly one `[night]`
  colour with the same name — both live in `src/styles/_variables.scss`. No hex values anywhere else.
  The palette is the Easy admin panel's (`Easy-Backend-v2/src/admin/public/css/admin.css`).
- **No hardcoded numbers in SCSS**: spacing `$space-*`, type `$font-size-*`, radius `$radius-*`,
  breakpoints only via `@include below('sm')` from `_mixins.scss`.
- **Breakpoints to check (WM):** 1920 → 1600 → 1366 → 1280 → 1024 → 991 → 768 → 640 → 480 → 375.
  No horizontal page scroll at any width. Tables scroll inside their own box (`.table-scroll-box`).
  Sidebar is a drawer below 1024px; KPI tiles 4 → 2 → 1 columns; filters and form fields stack below 768px.
- **Every screen** shows loading, empty, error and filled states — wrap the content in `StateWrapper`.
- **Forms:** react-hook-form; rules come from `AGENT_RULES` (= backend Joi/Mongoose). Submit disabled while saving.
  API errors: field messages via `setError`, everything else in the banner; typed values are never cleared.
- **Formats (WM):** dates `YYYY-MM-DD`; numbers with a three-digit comma; money is INR without decimals (`₹48,600`).
- **Where data lives:** server data only in the TanStack Query hook; screen-only state (filters, page, drawer)
  in `useState`; nothing copied into a second store. Mutations invalidate list + summary (+ details).
- **Easy API quirks:** legacy handlers answer ad-hoc JSON (`{ agents, pagination }`, errors `{ error }`),
  Joi validation answers `{ error: "Validation failed", details: [{ field, message }] }`, newer handlers
  `{ success, data, message }`. CoreAPIService folds all into `ApiError { message, errors, fieldErrors }`.
- **PrimeReact 10.2:** no `invalid` prop — use `className="p-invalid"`. React 19 needs `--legacy-peer-deps` on install.
- **Playwright:** one login in `auth.setup.ts` (storageState), `@mutation` specs separate and off by default,
  check visible text and headings, not only URLs.
- **Icons:** PrimeIcons (`pi pi-*`). Custom icons `icon-<name>-<colour>`; check it does not already exist.
- **Buttons** get their width from padding, never a fixed px width. Minimum tap target on phones is `$touch-target`.
- **Comment above each main block** (WM HTML guideline), in plain words.
- Company rules are in WM (Notion). Fetch them, do not guess. Links are in `docs/wm-rules.md`.
- After every change run `npm run type-check` and `npm run lint` and show the real output.
- Never commit `.env.local`. Never auto-run `git push`, deletes or deploys.
