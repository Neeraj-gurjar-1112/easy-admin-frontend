# Test cases — Easy Admin · Delivery agents (HW2)

Format: WM QA Template ("Verify that …" statements with ID, type P = positive / N = negative, precondition, steps, expected result).
Areas follow the training page Step 7 table: page opens · main flow · validation · list · roles · states · screen sizes.
Automated coverage: `e2e/delivery-agents.spec.ts` (read-only), `e2e/delivery-agents.mutation.spec.ts` (create / edit / delete), `e2e/responsive.spec.ts`.

**Common precondition:** Easy-Backend-v2 running on :8080 with `node scripts/seed-delivery-agents.js` applied (32 agents, admin `admin@example.com`); frontend on :3000 with `NEXT_PUBLIC_USE_MOCK=0`.

| ID | Area | Type | Test case | Precondition | Steps | Expected result | Auto |
|---|---|---|---|---|---|---|---|
| DA-001 | Page opens | P | Verify that the list page opens with title, KPI tiles and rows | Logged in | Open `/delivery-agents/list` | Browser title "Easy Admin…"; heading "Delivery agents"; 4 tiles (Total agents, Pending approval, Online now, Average rating) with numbers; table shows 10 rows; footer "Total 32" | spec |
| DA-002 | Page opens | P | Verify that the root URL redirects to the list | Logged in | Open `/` | URL becomes `/delivery-agents/list` | – |
| DA-003 | Page opens | P | Verify that the sidebar lists only the pages that exist and marks the current one | Logged in | Look at the sidebar | Only "Delivery agents" under Operations, highlighted as active; no dead links | – |
| DA-010 | Main flow | P | Verify that an agent can be created with valid data | Logged in | Add agent → fill name, email (unique), phone `+91 90000 12345`, vehicle, password ≥ 8 → Create agent | Redirect to details; toast "Agent created"; name, email shown; Approval badge "Pending" | mutation |
| DA-011 | Main flow | P | Verify that the created agent appears in the list | DA-010 done | List → search the new email | Exactly one row with the new name; "Pending" badge | mutation |
| DA-012 | Main flow | P | Verify that editing an agent updates the details | DA-010 done | Details → Edit → change name → Save changes | Redirect to details; toast "Changes saved"; new name in heading; list shows new name | mutation |
| DA-013 | Main flow | P | Verify that approve flips the badge | Agent pending | Details → Approve | Toast "Agent approved"; badge "Approved"; list row shows Approved; "Pending approval" tile decreases by 1 | mutation |
| DA-014 | Main flow | P | Verify that suspend asks for confirmation and marks the agent offline + pending | Agent approved | List row → Suspend → confirm | Dialog "Suspend agent"; after confirm toast "Agent suspended"; badges Pending + Offline | – |
| DA-015 | Main flow | N | Verify that cancelling the suspend dialog changes nothing | Agent approved | List row → Suspend → Cancel | No request sent; badges unchanged | – |
| DA-016 | Main flow | P | Verify that delete asks for confirmation and removes the agent | DA-010 done | List row → Delete → confirm | Dialog "Delete agent"; toast "Agent deleted"; search for the email shows "No agents match these filters"; Total decreases by 1 | mutation |
| DA-017 | Main flow | P | Verify that delete from the details page returns to the list | Agent exists | Details → Delete → confirm | Toast; URL `/delivery-agents/list` | – |
| DA-018 | Main flow | N | Verify that cancelling the delete dialog changes nothing | Agent exists | List row → Delete → Cancel | Dialog closes; row still listed; Total unchanged; no DELETE request | spec |
| DA-020 | Validation | N | Verify that an empty create form shows required messages | Logged in | Create → click Create agent | "Name is required", "Email is required", "Phone is required", "Password is required"; no request sent | spec |
| DA-021 | Validation | N | Verify that wrong formats show the backend rules | Create form | name `A`, email `not-an-email`, phone `12345`, password `short` → submit | "Name must be at least 2 characters long", "Please provide a valid email address", "Phone must contain at least 10 digits", "Password must be at least 8 characters long" | spec |
| DA-022 | Validation | N | Verify that too-long values are blocked | Create form | Name of 101 chars; license of 51 chars | Name input stops at 100 (maxLength); license shows "License number cannot exceed 50 characters" | – |
| DA-023 | Validation | N | Verify that a duplicate email is rejected by the server and shown under the field | Agent with that email exists | Create with an existing email → submit | Message "Email is already registered" under Email; typed values kept; stays on create page | mutation |
| DA-024 | Validation | N | Verify that the submit button cannot be clicked twice | Create form filled | Click Create agent twice quickly | Button shows spinner and is disabled during the request; exactly one agent created | – |
| DA-025 | Validation | P | Verify that edit keeps the password unless a new one is typed | Agent exists | Edit → change only name → Save | Agent can still log in with the old password (backend test `admin_delivery_agents_v2.test.js` covers the re-hash path) | backend |
| DA-026 | Validation | N | Verify that the server validation message is shown when the client rule is bypassed | Logged in | Send `PATCH /api/admin/delivery-agents/:id` with `{ phone: "123" }` via Swagger/curl | 400 `{ error: "Validation failed", details: [{ field: "phone", … }] }` | backend |
| DA-027 | Validation | N | Verify that edit rejects an empty name | Agent exists | Details → Edit → clear Full name → Save changes | "Name is required" under the field; nothing saved; stays on the edit page | spec |
| DA-028 | Validation | N | Verify that edit rejects a wrong phone format | Agent exists | Edit → Phone `12345` → Save changes | "Phone must contain at least 10 digits"; nothing saved | spec |
| DA-030 | List | P | Verify that search matches name, email and phone digits | Logged in | Type `priya`; then `9000000002`-style digits of a known phone | Rows narrow to the matching agent after the 400 ms debounce; phone digits match even with spaces in the stored value | spec |
| DA-031 | List | P | Verify that the vehicle filter works | Logged in | Vehicle → Scooter | Every row shows the Scooter badge; Total updates | – |
| DA-032 | List | P | Verify that the approval filter works | Logged in | Approval → Pending approval | Every row shows "Pending" | spec |
| DA-033 | List | P | Verify that the status filter works | Logged in | Status → Busy | Every row shows "Busy" | – |
| DA-034 | List | P | Verify that sorting works on Agent, Assigned, Completed, Rating, Joined | Logged in | Click Rating header twice | Descending: first row has the highest rating (4.9) | spec |
| DA-035 | List | P | Verify that paging works and the total stays constant | Logged in | Next page | Different first row; "Total 32" unchanged; page 2 highlighted | spec |
| DA-036 | List | P | Verify that changing page size reloads from page 1 | Logged in | Go to page 2 → page size 20 | 20 rows shown; paginator back on page 1 | – |
| DA-037 | List | P | Verify that a filter change resets to page 1 | On page 2 | Choose any filter | Paginator shows page 1 | – |
| DA-038 | List | P | Verify that Reset clears every filter | Filters applied | Click Reset | Search empty, dropdowns show placeholders, full list back; Reset disabled | spec |
| DA-040 | Roles | N | Verify that a visitor without a session is redirected to login | Logged out (fresh browser) | Open `/delivery-agents/list` | URL `/login?next=%2Fdelivery-agents%2Flist`; login card shown | spec |
| DA-041 | Roles | N | Verify that wrong credentials show the API message | Login page | Wrong password → Sign in | "Invalid credentials" from the API shown above the form | spec |
| DA-042 | Roles | P | Verify that login returns to the page the visitor wanted | DA-040 | Sign in with valid credentials | Redirect to `/delivery-agents/list` | setup |
| DA-043 | Roles | N | Verify that an expired or removed token sends the user to login on the next request | Logged in | Delete `easy_admin_token` from localStorage → refresh | Redirect to login; after sign-in the list loads | – |
| DA-044 | Roles | N | Verify that a non-admin JWT is rejected by the API | Any | Call `GET /api/admin/delivery-agents` with a client/seller token | 401/403 from `requireAdmin`; no data | backend |
| DA-045 | Roles | P | Verify that Sign out clears the session | Logged in | Top bar → Sign out | Redirect to login; opening the list again redirects to login | – |
| DA-050 | States | P | Verify the loading state | Logged in, slow network | Open the list | Skeleton tiles and 8 skeleton rows until data arrives | – |
| DA-051 | States | P | Verify the empty state (filters) | Logged in | Search `zzzqqq-nobody` | Inbox icon, "No agents match these filters", "Clear filters" button | spec |
| DA-052 | States | P | Verify the empty state (no agents) | Database with 0 agents | Open the list | "No delivery agents yet" + "Add agent" button; tiles show 0 | – |
| DA-053 | States | P | Verify the error state shows the API message and retries | Backend stopped | Open the list → start backend → Try again | "Could not load data" + "Cannot reach the server…"; after Try again rows load | – |
| DA-054 | States | N | Verify the details page handles an unknown id | Logged in | Open `/delivery-agents/details/64b000000000000000000000` | "Could not load data" with "Delivery agent not found" and Try again; Back to list works | – |
| DA-055 | States | P | Verify that a toast survives navigation | Logged in | Create an agent | Toast is still visible on the details page | mutation |
| DA-056 | States | N | Verify that an edit URL with an unknown id shows the not-found state | Logged in | Open `/delivery-agents/edit/64b000000000000000000000` | "Could not load data" + "Delivery agent not found" + Try again; Back to list works | spec |
| DA-057 | States | N | Verify that create and edit show the API error when the server is down | Backend stopped | Fill a valid create (or edit) form → submit | Banner "Cannot reach the server…"; typed values kept; submit enabled again; nothing lost | – |
| DA-060 | Screen sizes | P | Verify that no page scrolls sideways at 1920 · 1600 · 1440 · 1366 · 1280 · 1024 · 991 · 768 · 640 · 480 · 375 | Logged in | `npm run shots` | 44 checks pass (list, details, create, login × 11 widths); screenshots in `./screenshots` | responsive |
| DA-061 | Screen sizes | P | Verify the sidebar becomes a drawer below 1024px | Logged in, width 991 | Click ☰ → click backdrop | Drawer slides in over a dimmed backdrop; closes on backdrop or on navigation | – |
| DA-062 | Screen sizes | P | Verify the table scrolls inside its card on a phone | Width 375 | Swipe the table | Table scrolls horizontally inside the card; page does not | responsive |
| DA-063 | Screen sizes | P | Verify tiles and filters stack on a phone | Width 375 | Open list | Tiles one per row; search + 3 dropdowns + Reset full width; Add agent full width | responsive |
| DA-064 | Screen sizes | P | Verify the form is one column on a phone | Width 375 | Open create | Fields one per row; switches stacked; buttons full width, Cancel under Create | responsive |
| DA-070 | Formats | P | Verify WM formats | Logged in | Look at Joined, counts, money | Dates `YYYY-MM-DD`; numbers with three-digit comma (1,534); money `₹` without decimals | – |
| DA-071 | Light/dark | P | Verify every colour has a dark counterpart | Logged in | Toggle the moon icon | All badges, tiles, table, sidebar switch; no white flashes; choice remembered after reload | – |

**Not covered on purpose:** multiple admin roles (Easy has one admin role), file uploads (none on this entity), concurrent edits.
