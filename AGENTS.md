# TomatoTimers — Project Ground Rules

> READ THIS FILE FIRST, before doing anything. It is the shared brain across
> every chat session. Update the "Current State" section before finishing any
> work session.

## The human

- Non-coder. Works through GitHub Desktop (branch flow), the GitHub web UI,
  and phcode. NEVER suggest terminal commands, git CLI, or local dev
  servers.
- Works on a Windows PC (main machine) and a MacBook Air (secondary).
- **Google Drive is NO LONGER part of the setup.** The working folder is a
  local git clone of the repo on the Windows PC. GitHub is the bridge
  between machines.
- GitHub repo is the master and publishes the live site (tomatotimers.com).
  The default branch is `master` (not `main`); `development` is the
  staging branch.

## Machine setup (the human's actual workflow)

- **Workspace:** a local git clone on the Windows PC:
  `C:\Users\andyg\Documents\GitHub\andygiovanny.github.io`
  (origin: `github.com/andygiovanny/andygiovanny.github.io`). This is THE
  one working folder — GitHub Desktop watches it, and all editing happens
  here, including by Kimi Work. Kimi Work only edits files; it NEVER
  commits, pushes, pulls, or merges.
- **Legacy clone (retire, do NOT edit):**
  `C:\Users\andyg\Documents\Working On\Coding\Github Backup\andygiovanny.github.io`
  was the old workspace — two live clones caused the 2026-10-28 "Desktop
  sees no changes" confusion. Keep it as a read-only backup or delete it;
  never edit both folders.
- **Publish (new branch flow, 2026-10-28):** when 100% happy, the human
  commits + pushes to the **`development` branch** first (GitHub Desktop),
  then merges development → `master` on github.com. Live site rebuilds
  from `master`. Nothing publishes itself.
- **Never mix web-UI uploads with the branch flow.** A web-UI drag-upload
  creates a remote commit the local clone doesn't have — the next push
  from GitHub Desktop is REJECTED ("non-fast-forward"/conflict). This
  exact hiccup happened 2026-10-28 (web upload commit "asd"). If a push
  is rejected: Fetch/Pull in GitHub Desktop FIRST (it merges cleanly),
  then push.

## Golden rules

1. GitHub holds only finished, human-approved work. Never push/upload
   half-finished pages. Each page or language set is complete before
   the human commits and pushes.
2. Single-page deliveries are loose files named exactly as they go into the
   repo — NEVER zip a single page.
3. **Freshness check (the only ritual):** before starting work, the local
   clone must be up to date — Fetch/Pull in GitHub Desktop first,
   especially if anything was uploaded via the web UI or edited from the
   MacBook since the last session.
4. If a file with a duplicate name or unexpected copy appears, STOP —
   do not guess which is right. Ask the human or compare before continuing.
5. Git history on `master` is the undo button now. Still keep dated
   backups of big rewrites in `_backups/` — that folder is local-only,
   never committed or uploaded.
6. **English first, always.** Build and change features on the English
   master pages only, then let the human review. NEVER touch the
   translations (`id/`, `es/`, `pt/`, `vi/`) until the human has seen the
   English version and explicitly given the go-ahead.

## Repo structure

- English master pages are folders: `index.html`, `52-17/`, `20-20-20-rule/`,
  `flowtime/`, `ambience/`, `custom-timer/`
- Folder names are hyphenated everywhere now (the old `custom timer/`
  space-folder quirk was removed 2026-10-28) — local matches repo, upload
  folders as-is.
- Translations live in per-language subfolders: `id/`, `es/`, `pt/`, `vi/`
- **Indonesian (`id/`) is the pilot language** — wording is always reviewed
  and approved there first, before the other translations.

## Site conventions

- Static site, no build step. Vanilla JS, one IIFE per page, no frameworks.
- The user views pages at ~140% browser zoom — verify layouts hold up there.
- Timer bar controls are locked to 34px height with inline SVG icons
  (never emoji) in buttons.
- localStorage keys are per-page prefixed (e.g. `byo_*` on custom-timer,
  `tt_ambience_presets_v1` shared ambience presets across pages).
- Every page needs its full SEO set: unique title (~76 chars), meta
  description, canonical, hreflang cluster once translations exist, and
  JSON-LD (WebApplication + BreadcrumbList + FAQPage) that matches visible
  on-page text exactly.
- Mascot art is handled by the user — pages use a `<!-- MASCOT PLACEHOLDER -->`
  comment where art goes.

## Current state

Short summary of where the project stands. Keep it under ~10 lines; details
belong in the work log below.

- **Setup (2026-10-27):** working folder is now local-only on the Windows PC
  (Google Drive removed from the workflow). GitHub is the machine bridge.
- **custom-timer (English + all 4 translations): DONE** — multi-timer
  profiles with named settings, share links (`#share=`), builder with
  drag-reorder/duplicate/per-phase everything, editable extend length,
  Notification 1–6 selector, ambience pill (WebAudio, single `custom` slot in
  `tt_timer_ambience_settings_v1`), keyboard shortcuts (Space = play/pause,
  ArrowRight = skip), duplicate-timer button, tasks, daily stats.
  `id/`, `es/`, `pt/`, `vi/custom-timer/` shipped 2026-10-26 with full SEO
  sets, translated UI + JS strings, and 6-link hreflang on all 5 pages.
