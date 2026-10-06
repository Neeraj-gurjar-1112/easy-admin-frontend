# HW1 — submit checklist (due Tue 2026-10-06, Vaishali asked for 17:00 IST)

The screen is built and all checks pass. What is left is the evidence the reviewer grades.
Do the steps in this order; every step says which Notion section it feeds.
Notion page: https://app.notion.com/p/3f0326b2d5fb819f9d47cd6007450607

## 1. Design link (≈20 min) — Claude Design  → Notion §1 "Design"

Open Claude Design, new project, paste this prompt. Then paste the link in Notion and in README.

```
Design an admin web screen for "Easy", a hyperlocal grocery + food delivery service in Indian
cities. Screen: "Delivery agents" list page of the admin panel. Two artboards: desktop 1440px and
phone 375px, plus three small state variants (loading, empty, error) beside the desktop frame.

Visual language (reuse exactly): white cards with 1px #e3e8ef border and 10px radius on a #f3f5f9
page; text #0f172a / secondary #475569 / muted #64748b; primary blue #2563eb with soft #dbeafe;
status pairs green #15803d/#dcfce7, amber #b45309/#fef3c7, red #b91c1c/#fee2e2, cyan #0e7490/#cffafe,
neutral #475569/#e2e8f0; dark navy sidebar #0f172a with #cbd5e1 text; font Inter.

Desktop layout, left to right / top to bottom:
1. Sidebar 248px: logo square "E" + "Easy Admin"; one group "Operations" with the single
   entry "Delivery agents" (active) — only the page that exists is listed.
2. Top bar 56px: "Admin panel" label left; theme toggle and admin email chip right.
3. Page header: title "Delivery agents", one-line description, primary button "Add agent".
4. Four KPI tiles in a row: Total agents 32 · Pending approval 5 · Online now 17 (hint "7 busy · 8 offline")
   · Average rating 4.5 (hint "Out of 5, rated agents only"). Each tile has an icon chip on the right.
5. Filter card: search "Search name, phone or email" (wide), dropdowns "All vehicles",
   "Approved and pending", "Any status", outlined "Reset" button at the right end.
6. Table card: columns Agent (initials avatar + name + short id), Contact (phone + email),
   Vehicle (cyan badge), Approval (green "Approved" / amber "Pending" badge), Status (dot badge
   Online green / Busy amber / Offline grey), Assigned, Completed, Rating (star + 4.8), Joined
   (2025-03-12), Actions (eye icon, check or ban icon). 10 rows. Footer: "Total 32" left,
   paginator with page-size dropdown right.
Phone 375: sidebar hidden behind a hamburger; KPI tiles stacked one per row; filters stacked full
width; the table scrolls horizontally inside its card; paginator centred; buttons full width.
States: loading = grey skeleton bars in tiles and 8 table rows; empty = inbox icon, "No agents match
these filters", "Clear filters" button; error = warning icon, "Could not load data", server message,
"Try again" button.
Numbers use a three-digit comma, dates YYYY-MM-DD, money ₹ without decimals. All text in English.
```

Then fill `docs/design-check.md` against what Claude Design produced (≥ 3 real questions).

## 2. Screenshots  → Notion §2

`npm run shots` already wrote `screenshots/delivery-agents-list-<width>.png` for the 10 WM widths.
Upload them to the Notion page (section 2).

## 3. Deploy  → Notion §2 "Demo link"

```bash
npx vercel            # first run: browser login, accept defaults (framework Next.js)
npx vercel --prod     # production URL for the Notion page
```

No env vars needed: with no `NEXT_PUBLIC_API_BASE_URL` the service uses the mock automatically.

## 4. Git  → Notion §2 "Repo / branch"

```bash
git add -A
git commit -m "feat: delivery agents list screen (HW1) — mock data, WM tokens, responsive"
git remote add origin <your GitHub repo>
git push -u origin main
```

## 5. Check output  → Notion §6

Paste the real output of `npm run type-check` and `npm run lint` (both clean as of this build).

## 6. Prompts  → Notion §4

Claude Code keeps the transcript at `C:\Users\neera\.claude\projects\<repo-slug>\*.jsonl`.
Every line is JSON; your prompts are the entries with `"type":"user"` whose `message.content`
is a string. Print them in order and paste verbatim, Hinglish included — Vaishali asked for the
untidied version. If you prefer, build the screen again in a fresh session in this repo with the
Step 2 prompts from the training page; the components make that a 30-minute job.

## 7. Submit

1. Fill every section of the Notion page (screen, design link, design-check questions, demo, repo,
   screenshots, how to run, prompts, one problem, check output).
2. Set **HW1 status → Submitted** and **HW1 submitted on**.
3. Post in **#c1_notice_board** (the draft is already in your Slack drafts) and comment on the main
   task page tagging Vaishali.
