# Design check — Step 2 Part A

Design: https://easy-admin-frontend.vercel.app/design/ (13 artboards generated from the token file; SVG sources `public/design/`, PNG exports `docs/design/`; Figma file = the same SVGs imported)
Screen: Easy Admin → Delivery agents list
Checked against: WM | HTML development guideline (checklist when reviewing a design before development)

Legend: **Yes** = shown in the design and followed · **Not shown** = the design does not define it, so a decision was taken and recorded · **No** = design differs from the rule

| # | Check (WM HTML development guideline) | Result | Question / decision |
|---|---|---|---|
| 1 | Container size the same as other pages? | Yes | Sidebar 248px + fluid content capped at 1600px — same as the Easy EJS admin panel (`--sidebar-w: 248px`). Decision: keep parity so the page can sit next to the existing panel. |
| 2 | Same element spaced the same way everywhere? | Yes | One spacing scale (4 / 8 / 12 / 16 / 24 / 32px as `$space-*`): 16px between tiles, filters and table; 24px page padding (16px on phones). |
| 3 | Repeated parts (badges, KPI tiles, table rows, paginator) identical everywhere? | Yes | Each is one component (StatusBadge, StatTile, AgentTable, ListPagination); the details page reuses StatTile and StatusBadge unchanged. |
| 4 | One font family, clear sizes for title / body / small? | Yes | Inter: title 24px/700, KPI number 28px/700, body 14px/400, labels 12px/500. **Q1** |
| 5 | Clear how long text wraps on small screens? | Not shown | Decision: agent name and email truncate with an ellipsis inside the table cell (fixed column widths, table scrolls); the details page shows full text with `overflow-wrap: anywhere`. **Q2** |
| 6 | Empty state designed? | Yes (filters) / Not shown (no agents at all) | Decision: two variants — "No agents match these filters" + Clear filters, and "No delivery agents yet" + Add agent. **Q3** |
| 7 | Loading state designed? | Yes | Skeleton bars in the 4 tiles and 8 skeleton table rows, same heights as the real content. |
| 8 | Error state designed (API failed)? | Yes | Warning icon, "Could not load data", the API's own message, Try again button. |
| 9 | Missing data cell designed (no rating yet, no license, no email)? | Not shown | Decision: show "-" (WM-consistent), never hide the cell; rating 0 → "-" without a star. **Q4** |
| 10 | Buttons get width from padding (no fixed px)? | Yes | Width from padding; on phones the action row stretches with flex, not with a px width. Min height 44px. |
| 11 | Images / icons fit their box? | Yes | Icon chips 40px, avatars 36px (56px on details), badge icons 12px. |
| 12 | Table behaviour on phone shown? | Not shown | Decision: the table scrolls horizontally inside its card (`.table-scroll-box`); the page never scrolls sideways. **Q5** |
| 13 | Sidebar behaviour below 1024px shown? | Not shown | Decision: drawer over a dimmed backdrop, opened by ☰, closes on backdrop click or navigation. **Q6** |
| 14 | Filter bar on phone shown? | Not shown | Decision: search, the three dropdowns and Reset stack full width below 768px. |
| 15 | Light and dark colours both defined with 1:1 names? | Yes | 24 colour pairs `[day]/[night]` in `_variables.scss`, same name both modes, emitted as CSS variables. |
| 16 | Date / number / money formats follow WM? | Yes | `YYYY-MM-DD`, three-digit comma, `₹` without decimals (`formatters.ts`). |
| 17 | Browser support requested? | Not shown | Decision: Chromium / Chrome for the homework. **Q7** |
| 18 | Row actions on phone: icon-only buttons large enough? | Not shown | Decision: 44×44px icon buttons with tooltip + aria-label; no label text in the row. |

## Questions I wrote down (sent to the designer — here: answered by me and recorded above)

1. **Font:** Easy's EJS panel uses the system font stack; the new screen uses Inter. Keep Inter for the Next.js admin, or match the system font so both panels look identical? → Inter (self-hosted via next/font), noted as a deliberate difference.
2. **Long text:** agent names up to 100 characters and long emails — truncate in the table or wrap? → truncate in the table (ellipsis), wrap on the details page.
3. **Empty states:** is "no agents at all" the same screen as "filters matched nothing"? → no, two variants with different CTAs (Add agent vs Clear filters).
4. **Missing values:** rating not yet given, no license number, no email — "-", "N/A" or hide? → "-".
5. **Phone table:** horizontal scroll inside the card, or convert rows to stacked cards? → scroll inside the card (columns stay comparable; cards are a v2 idea).
6. **Sidebar below 1024px:** collapse to icons or hide behind a hamburger? → hamburger drawer with backdrop.
7. **Browsers:** any requirement beyond Chrome? → none for the homework; Firefox/Safari unchecked and listed in the build report.