- **Cards:** every page's "Other Rhythm" row now ends with a Build Your Own
  Timer card (`assets/images/custom-timer-card.png` — Andy's frame_01.png
  art, resized 2160→480 RGBA with transparency, 149 KB). Ambience
  Studio cards removed from all card rows (only existed on the 4 translated
  20-20-20 pages); the nav button already covers it.
- **Other timers** (index, 52-17, 20-20-20-rule, flowtime) + all 4
  translations (id/es/pt/vi): **keyboard shortcuts DONE** (2026-10-23) —
  Space = play/pause everywhere; → = skip on 52-17/20-20-20-rule, = ☕ break
  button on flowtime; main index has no skip so Space only. Ambience pages
  (all 5 languages): Space = master play/pause-all. User is still porting
  ambience-pill/duplicate features to other timers themselves.
- **Pending:** as of 2026-10-28 16:00, origin/master ("asd" commit) already
  contains EVERYTHING through pt 22 (all 30 pages + assets + hyphen
  custom-timer). Local-only changes awaiting Andy's next commit+push: the
  custom-timer ad-positioning fix (pt 24, 5 custom-timer files) and this
  AGENTS.md. Local folder renamed `custom timer/` → `custom-timer/` (pt 23)
  — remote already hyphen-only. Hreflang: VERIFIED COMPLETE 2026-10-27.
  Custom-timer feature set: COMPLETE (2026-10-27).

## Work log (newest on top)

The running record of progress — this is how a fresh session on ANY machine
knows what happened without asking the human. Entries must be short: date,
what changed (file names), what's next.

- **2026-10-28 (Kimi Work, pt 30):** pt-29's to-do gap fix extended to the
  remaining 15 pages (52-17, 20-20-20-rule, flowtime × en/id/es/pt/vi) with
  Andy's go — identical rule text, same replacement
  (`min-height: 400px` removed from `.todo-list-min-height`). The 400px
  dead-gap rule is now gone from ALL 20 pages that had it. Backups
  `_backups/2026-10-28_todogap15/`. Pending in GitHub Desktop at close:
  20 page files (pts 29+30) + AGENTS.md awaiting Andy's commit+push.
- **2026-10-28 (Kimi Work, pt 29):** dead gap below the to-do list removed
  on all 5 main index pages — `.todo-list-min-height` had
  `min-height: 400px`, so an empty/short list reserved 400px and left a
  huge blank before the Animated Video Timers section. Rule is now
  `height: auto !important` only; the list takes its real height and a full
  list still pushes the videos down naturally. Backups
  `_backups/2026-10-28_todogap/`. NOTE: the same 400px rule still exists on
  the 15 52-17/20-20-20/flowtime pages (same dead-gap effect above their
  explainer/video sections) — Andy to confirm before applying there.
- **2026-10-28 (Kimi Work, pt 28):** main-page content column narrowed to
  the other pages' standard — Andy flagged the main page's column as
  visibly wider than 52-17's ("make it like the top one"). All 5 index
  pages: `.header-background > .container { max-width: 1090px !important }`
  (Bootstrap's 1170px container capped to match 52-17's effective ~1060px
  content width: 1140 max-width minus 40px padding per side). Keeps the
  right-aligned header grid + full-width tabs, just pulls the whole column
  in — bigger clear lanes for the side ads. Pure CSS, one rule. Backups
  `_backups/2026-10-28_narrowcol/`. Next: Andy commits+pushes, eyeballs.
