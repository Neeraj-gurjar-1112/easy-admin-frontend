# HW1 — submit checklist (due Tue 2026-10-06, Vaishali asked for 17:00 IST)

The screen is built and all checks pass. What is left is the evidence the reviewer grades.
Do the steps in this order; every step says which Notion section it feeds.
Notion page: https://app.notion.com/p/3f0326b2d5fb819f9d47cd6007450607

## 1. Design link — Figma file from the generated kit (10 min)

The design exists: `node scripts/design-kit/build.mjs` writes 13 SVG artboards + a token sheet to
`public/design/` (board: https://easy-admin-frontend.vercel.app/design/), and
`node scripts/design-kit/export.mjs` writes the PNG exports and the design-vs-build images to `docs/design/`.

Make it a Figma file (reviewers asked for Figma):
1. figma.com → New design file → rename it "Easy Admin — Delivery agents".
2. Open `D:\projects\easy-admin-frontend\public\design\` in Explorer, select all 13 `.svg` files and drag them
   onto the Figma canvas (or File → Import). Each SVG lands as an editable frame with real text layers.
3. Arrange them left to right in file order (01 … 13); Figma keeps the file names as frame names.
4. Share → "Anyone with the link can view" → Copy link.
5. Paste the link into Notion HW1 §1 "Design" (replace "_link added after importing the SVGs_") and HW2 §10 "Design link".

Then fill `docs/design-check.md` (done) and the questions (done) — nothing else to write.

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
