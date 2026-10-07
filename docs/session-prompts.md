# Prompts I typed in this session (verbatim, untidied)

Source: Claude Code transcript aa14afce-7627-4815-aa87-fd4bc0d469d6.jsonl. Pasted Slack/terminal text is kept as it was; Hinglish as typed.

## 1 — 2026-10-05T10:29:07.979Z

```
<pasted_content id="fc29">
minkyu  [2:22 PM]
:white_check_mark: AI Frontend Training — Homework for Backend Developers @channel
All backend developers, please complete the AI Frontend Training homework prepared by @Vaishali Naruka (Frontend).
Goal: every backend developer can take a design, build the screen, connect it to a real API, test it and hand it to QA on their own, using Claude Code.

Who: @Saswat Kumar Sahoo (Backend-Java) @Sandip Mondal (Backend and Frontend) @Neeraj Gurjar(Backend) @Pranesh Ghosh(Backend - Java) @Nikky Navvya(Backend-NodeJS) @Sachin S M (Backend -Java)

Training page: TL | AI Frontend Training — Building Frontend with Claude Code (for Backend Developers)
Read section 1 first — React and Next.js basic concepts are mandatory. You must be able to explain any part of your code. "Claude wrote it" is not an answer.

Homework 1 — Build a screen from a design (Steps 1, 2, 5)
Build one list screen from a Figma frame with mock data, working at all screen sizes (1920 → 375)
Set up CLAUDE.md and the skills, run the design check, reuse existing components, WM naming, no hardcoded colours or numbers
Show loading, empty and filled states


Homework 2 — Full feature with a real API (Steps 3–8) — start only after passing Homework 1
List, create, details, edit, delete connected to a real backend API
Service + hook pattern, search/filter/paging, validation matching the backend
Test cases (WM QA Template), Playwright test + separate mutation test, QA hand-over build report


How to submit (both): send Vaishali a working demo link, repo/branch link, and a short README (what you built, how to run it, prompts and skills used, one problem you hit and how you solved it). Missing any of these = Resubmit.
Review: Vaishali reviews with written feedback within 1 working day. Result is Pass or Resubmit. Pass criteria are in section 13 of the page.

Questions → reply in this thread or ask @Vaishali Naruka (Frontend).
</pasted_content id="fc29">

bhai isme kya karna hai koi achha sa idea de sakte hai
```

## 2 — 2026-10-05T10:58:17.492Z

```
bhai kar sakte ho abhi
```

## 3 — 2026-10-06T08:21:59.473Z

```
ek bar isko run karo fir me dekhta hu ki kya bnaya hai or ek msg de rha hu usme kese kiya hai. 
Nikky Navvya(Backend-NodeJS)  [5:17 PM]
@Vaishali Naruka (Frontend)
HW1 submitted, please review — https://app.notion.com/p/divii/Nikky-Navvya-3f0326b2d5fb81b9aff5c9183972a107
HW2 submitted, please review — https://app.notion.com/p/divii/Nikky-Navvya-3f0326b2d5fb81b9aff5c9183972a107Sent using @.github/workflows/claude-review.yml
```

## 4 — 2026-10-06T08:34:37.348Z

```
bhai ye to kuch khas nhi hai yrr as fullstack dev esa krega to achha thodi na lgega kuch achha kare to jada better lgega D:\Easy-Backend-v2 ye wala project dekho or agr isko achhi se bna sakte to to kar do or muje ye shear bhi karna hai jese nikky ne kya hai vese slack me draft kar dena bad mr send kar dunga
```

## 5 — 2026-10-06T10:15:57.266Z

```
ab ye btao ki tumne kay kam kiya hai or kyu
```

## 6 — 2026-10-06T11:02:07.837Z

```
bhai homework2 wala bhi kar do
```

## 7 — 2026-10-06T12:22:47.356Z

```
iska patha kya hai taki me vaishali ko share karu
```

## 8 — 2026-10-06T12:26:12.208Z

```
bhai muje samjh nhi aa rha hai ki is task me kya karna hai me hi confuse ho rha hu
```

## 9 — 2026-10-06T12:41:17.158Z

