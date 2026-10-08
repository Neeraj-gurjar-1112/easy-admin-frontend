# QA build report — Easy Admin · Delivery agents (HW2)

Format: WM | Report (10 parts from training Step 8). Written as a hand-over to QA.

## 1. Build

| | |
|---|---|
| Frontend repo / branch | https://github.com/Neeraj-gurjar-1112/easy-admin-frontend · `main` · **code under test: commit `ec4f7a6`** (the deployed build is the commit right after it on `main`, which adds only this report, the test cases, screenshots and the HTML reports) |
| Backend repo / branch | https://github.com/Neeraj-gurjar-1112/Easy-Backend-v2 · `master` · commit `b71b508` (delivery-agents module, seed, tests, render.yaml) |
| Demo | Frontend: https://easy-admin-frontend.vercel.app (demo mode: in-browser data, survives reload, "Reset demo data" in the top bar; no login needed) · Backend for the real-API flow: local `http://localhost:8080` (see part 6) |
| Date | 2026-10-08 |

## 2. TL tasks covered

- AI Frontend Training — Homework 1 (list screen) and Homework 2 (full feature on a real API):
  https://app.notion.com/p/3e9326b2d5fb80c0872def7b6a848d3c
- Submission page: https://app.notion.com/p/3f0326b2d5fb819f9d47cd6007450607

## 3. What changed, in plain words

The Easy admin panel's **Delivery agents** page was rebuilt as a modern web app. An admin can now:
sign in, see all delivery partners with their approval and online status, search and filter them,
open one partner to see profile and performance, add a new partner, edit one, approve or suspend
one, and delete one. Every screen works from a 1920px monitor down to a 375px phone, with light
and dark mode. Dates, numbers and money follow the WM formats.

On the backend, the delivery-agents API gained search/filter/sort parameters, a summary endpoint
for the KPI tiles and a validated create endpoint; the update endpoint now accepts only known
fields and hashes a new password correctly.

## 4. Fixed issues

| Issue | What changed |
|---|---|
| PATCH `/delivery-agents/:id` wrote the whole body into the document, so a plain-text password could have been stored | Field whitelist + `save()` so the pre-save hook hashes it; covered by `tests/admin_delivery_agents_v2.test.js` |
| A Mongo URI without a database name silently used Mongo's default `test` database | `lib/db/mongoose.js` honours `DB_NAME` when the URI has no path; seed uses the same resolution |
| List endpoint had no search / filters, so the admin UI could only page | `q`, `vehicle_type`, `approval`, `presence`, `sort`, `order` with Joi validation; legacy `{ agents, pagination }` shape unchanged |
| Clicking a button right after a page loaded in Playwright sometimes did nothing (React not yet hydrated / dev route not compiled) | Tests retry the click until the URL changes (`openFirstRowDetails`); dev server keeps routes compiled (`onDemandEntries`) |
| Duplicate email came back as a plain `{ error }`, so the form showed a banner instead of the field (review point 2) | API answers `details: [{ field: "email" }]`; form maps it under the input; mutation test asserts the field, not the page |
| Form and Joi rules drifted (password required only client-side, licence limit hard-coded) (review point 3) | One `LIMITS` object in the API, mirrored 1:1 by `AGENT_RULES`; password 8–72 required on create on both sides |
| `.env.local.example` shipped demo mode (review point 4) | Example now points at the real API (`NEXT_PUBLIC_USE_MOCK=0`); demo mode is opt-in |

## 5. Test accounts / roles