- **2026-10-28 (Kimi Work, pt 27):** main-page side ads brought BACK —
  Andy wanted them visible after all. The pt-22 1850px gate was why they
  never showed at his 140% zoom (~1810 CSS px). New approach on all 5
  index pages: ads moved DOWN (`top: 80px` → `300px`, below the header +
  mode-tab rows so they can't crowd buttons) and the gate lowered to
  `min-width: 1400px` (clean lanes beside the centered content from 1400px
  up; hidden on smaller screens instead of overlapping like the original
  d-lg-block did). Files synced to the GitHub clone; Andy to commit+push.
  Backups `_backups/2026-10-28_admove/`. NOTE: pt-26's "main index hides
  ads below 1850px" is superseded by this entry.
- **2026-10-28 (Kimi Work, pt 26):** "no side ads" investigation — VERDICT:
  ad fill, not code. Live audit of all 6 page types: loader
  (`cdn4.buysellads.net/pub/tomatotimers.js`) ×1, both zone divs, and the
  positioning/gating CSS present and identical to local everywhere; both
  zone IDs are registered inside the BSA publisher script; ads.txt live
  (35 KB, all partners). Empty slots are normal for geo=36 (Indonesia —
  remnant/backfill demand, the "NetShort"-type app ads come and go between
  pageviews; Andy's own screenshots earlier the same day showed the same
  code serving ads). ONE INTENTIONAL exception: main index hides side ads
  below 1850px viewport (pt 22 fix) — at 140% zoom that's expected.
  No files changed.
- **2026-10-28 (Kimi Work, pt 25):** TWO-CLONE PROBLEM found & synced.
  GitHub Desktop watches `C:\Users\andyg\Documents\GitHub\andygiovanny.github.io`
  (HEAD = 999e0b7 "asd", clean) — the "asd" commit came from there, NOT from
  the Kimi workspace (`...\Github Backup\...`), which is why Desktop showed
  "no changes". The pt-24 custom-timer ad fix + AGENTS.md updates were
  copied from the Backup clone into the GitHub clone (verified by diff:
  only the expected changes); Desktop now sees exactly 6 modified files
  (5 custom-timer pages + AGENTS.md). AGENTS.md Machine setup now points at
  the GitHub clone as THE workspace; the Backup clone is legacy/read-only.
  Next: Andy commits those 6 files → push to development → merge to master.
- **2026-10-28 (Kimi Work, pt 24):** custom-timer ads fixed + git state
  investigated. (a) All 5 custom-timer pages were missing the sidebar
  positioning CSS (`.bsa-left/right-sidebar-wrapper { position:absolute;
  left/right:10px; top:80px; ... }`) — only the `.ads-lg-only` display rule
  was there, so the wrappers sat in page flow after the footer and ads
  rendered mid-footer. Added the rules (same values as 52-17). Backups
  `_backups/2026-10-28_ctadfix/`. (b) Andy's push conflicts EXPLAINED: the
  workspace is a git clone (branch master) and was 1 commit behind —
  origin/master had commit 999e0b7 "asd" (2026-10-28 15:53, a web-UI batch
  upload) the clone didn't have, so pushes got rejected. Verified remote
  now: hyphen `custom-timer/` only (space folder GONE — 404 fixed), all
  fixes through pt 22 present, `development` branch exists at the same
  commit. Working tree matches origin/master except the pt-24 custom-timer
  ad fix + AGENTS.md updates → next GitHub Desktop pull will fast-forward
  cleanly, then commit+push the remainder. AGENTS.md workflow updated to
  the new branch flow (push development → merge to master; never mix
  web-UI uploads with git pushes; pull first if rejected).

- **2026-10-28 (Kimi Work, pt 23):** local folder renamed `custom timer/` →
  `custom-timer/` — the space-folder quirk is gone for good (grep confirmed
  zero path references used the spaced name; all hits were prose). Repo
  structure note updated. STILL OPEN on GitHub: repo has `custom timer/`
  (space) live at `/custom%20timer/` while `/custom-timer/` 404s — Andy to
  upload the renamed local `custom-timer/` folder to the repo and delete the
  repo's space-named folder.
- **2026-10-28 (Kimi Work, pt 22):** sidebar ads + custom-timer 404.
  (a) Main index (all 5 languages): side ads now only render at viewport
  ≥1850px CSS — wrappers changed from `d-none d-lg-block` to `.bsa-side-ad`
  (display:none + `@media (min-width:1850px)`), because the main page's
  content runs edge-to-edge (≈1170px container + right-aligned header grid
  + full-width tabs) and at 140% zoom (~1828 CSS px) the absolute ads at
  left/right:10px crowded the buttons. Other pages stay untouched — their
  narrow 780px stages leave clear ad lanes. Backups
  `_backups/2026-10-28_adviewport/`.
  (b) Card-link 404 ROOT CAUSE FOUND: all 25 "Build Your Own Timer" cards
  link to the CORRECT hyphen URLs — the live EN page was uploaded to the
  repo as `custom timer/` (SPACE, the exact trap AGENTS.md warns about), so
  `/custom-timer/` 404s while `/custom%20timer/` serves the page. The id
  translation IS live correctly at `/id/custom-timer/`. FIX IS ON THE REPO,
  not the files: upload local `custom timer/index.html` into repo path
  `custom-timer/` and delete the repo's space-named folder. No link changes
  made.
- **2026-10-28 (Kimi Work, pt 21):** mode tabs now span edge-to-edge so the
  LOOP tab's right edge aligns with the right-aligned header grid above
  (pt 18's grid overshot because the tabs were 4×22% centered ≈ 88% wide —
  shared style.css rule, left untouched). All 5 index pages: tabs div gets
  `mode-tabs` class → flex row, `flex: 1 1 0`, gap 8px (= the old mr-2),
  `width: auto !important` overriding the 22%. ≤425px restores the original
  2×2 wrap (style.css 320–425px rule). CSS + one class, no JS. Backups
  `_backups/2026-10-28_modetabs/`. Next: Andy eyeballs alignment at 140%.
- **2026-10-28 (Kimi Work, pt 20):** BuySellAds audit — all 30 pages VERIFIED
  complete: 1 loader (`cdn4.buysellads.net/pub/tomatotimers.js`, JS-injected,
  no literal script tag) + both sidebar zones
  (`bsa-zone_1785230759691-0_123456` left, `bsa-zone_1785233220314-9_123456`
  right). Custom-timer pages already had it; nothing needed fixing. No files
  changed.

- **2026-10-28 (Kimi Work, pt 19):** skip button is now loop-aware on all 5
  index pages. `window.onSkipPhase`: in loop mode it calls tomato.js's own
  `onLoop()` (the exact function natural phase-ends use — loads next phase
  AND auto-starts it), guarded to `step < len-1` because onLoop's internal
  guard is `==` not `>=` (calling it past the last phase would index
  loopArray out of bounds). Skip on the final phase (or a finished loop)
  ends the loop cleanly via `onPomodoroTimer()`. Outside loop mode the old
  focus↔short-break toggle is unchanged. Ambience click-listener: `#skipBtn`
  removed from the stopish selector, got its own branch — loop-skip bridges
  the tick gap and switches sound straight to the new phase (same as the
  poller's loopStepped path); non-loop skip pauses as before. Behaviour
  note: skip during a PAUSED loop advances AND resumes playing (mirrors a
  natural transition). All scripts pass node --check. Backups
  `_backups/2026-10-28_loopskip/`. Next: Andy click-tests loop+skip.
- **2026-10-28 (Kimi Work, pt 18):** header 2×2 grid now right-aligned —
  `.button-align` `justify-content: center` → `end` on all 5 index pages,
  so the grid's right edge lines up with the mode-tab row (LOOP button)
  below. One-word CSS change. Backups `_backups/2026-10-28_headerright/`.
- **2026-10-28 (Kimi Work, pt 17):** main-page header buttons widened —
  Andy flagged the 2×2 nav grid as too narrow/touching. All 5 index pages
  (en/id/es/pt/vi): `.button-align` is now a 2-column grid
  (`repeat(2, minmax(0, max-content))`, gap 8px, `.button-row` →
  `display: contents`, buttons width 100%) so each column sizes to its
  longest label — same look as the 52-17 header, but translation-proof
  (no fixed px). Old `min-width: 166px` rules deleted; mobile wrapping now
  kicks in below 1200px (`1fr 1fr` + white-space normal) so the long
  Spanish label can't overflow at md widths. CSS-only change. Backups
  `_backups/2026-10-28_headergrid/`. Next: Andy eyeballs at 140% zoom.
- **2026-10-28 (Kimi Work, pt 16):** YouTube video link swapped on all 5
  20-20-20-rule pages (en/id/es/pt/vi) — old video (rQHew2thSh8, broken)
  → https://youtu.be/7AJw3EB5HpM. One href per page, verified no other page
  referenced the old link. Backups `_backups/2026-10-28_ytlink/`.
- **2026-10-28 (Kimi Work, pt 15):** "▶ now playing" label removed +
  main-page (index) translation port. (a) The
  `<div class="ambience-preset-label">` under the ambience pill is gone from
  all 25 pages that had it (EN + id/es/pt/vi × index, 52-17, 20-20-20-rule,
  flowtime, custom-timer; ambience pages never had it). JS guards make the
  remaining references safe no-ops; label CSS left in place harmlessly.
  Backups `_backups/2026-10-28_presetlabel/`. (b) With Andy's go, ported the
  whole pts 8–14 main-page rework to id/es/pt/vi `index.html` via
  `_backups/_port_main_translations.py` (38 exact-match edits per language,
  aborts on any miss): pill preset dropdown with two-way modal sync, modal
  wording aligned per language (id "⚙️ Timer Kustom", es "⚙️ Temporizador
  Personalizado", pt "⚙️ Timer Personalizado", vi "⚙️ Hẹn Giờ Tùy Chỉnh";
  units MENIT/MINUTOS/MINUTOS/PHÚT; chime NADA/TONO/TOQUE/NHẠC CHUÔNG;
  Cancel/Save translated), round cbtn controls (reset / alternating
  play-pause red circle / skip) via the "Timer controls v1" IIFE, slim red-
  hover pills, Baloo Tammudu digits `#58240E`, wiggle shake removed, tight
  `.ctrl-row` spacing with click-transparent digits. All 48 inline scripts
  pass node --check; JSON-LD parses. Backups `_backups/2026-10-28_main_port/`.
  Next: Andy reviews id first (wording + click-test at 140% zoom), then all
  30 page files are ahead of GitHub and ready for upload.
- **2026-10-27 (Kimi Work, pt 14):** buttons unclickable after the pt-13
  tightening — a layer over the digits area (selection/overlay, visible in
  Andy's screenshot as a blue box reaching down over the buttons) was
  swallowing the clicks. Workaround WITHOUT undoing the tight spacing:
  (a) digits are now click-transparent and unselectable —
  `.timer-box.timer-font` gets `line-height: 1` (fixed 1em line box, no
  inherited-metric surprises) + `pointer-events: none` + `user-select:
  none` (the digits need no mouse interaction); (b) `.ctrl-row` gets
  `position: relative; z-index: 2` so the buttons paint above any
  overlay/digits layer. Gap stays at 4px. Backup
  `_backups/2026-10-27_index_pt14.html`. Next: Andy reloads + confirms the
  buttons click again.
- **2026-10-27 (Kimi Work, pt 13):** tightened the gap between the main
  digits and the round control buttons: `.ctrl-row` margin-top 20px → 4px
  (backup `_backups/2026-10-27_index_pt13.html`, 1 edit). Andy approved the
  pt-12 Baloo centering ("good job"). Main EN page bundle now complete:
  pts 8–13. Next: Andy's final look, then id/es/pt/vi port on his OK.
- **2026-10-27 (Kimi Work, pt 12):** Baloo centering fix, round 2 (backup
  `_backups/2026-10-27_index_pt12.html`, 3 inline-CSS edits). Baloo
  Tammudu's glyphs sit HIGH in the em box, so equal padding made button
  text look off-center. (a) Released the digits from the old Helvetica-era
  clip: `.timer-time.timer-container { height: auto; overflow: visible; }`
  (safe now that #nextTime is display:none) — digits render naturally like
  the other pages. (b) Buttons get asymmetric padding (more top, less
  bottom) to pull the text down to visual center — the page's original
  16/10 padding did the same trick: nav `.button-style` 14px top / 8px
  bottom, mode tabs 10px top / 6px bottom. If Andy still dislikes the
  digits, reverting to Helvetica = deleting the `.timer-box.timer-font`
  font-family rule (one line). Next: Andy reloads + reviews.
- **2026-10-27 (Kimi Work, pt 11):** main EN page cleanup after pt 10
  (backup `_backups/2026-10-27_index_pt11.html`, 2 inline-CSS edits).
  (a) The half-cut digit row under the main time = `#nextTime`, a HIDDEN
  sync copy tomato.js only writes to (verified: never read, no animation) —
  Baloo's tall glyphs leaked into the `.timer-container` 1em clip window.
  Fixed with `#nextTime { display: none; }`. (b) Mode-tab text now truly
  centered: `.button-style-1` gets inline-flex + align/justify center,
  equal 8px vertical padding, and font-size 16px (was 18px) to match the
  nav buttons. Next: Andy reloads + reviews; translation port (pts 8–11)
  still waits for his OK.
- **2026-10-27 (Kimi Work, pt 10):** main EN page polish (backup
  `_backups/2026-10-27_index_pt10.html`, 2 exact-match edits, index.html
  inline CSS only). (a) SHAKE REMOVED from the mode tabs (Pomodoro / Short
  Break / Long break / Loop): the inline `@keyframes wiggle` + `.wiggle-me`
  rules are deleted from index.html — tomato.js still toggles the class but
  it now has no CSS behind it (tomato.js itself UNTOUCHED, it's shared with
  the translations). (b) Mode tabs restyled like the nav buttons: slimmer
  padding (8px/6px + line-height 1), 1px #E2D0AF border, soft shadow, red
  text+border hover (#DE4B3A) in light theme; dark/classic hover overrides
  already existed and still win. (c) Timer digits: `.timer-box.timer-font`
  now Baloo Tammudu + #58240E (was Helvetica Neue 900 + #8e552b) — same
  look as the other pages; dark (#F5E6C8) and classic (#feece5) !important
  color rules still take over in those themes; applies to both the main
  digits and the small #nextTime line. Next: Andy reloads + reviews, then
  the id/es/pt/vi port bundles pts 8+9+10 once he OKs.
- **2026-10-27 (Kimi Work, pt 9):** main EN page timer CONTROLS reworked to
  the other pages' style (backup `_backups/2026-10-27_index_pt9.html`,
  14 exact-match edits via `_backups/_port_main_controls.py` + 1 follow-up).
  Old 50px SVG-image links (rest/play/stop-button.svg, wiggle shake on
  click) REPLACED by round `.cbtn` buttons (56px, a bit slimmer than the
  64px on other pages): reset / ONE alternating play-pause (red circle,
  playIcon/pauseIcon swap) / skip (new). Secondary buttons are white with
  red icon+border on hover; no shake (new markup has no `.action-button`
  class, so tomato.js's wiggle binding no longer applies; mode tabs keep
  theirs). New "Timer controls v1" IIFE: tick-detector drives the icon
  (window.ttControlsIsRunning exposed for the ambience listener), skip =
  onShortTimer()/onPomodoroTimer() depending on current phase (lands
  STOPPED, disarms loop). Space now clicks #playBtn (icon + ambience stay
  in sync instantly); ArrowRight = skip (new). Ambience instant-response
  listener updated for the new ids (#playBtn handled via
  ttControlsIsRunning; #resetBtn/#skipBtn are stopish; old a[onclick]
  selectors removed). Nav buttons: dead `button-animate` class dropped,
  light theme gets the other pages' look — 1px #E2D0AF border, red
  text+border hover (was color:inherit), slimmer padding 12/9px (was
  16/10px); dark theme unchanged (already had it). Shortcuts doc line now
  mentions → skip. tomato.js + style.css UNTOUCHED (shared with
  translations; jQuery .attr() on the removed img ids is a safe no-op).
  All 13 inline scripts pass node --check, JSON-LD parses. Next: Andy
  reloads + reviews (play/pause icon swap, skip, hover), then id/es/pt/vi
  port ONLY on his OK.
- **2026-10-27 (Kimi Work, pt 8):** main EN pomodoro page (`index.html`)
  caught up with the other timers. Backup first: `_backups/2026-10-27_index.html`;
  25 exact-match edits via `_backups/_port_main_pill.py`. (a) Pill preset
  DROPDOWN: `<select id="ambiencePresetSel" class="ambience-sel">` inside the
  ambience pill (new light + dark `.ambience-sel` CSS in the page's Baloo/
  cream scheme) — shows the CURRENT mode's slot (pomodoro/shortBreak/
  longBreak), Off + preset names, two-way sync with the modal: pill change
  writes `tt_timer_ambience_settings_v1` (+ live switch while playing);
  dropdown follows mode buttons, loop auto-transitions and stopish clicks
  (3 extra `updatePillUI()` call sites in the v13 poller). (b) Modal-refresh
  fix: `show.bs.modal` now clears the 3 ambience selects before
  populateDropdowns (fresh pill choices actually win); SaveSet now also
  refreshes the pill + re-applies sound when running. (c) UI wording aligned
  with the other pages: modal title "ENTER CUSTOM TIMER" → "⚙️ Custom
  Timer", duration labels get "(MINUTES)", "🎧 Focus Ambience" → "🎵
  Ambience" + 20-20-20-style description, slot labels "WHILE FOCUSING
  (POMODORO) / DURING SHORT BREAK / DURING LONG BREAK", "NOTIFICATION CHIME"
  → "CHIME", footer gets Cancel + "Save Settings" (was SAVE). Ambience v12
  → v13. All 12 inline scripts pass node --check, 3 JSON-LD blocks parse.
  Also added Golden Rule 6: ENGLISH FIRST — never touch translations until
  Andy approves the English page. Next: Andy reviews index.html (reload the
  preview first!), then ports to id/es/pt/vi only after his OK. Upload list
  unchanged + index.html + AGENTS.md.
- **2026-10-27 (Kimi Work, pt 7):** hreflang audit — the old "25 pages still
  need 6-link hreflang" pending item was STALE. Script-checked all 30 pages
  (index, 52-17, 20-20-20-rule, flowtime, ambience, custom-timer ×
  en/id/es/pt/vi) against the expected cluster (en/id/es/pt/vi + x-default →
  EN url, www.tomatotimers.com, trailing slashes): every page already has
  the full correct cluster, zero fixes needed. No files changed except this
  AGENTS.md (Pending section updated). The only uploads still outstanding
  from today: the 5 custom-timer pages, the 15 52-17/20-20-20/flowtime
  pages (pill dropdown + modal-refresh fix), and AGENTS.md.

- **2026-10-27 (Kimi Work, pt 6):** pill preset-dropdown ported to all 12
  translated pages — id/es/pt/vi × 52-17, 20-20-20-rule, flowtime — via
  `_backups/_port_pill_dropdown.py` (8 exact-match edits per file, 8/8
  everywhere). Includes BOTH parts of the pt-5 modal-refresh fix (click
  listener + clear-selects-before-populate, patched in afterwards to match
  the final EN code). Only translated string: the dropdown aria-label (id
  "Suara ambience", es "Sonido de ambiente", pt "Som ambiente", vi "Âm
  thanh ambience"); "Off" + preset names stay English per convention.
  92 inline scripts pass node --check. Next: Andy spot-checks id first,
  then uploads the 15 timer pages (3 EN + 12 translated) + AGENTS.md.
- **2026-10-27 (Kimi Work, pt 5):** modal-refresh fix, TWO parts — Andy
  spotted that the settings modal's ambience dropdowns didn't reflect pill
  changes. Part 1: re-read slots on modal open (click listener on
  `customTimerBtn` / flowtime `rewardSettingsBtn`). Part 2 (the real bug he
  kept seeing): `populateDropdowns()` re-applies the currently-DISPLAYED
  value after rebuilding options (an oldVal restore meant for preset
  renames), which wiped the fresh storage value — so the modal stayed stale
  even with the click listener. Fix: clear the three selects' values before
  calling populateDropdowns on modal open. All 3 EN pages verified. NOTE:
  all logic is inline in the HTML — Andy must RELOAD the preview page after
  any edit round before testing (this caused confusion twice today).
- **2026-10-27 (Kimi Work, pt 4):** COURSE CORRECTION — the modal removal on
  52-17/20-20-20 was WRONG and got reverted from backups
  (`_backups/2026-10-27_52-17_index.html`, `_backups/2026-10-27_20-20-20_index.html`).
  Andy never wanted the button relinked — the old "customTimerBtn → link to
  /custom-timer/" pending idea is DEAD. The Custom Timer button opens the
  page's own settings modal; keep it. What he actually wanted: the
  custom-timer pill's preset DROPDOWN on the other timers' pills. DONE on EN
  52-17, 20-20-20 AND flowtime: `<select id="ambiencePresetSel"
  class="ambience-sel">` inside each page's ambience pill (new `.ambience-sel`
  CSS rule), showing the CURRENT mode's slot (work→`pomodoro`,
  break→`shortBreak`) with clean names (Off + preset names). Two-way sync
  with each page's settings modal: pill change writes the slot in
  `tt_timer_ambience_settings_v1` (+ live switch while playing); modal
  SaveSet refreshes the pill via the existing updatePillUI /
  ttEyeAmbienceRefresh path; dropdown follows mode switches (poller) and
  refreshes on focus/storage. All scripts pass node --check. Next: Andy
  click-tests all 3 EN pages (pill ↔ modal sync), then port to the 12
  translated versions.
- **2026-10-27 (Kimi Work, pt 3):** per-phase focus sound ported to all 4
  translations — id/es/pt/vi custom-timer pages received the same 10 edits
  via `_backups/_port_phase_sound.py` (exact-match anchors, aborts on any
  miss; 10/10 applied per file). Only translated string: the per-phase
  picker tooltip/aria-label — id "Suara ambience untuk fase ini", es
  "Sonido de ambiente para esta fase", pt "Som ambiente para esta fase",
  vi "Âm thanh ambience cho giai đoạn này". Preset names stay English
  (shared localStorage convention). All inline scripts pass node --check.
  Next: Andy reviews id wording first; then upload all 5 custom-timer
  pages (en/id/es/pt/vi) + AGENTS.md to GitHub — custom-timer feature set
  complete.
- **2026-10-27 (Kimi Work, pt 2):** per-PHASE focus sound on EN custom-timer
  (replaced the first per-timer attempt — Andy wanted it per phase, bottom
  "Focus sound" row removed again). Each phase row in the builder has its own
  compact sound picker (`.b-sound` select: Off + ambience presets), stored as
  `ambience` inside each section in `byo_timers` — rides along with
  drag-reorder, duplicate, save and share links (`normSections` keeps it).
  Two-way sync with the on-the-go pill: `loadSection` pushes the current
  phase's sound to the pill (`setPresetId` + new `byoAmbience.refresh()` for
  live switching while playing); pill changes write back to the current
  phase (`byoOnPillChange` → `persistPhaseSound`). One-time migration:
  profiles without per-phase sounds adopt the current pill value (or the
  short-lived per-timer `ambience` field from attempt 1, then deleted).
  Unknown preset ids self-heal to Off. Backup:
  `_backups/2026-10-27_custom-timer_index.html`. All 5 inline scripts pass
  node --check. Next: Andy click-tests at 140% zoom; on OK, port to
  id/es/pt/vi custom-timer pages.
- **2026-10-27 (Kimi Work):** AGENTS.md rewritten for the post-Google-Drive
  setup — workspace is now a plain local folder on the Windows PC, Drive
  sync/version-history rules replaced (undo = last published version on
  GitHub; big rewrites get a dated copy in local-only `_backups/`), GitHub
  is now the PC↔MacBook bridge. Noted the local `custom timer/` (space)
  folder-name quirk. No page files touched. Next: Andy deciding on the
  sound-selector design (ambience default in Edit My Timer ↔ on-the-go
  pill sync; global vs per-profile) before any building.
- **2026-10-26 (Kimi Work, pt 4):** card art + analytics. Swapped the
  temporary card frame for Andy's real `frame_01.png` (2160² RGBA → 480²,
  149 KB, transparency kept) at `assets/images/custom-timer-card.png` — used
  by all 25 card rows. Installed the standard gtag.js snippet
  (G-XXWPJH9V4X, same as index.html incl. `page_path` config) on all 5
  custom-timer pages (en/id/es/pt/vi) — they were the only pages missing
  Google Analytics. Next: Andy reviews id wording, then publishes.
