# HW2 — submit checklist (due Thu 2026-10-09 EOD; only after HW1 is Pass)

Everything is built and green locally. What is left is deploy, links, and the Notion page.
Notion page: https://app.notion.com/p/3f0326b2d5fb819f9d47cd6007450607 (sections under "Homework 2").

## 1. Backend for the demo (pick one)

**A. Local only (simplest, allowed by the page: "A reviewer can run it from your page").**
README + build report part 6 already contain the exact commands. Demo link stays the Vercel
frontend on mock data; Notion §1 says the real API runs locally. Risk: reviewer may want a live API.

**B. Live API (better).** Deploy Easy-Backend-v2 to Render (free) with MongoDB Atlas (free M0):
1. Atlas: create a free cluster, user, allow `0.0.0.0/0`, copy the URI; set `DB_NAME=easy_app`.
2. Render → New Web Service → repo `Easy-Backend-v2`, build `npm ci`, start `npm start`,
   env: `DB_CONNECTION_STRING`, `DB_NAME`, `JWT_SECRET`, `ADMIN_API_KEY`, `NODE_ENV=production`,
   `ALLOWED_ORIGINS=https://<your-vercel-app>.vercel.app,http://localhost:3000`.
3. Seed once from your laptop against Atlas: `DB_CONNECTION_STRING=<atlas uri> DB_NAME=easy_app SEED_ADMIN_PASSWORD=<new> node scripts/seed-delivery-agents.js`
4. Vercel → project env: `NEXT_PUBLIC_API_BASE_URL=https://<render-app>.onrender.com/api/admin`, `NEXT_PUBLIC_USE_MOCK=0` → redeploy.
   Free Render instances sleep; first request can take ~50 s — say so in README.

## 2. Git

```bash
# frontend
cd D:\projects\easy-admin-frontend
git add -A && git commit -m "feat(delivery-agents): HW2 — login, create/details/edit/delete on Easy admin API, Playwright, QA docs"
git push

# backend (your Easy repo already has unrelated uncommitted work — commit only the homework files)
cd D:\Easy-Backend-v2
git add src/admin/routes/delivery-agents scripts/seed-delivery-agents.js tests/admin_delivery_agents_v2.test.js lib/db/mongoose.js
git commit -m "feat(admin): delivery agents — list filters + summary, validated create, safe update, seed, tests"
```

## 3. Notion — Homework 2 sections

- §1 Entity / feature: Delivery agents (Easy admin). Backend API: Express + Mongoose, repo Easy-Backend-v2, run steps from README.
  **One real response**: run the backend and paste `GET /api/admin/delivery-agents?limit=1` (needs `Authorization: Bearer <token>` from `POST /api/admin/login`).
- §2 Links: Vercel demo, frontend repo, backend repo (+ branch).
- §3 How to run: copy from README "How to run".
- §4 Test cases: paste `docs/test-cases.md` or link the file in the repo.
- §5 Playwright: file names `e2e/auth.setup.ts`, `e2e/delivery-agents.spec.ts`, `e2e/delivery-agents.mutation.spec.ts`, `e2e/responsive.spec.ts` + the real run output (build report part 9).
- §6 Build report: paste `docs/qa-build-report.md` (10 parts).
- §7 Prompts and skills: from `docs/session-prompts.md` (HW2 prompt was "bhai homework2 wala bhi kar do"; paste verbatim) — skills: `run-project`, Notion + Slack connectors.
- §8 One problem: the unvalidated PATCH / plain-text password finding, or the Playwright hydration click.
- §9 checklist, then **HW2 status → Submitted** + date, comment on the main task page, Slack one-liner in #c1_notice_board.

## 4. Slack line (after HW1 Pass)

```
@Vaishali Naruka (Frontend)
HW2 submitted, please review — https://app.notion.com/p/3f0326b2d5fb819f9d47cd6007450607
Demo: <vercel url> · Frontend: <github> · Backend: <github> (Easy-Backend-v2)
```