```
<pasted_content id="fc29">
PS D:\projects\easy-admin-frontend> git remote add origin https://github.com/Neeraj-gurjar-1112/easy-admin-frontend.git
PS D:\projects\easy-admin-frontend> git push -u origin main
error: src refspec main does not match any
error: failed to push some refs to 'https://github.com/Neeraj-gurjar-1112/easy-admin-frontend.git'
PS D:\projects\easy-admin-frontend> git push -u origin main
error: src refspec main does not match any
error: failed to push some refs to 'https://github.com/Neeraj-gurjar-1112/easy-admin-frontend.git'
PS D:\projects\easy-admin-frontend> npx vercel
Need to install the following packages:
vercel@62.4.0
Ok to proceed? (y) y
Vercel CLI 62.4.0 (Node.js 24.11.0)
> NOTE: The Vercel CLI now collects telemetry regarding usage of the CLI.
> This information is used to shape the CLI roadmap and prioritize features.
> You can learn more, including how to opt-out if you'd not like to participate in this program, by visiting the following URL:
> https://vercel.com/docs/cli/about-telemetry
Error: No existing credentials found. Run `vercel deploy --temporary` to create a temporary deployment you can claim later, or `vercel login` to log in.
Learn More: https://err.sh/vercel/no-credentials-found
PS D:\projects\easy-admin-frontend> npx vercel --prod
Vercel CLI 62.4.0 (Node.js 24.11.0)
Error: No existing credentials found. Run `vercel deploy --temporary` to create a temporary deployment you can claim later, or `vercel login` to log in.
Learn More: https://err.sh/vercel/no-credentials-found
PS D:\projects\easy-admin-frontend>
</pasted_content id="fc29">
```

## 10 — 2026-10-06T12:45:09.910Z

```
<pasted_content id="fc29">
PS D:\projects\easy-admin-frontend> git branch -M main
PS D:\projects\easy-admin-frontend> git push -u origin main
To https://github.com/Neeraj-gurjar-1112/easy-admin-frontend.git
 ! [rejected]        main -> main (non-fast-forward)
error: failed to push some refs to 'https://github.com/Neeraj-gurjar-1112/easy-admin-frontend.git'
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart. If you want to integrate the remote changes,
hint: use 'git pull' before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
PS D:\projects\easy-admin-frontend>
</pasted_content id="fc29">
```

## 11 — 2026-10-06T12:58:59.099Z

```
<pasted_content id="fc29">
No existing projects found under gurjarneeraj504-2355. Creating new project.
? Name? Press ↑ to return to project options (easy-admin-frontend)
? Which project? Create a new project
? Name? Press ↑ to return to project options easy-admin-frontend
? Connect this Git repository to automatically deploy changes on every push? yes

  Detected Next.js (Build Command: next build, Output Directory: Next.js default)
? Customize settings? yes
? Which settings would you like to overwrite (select multiple)?

✓ Created         gurjarneeraj504-2355/easy-admin-frontend
> Connecting GitHub repository: https://github.com/Neeraj-gurjar-1112/easy-admin-frontend
Error: Failed to link Neeraj-gurjar-1112/easy-admin-frontend. You need to add a Login Connection to your GitHub account first. (400)
Visit https://vercel.com/docs/accounts/create-an-account#login-methods-and-connections for more information.
  Inspect         https://vercel.com/gurjarneeraj504-2355/easy-admin-frontend/6SyeGbxL2eK3CNkpxWZ3Q7KpXSzU
  Production      https://easy-admin-frontend-3ep6ewz2d-gurjarneeraj504-2355.vercel.app
Error: Command "npm install" exited with 1
PS D:\projects\easy-admin-frontend>
</pasted_content id="fc29">
```

## 12 — 2026-10-06T13:00:00.444Z

```
tum hi kar do ye sab
```

## 13 — 2026-10-06T13:09:50.835Z

```
apna H2 bhi ho rha hai ya karna hai
```

## 14 — 2026-10-06T13:10:40.676Z

```
agar kar sakte ho to kar do abhi
```

## 15 — 2026-10-07T08:56:40.420Z

```
https://app.notion.com/p/divii/b22ec39a9d1f4613ac15d005001d3dba?v=f311589402e4452583b37a9610bd134a&p=3f0326b2d5fb819f9d47cd6007450607&pm=s
vaishali ne kuch feedbCK diya hai uska kya karna hai or fix bhi kar do
```