- **2026-10-26 (Kimi Work, pt 3):** custom-timer translations SHIPPED — new
  `id/custom-timer/`, `es/custom-timer/`, `pt/custom-timer/`, `vi/custom-timer/`
  built from the EN master via exact-match replacement script (132 string
  pairs per language, aborts on any miss): full SEO set (title, description,
  keywords, canonical, og/twitter, og:locale per language), JSON-LD
  WebApplication + BreadcrumbList + FAQPage translated, all UI + JS strings
  (toasts, builder, tasks, stats, confirms), cards row with existing
  per-language card texts, footer. Ambience preset names stay English
  (shared localStorage convention). EN custom-timer got the `tt_lang`
  redirect script (was excluded while translations 404'd) + full 6-link
  hreflang; sitemap.xml now 30 URLs (+5 custom-timer). Cards: "Build Your
  Own Timer" card appended to every OTHER page's tt-card row (25 files,
  language-prefixed hrefs, matching relative/absolute style per file);
  Ambience Studio cards REMOVED from the 4 translated 20-20-20 pages
  (duplicate of nav button). Card image `assets/images/custom-timer-card.png`
  = Andy's frame_01.png (2160² RGBA render of the coffee-IV chick, resized
  to 480², 149 KB, transparency kept — composites cleanly on #FBF3E4).
  All 5 custom-timer pages pass node --check + JSON-LD parses. Next: Andy
  reviews Indonesian wording first, then es/pt/vi.