| Role | Account | Where |
|---|---|---|
| Admin (only role in Easy's admin API) | `admin@example.com` — password = `SEED_ADMIN_PASSWORD` on the host, or the local default inside `Easy-Backend-v2/lib/seed/deliveryAgents.js` | Created by the seed (script, or on boot with `SEED_ON_BOOT=1`) |
| Delivery agents | 32 seeded agents (`rahul.verma@example.com` …) — no passwords set | Seed |

No real passwords in this report. Change `SEED_ADMIN_PASSWORD` before seeding any shared environment.

## 6. Data QA must prepare first

```bash
# Backend (Node 20+, MongoDB on localhost:27017 — or USE_MEMORY_DB=1 for a self-contained in-memory database)
cd Easy-Backend-v2
npm install
node scripts/seed-delivery-agents.js       # idempotent; add --reset to wipe agents first (not needed with SEED_ON_BOOT=1)
npm run dev                                # http://localhost:8080

# Frontend
cd easy-admin-frontend
npm install
cp .env.local.example .env.local           # already set to the real API (NEXT_PUBLIC_USE_MOCK=0)
$env:E2E_ADMIN_PASSWORD="<seed password>"  # for Playwright only
npm run dev                                # http://localhost:3000
```

Expected starting state: 32 agents · 5 pending · 18 online · 7 busy · 7 offline · average rating 4.5.
Mutation tests create and delete their own agent (`e2e.<stamp>@example.com`). They may run against the hosted demo API (in-memory database, reseeded on every restart) — never against a real production server.

## 7. What to test (numbered)

1. Open `/` → redirected to `/login` → sign in → list page opens with 4 KPI tiles and 10 rows, "Total 32".
2. Search `priya` → 1 row; search a phone's digits without spaces → matching row; search `zzz` → empty state with "Clear filters".
3. Filters: Vehicle = Scooter, Approval = Pending approval, Status = Busy → every row matches; Reset clears all.
4. Sort by Rating (click header twice) → 4.9 first; Next page → different rows, same total; page size 20 → page 1 with 20 rows.
5. View (eye icon) → details: profile, performance tiles, recent orders ("No deliveries yet" for seeded agents).
6. Add agent → submit empty → 4 required messages; wrong formats → backend rules shown; valid data → details page + toast, list shows the new agent as Pending.
7. Create again with the same email → "Email is already registered" under Email, typed values kept.
8. Edit → change name → Save → details shows new name + toast; list shows new name. Then Edit again → clear the name → Save → "Name is required"; phone `12345` → Save → "Phone must contain at least 10 digits"; nothing is saved, the form stays open.
9. Approve on details → badge Approved; Suspend on list row → confirm dialog → badges Pending + Offline. Cancel on the suspend dialog → nothing changes.
10. Delete on list row → confirm dialog → Cancel → row stays, Total unchanged; Delete again → confirm → toast → agent gone from search; Total decreases.
11. Sign out → redirected to login; opening `/delivery-agents/list` directly → login with `?next=`.
12. Stop the backend → list shows "Could not load data" with the connection message; submitting a valid create or edit form shows the same message in the form banner and keeps the typed values → start backend → Try again loads rows, submit works. Opening `/delivery-agents/details/<unknown id>` or `/edit/<unknown id>` shows "Delivery agent not found" with Try again.
13. Resize 1920 → 375: sidebar becomes a drawer below 1024, tiles 4→2→1, filters and form stack, table scrolls inside its card, no page-level horizontal scroll.
14. Toggle dark mode → every surface switches; reload keeps the choice.

Full case list with IDs: `docs/test-cases.md` (51 cases: 34 positive, 17 negative).

## 8. Known issues and what is not covered

- **Single admin role.** Easy's admin API has one role; "other roles cannot open the page" is covered only by the unauthenticated redirect and the API's 401.
- **Recent orders** are empty for seeded agents (no seeded orders). The table renders with real data from `GET /delivery-agents/:id`.
- **Deployed demo** of the frontend runs on the in-memory mock until the backend is hosted. The backend repo ships `render.yaml` (in-memory database + seed on boot, no external services); once it is up, the switch is two Vercel variables (`NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_USE_MOCK=0`) and a redeploy, and the Playwright suites run against the hosted URL with `PLAYWRIGHT_BASE_URL`.
- **Backend test suite** (`npm test` in Easy-Backend-v2) is red for pre-existing reasons documented in `docs/TEST-STATUS.md`; the new `admin_delivery_agents_v2.test.js` file passes on its own.
- Not covered: concurrent edits, file uploads (none on this entity), Flutter partner app behaviour after admin changes.

## 9. Results of lint, type-check, build and tests

```
Frontend
  npm run type-check     → 0 errors
  npm run lint           → 0 errors, 0 warnings
  npm run build          → ✓ Compiled successfully · routes: / · /login · /delivery-agents/list · /create · /details/[id] · /edit/[id]
  npm run test:e2e       → 69 passed (2.8m) — auth.setup 1 + delivery-agents.spec 13 (10 happy-path/state + 3 negative: cancelled delete, edit validation, unknown edit id) + responsive.spec 55 (5 screens × 11 widths) · HTML report https://easy-admin-frontend.vercel.app/qa/e2e-report/
  npm run test:e2e:mutations → 7 passed (19.7s) — auth.setup 1 + create → duplicate-email rejection (field error under Email) → list search → edit → approve → delete · HTML report https://easy-admin-frontend.vercel.app/qa/mutation-report/

Backend (Easy-Backend-v2)
  npx jest tests/admin_delivery_agents_v2.test.js → 12 passed, 12 total
  npx prettier --check (changed files)            → clean
  node scripts/list-routes.js                      → GET /delivery-agents(/pending|/summary|/:id), POST /delivery-agents, PATCH /:id(/approve|/reject), DELETE /:id
```

## 10. Screen sizes and browsers checked

- Widths: 1920 · 1600 · 1440 · 1366 · 1280 · 1024 · 991 · 768 · 640 · 480 · 375 — list, details, create, edit, login (Playwright `responsive.spec.ts`, 55 screenshots in `docs/screenshots`).
- Browsers: Chromium (Playwright) and Chrome (manual). Firefox / Safari not checked.