- **2026-10-26 (Kimi Work, pt 2):** custom-timer mascot placeholder swapped
  for Andy's looping video illustration — two theme-aware variants:
  `assets/gifs/custom-timer-light.mp4` (99 KB) and `custom-timer-dark.mp4`
  (93 KB), re-encoded from 720×720 originals (~300 KB each, audio stripped,
  faststart). Two stacked `<video autoplay muted loop playsinline>` elements
  in `.mascot-wrap`; CSS flips visibility via `html.theme-dark`
  (`.mascot-light` / `.mascot-dark`), same 360px/250px sizing as before.
  No JS needed. Light-mode page `--bg` adjusted `#FAF5EB` → `#fbf2e9` to
  exactly match the light video's background (dark was already fine).
  Next: Andy eyeballs light+dark at 140% zoom; translations
  inherit it automatically once custom-timer id/es/pt/vi are built.
- **2026-10-26 (Kimi Work):** YouTube video section on 20-20-20-rule — DONE
  on all 5 languages (en/id/es/pt/vi). One big 16:9 looping preview card
  between the to-do list and the explainer — new `.yt-video` block (own
  scoped styles + lazy IntersectionObserver loader, same pattern as the main
  timer's grid). Preview file: `assets/gifs/eyebreak.mp4` — re-encoded from
  Andy's 679 KB 1080p original to 480p H.264, no audio, faststart →
  **42 KB**, matching the other previews (31-92 KB); frame-checked visually.
  Card links to https://youtu.be/rQHew2thSh8 on all 5 pages. Headings/text
  translated (id: "Timer Video Animasi", es: "Temporizador en Video
  Animado", pt: "Timer em Vídeo Animado", vi: "Hẹn Giờ Video Hoạt Hình") —
  Andy to review wording, id first as usual. All 5 pages pass node --check.
- **2026-10-25 (Kimi Work):** language memory. The lang dropdown now saves
  the pick to `localStorage['tt_lang']` (all 26 pages with `#lang-select`),
  and the 5 English pages (index, 52-17, 20-20-20-rule, flowtime, ambience)
  carry a tiny `<head>` script that redirects to the saved language
  (`/id/...` etc.) via `location.replace`. Translated pages never redirect
  away; switching back to English clears the behavior. custom-timer is
  deliberately EXCLUDED from the redirect until its translations exist
  (`/id/custom-timer/` would 404 — note its lang dropdown already links
  there!). Redirect logic unit-tested via node. Next: human tests the
  switch→leave→revisit flow on the live site after upload.
- **2026-10-23 (Kimi Work, pt 2):** announcement bar + on-page docs for the
  shortcuts. Every `#yt-promo` banner now reads "Keyboard shortcuts are
  available now, shortcut list down below! Support the channel and check out
  the videos!" — translated id/es/pt/vi (21 files; ambience pages have no
  banner). Added a "⌨️ Keyboard shortcuts" line inside each page's
  how-to-use/SEO section (flowtime gets its own h2 block before "Flowtime vs
  Pomodoro"; custom-timer gets an h2 at the end of its explainer) — 26 files,
  all translated. No JSON-LD/FAQ text touched.
  Next: human reviews wording (id first, as usual) + click-test at 140% zoom,
  then custom-timer `id/` translation.
- **2026-10-23 (Kimi Work):** keyboard shortcuts rolled out to all timer
  pages — Space = play/pause, → = skip (→ = break/end-break on flowtime;
  main index Space only, uses a remainingTime tick-detector since tomato.js
  exposes no running flag). Handlers ignore inputs and open modals/overlays.
  Play/skip button titles now show the hint, translated per language.
  Ambience pages also got Space = master play/pause-all (guards: inputs +
  open modals).
  Files: `index.html`, `52-17/`, `20-20-20-rule/`, `flowtime/`, `ambience/`
  + same 5 under `id/`, `es/`, `pt/`, `vi/` (25 files total). All inline
  scripts pass node --check. Next: human click-tests shortcuts at 140% zoom,
  then custom-timer `id/` translation.
- **2026-10-22 (web chat):** custom-timer English page completed — built
  multi-timer profiles, share links, builder with duplicate phase/timer,
  editable extend, Notification 1–6 sounds, ambience pill, Space/→
  shortcuts. Tested clean. Next: build `id/` translation of custom-timer and
  have the human review the Indonesian wording.

## Session workflow (any machine, any chat)

1. Read this file, then the source of the page you're about to touch.
2. Work only inside the local folder on the Windows PC. If the human has
   edited anything via GitHub (e.g. from the MacBook) since the last
   session, ask them to refresh the local copy from the repo first.
3. Make the changes; test what you can.
4. List exactly which files changed so the human can review before uploading
   to GitHub themselves.
5. **MANDATORY CLOSE-OUT — never skip, even when told to hurry:**
   a. Append a new entry to the Work Log (date, files changed, what's next).
   b. Refresh "Current State" if the overall picture changed.
   c. List the exact files the human needs to upload to GitHub.
   A session is not over until the log entry is written.
6. AGENTS.md is the highest-stakes file in the folder — only edit it when
   the ground rules actually change, and always log the edit in the Work Log.
