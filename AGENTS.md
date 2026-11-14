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

## Model-efficiency policy (Andy's standing rule, 2026-11-06)

- **Flow for EVERY task:** (1) discuss what to build → (2) Kimi states the
  recommended model + plan → (3) Andy gives the go → (4) Kimi builds. No
  building without Andy's confirmation, and the model recommendation always
  comes BEFORE the go, not at execution time. Read-only investigation is fine
  before the go; writing files is not. When Andy asks "are you ready?", Kimi
  answers and STOPS — the human may need time to switch models, and only an
  explicit "go / ok / do it" starts the build.
- Default mode: LIGHT (K2.8). Adequate for ~70% of the work — CSS tweaks,
  translation ports, link swaps, work-log upkeep.
- Medium: new feature builds, multi-file refactors, visible UI bug fixes.
- Heavy ONLY for: git/branch/repo mysteries (files "vanishing", diverged
  branches, GitHub Desktop state), bugs that survive two fix attempts, or
  brand-new tool architecture.
- The human switches models via the model picker in the same conversation;
  Kimi names the right mode during the plan step of any non-trivial request.

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
- **New ambience sounds are NEVER Studio-only.** Every new sound added to the
  Ambience Studio must ALSO be registered in the `SOUNDS` list of every timer
  page (main index + 52-17 + 20-20-20-rule + flowtime, all 5 languages),
  otherwise user-made presets containing it play that layer as SILENCE on
  the timers. Path convention: main page uses relative `ambience/audio/<id>.ogg`,
  sub-pages use root-absolute `/ambience/audio/<id>.ogg`. EXCEPTION:
  custom-timer builds audio URLs straight from the sound id
  (`buildSoundUrl`) — no SOUNDS list to update (its `ambienceSounds` var is
  dead code). The Studio page itself needs the preset entry (id/name/file/
  icon — keep icon filename lowercase, the live host is case-sensitive).
- New video cards go ON TOP of the video grid (first card), never appended
  at the bottom — newest content leads the stack.

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
- **Pending:** workflow is now GitHub Desktop with branches — `development`
  is the staging branch, `master` publishes the live site; Andy commits and
  pushes himself (Kimi NEVER commits/pushes). Translated main pages
  (id/es/pt/vi `index.html`) still have the OLD side-ad position
  (`top: 300px`) — English moved to `top: 80px` on 2026-10-29; waiting for
  Andy's live review before porting. Hreflang: VERIFIED COMPLETE
  2026-10-27. Custom-timer feature set: COMPLETE (2026-10-27).
- **days-until + streaks (tools, ALL 5 languages): SHIPPED 2026-11-04** —
  both tools live at `days-until/` and `streaks/` in en/id/es/pt/vi with full
  SEO sets; welcome seeds (pinned +30d countdown, pinned Pomodoro Streak)
  teach the pin feature on first visit; pin chips on all 25 timer pages.
  sitemap.xml = 40 URLs. Next: Andy reviews id wording, commits on
  `development`, then a Streak Counter card for the Tools sections.
- **stats (translations SHIPPED 2026-11-12, EN+id/es/pt/vi):** shared recorder
  `assets/js/ttstats.js` + wired main pomodoro + EN page at `stats/`
  (segments, 14-day chart, donut, rhythm charts, heatmap, records, deltas,
  export/import, mascot hero, dark mode) + full 4-language translations with
  6-link hreflang everywhere and sitemap at 45 URLs. Later: recorder on other
  24 timer pages, pin chips (medium), Tools-section card for stats.
- **days-until (first tool) history:** built 2026-10-30 —
  multi-countdown board at `days-until/index.html`, prototype living on the
  `development` branch until Andy approves. Multi-countdown board with emoji
  icons, color coding, pin flag, share links, undo delete.
  Next after approval: pin-strip display on timer pages, "More Tools" nav
  dropdown everywhere, then translations.

## Work log (newest on top)

The running record of progress — this is how a fresh session on ANY machine
knows what happened without asking the human. Entries must be short: date,
what changed (file names), what's next.

- **2026-11-13 (Kimi Work, pt 8):** PIN CHIP ALIGNMENT FIX (EN subpages) —
  the pin chips on 52-17 / 20-20-20-rule / flowtime / custom-timer rendered
  uneven vs the main page: pins stretched to 78px in `.pin-row` (no
  align-items), stats chip sat 14px lower (its `margin: 14px 0 2px 8px` has no
  counterpart on subpage pins), and chip text used the Baloo default line-height
  (~2.2) because subpage body sets none. Fixes per subpage: `.pin-row` +
  `align-items: flex-start`; `.pin-chip` → `inline-flex`; JS shows set
  `inline-flex` (was `flex`); `.pc-name`/`.pc-time` explicit `line-height: 1.5`;
  `#statsPins .pin-chip` margin → `0 0 0 8px`. Now 59/59/57 with all tops
  aligned, pixel-matching the main page (live-verified 52-17 + custom-timer at
  1680px). Rolled out to all 16 translated subpages the same evening — two
  batch-script misses caught by strict re-checks: `pc-name` line-height
  missing in 16 files, then `pc-time` line-height in the same 16 (each pass
  only re-added one of the two). Final state: all 20 subpages file-verified
  (6 patterns each), all inline scripts pass node --check, id/52-17 +
  pt/flowtime + vi/custom-timer live-measured 59/59/57 with tops aligned.
  Scripts `_work/pinchip_align.py` + `_work/pinchip_align_translations.py`.
- **2026-11-14 (Kimi Work, pt 9):** PIN ROW WRAP FIX — at Andy's 140% zoom
  the three pin chips on translated subpages wrapped to a stack (stats chip
  on its own line): the row needed ~1120px but `.pin-row` allowed only
  1050px content. Squeezed ~80px on all 20 subpages: row max-width 1140 →
  1200, padding 40/50 → 24, gap 8 → 6, stats chip margin-left 8 → 6 and
  padding-right 18 → 12, stats block column-gap 18 → 12. Chips now stay side
  by side down to ~950px viewport (live-verified id/52-17 at 1140/1050/1000,
  EN 52-17 + vi/20-20-20 at 1200; heights unchanged 59/59/57 tops aligned).
  Script `_work/pinrow_fit.py`.
- **2026-11-14 (Kimi Work, pt 10):** PIN ROW COLUMN ALIGNMENT — subpage pin
  chips hung left of the content column (row was max-width 1200/padding 24
  while the header column is 1140/padding 40). `.pin-row` on all 20 subpages
  now mirrors `.header` exactly (max-width 1140, margin auto, padding 0 40px)
  so chips align with the header/nav column like the main page. Verified:
  pin-row box === header box (left 64/w 1140 at 1284px), first chip at
  header-content left, all three chips same line (EN 20-20-20 + id/52-17).
  Script: inline python replace recorded in `_work/`. Next: Andy re-checks,
  then push.
- **2026-11-13 (Kimi Work, pt 7):** TOOLS CROSS-LINKS + UI CONSISTENCY SWEEP —
  every tool page now cross-links the other two in a Tools card row, no
  self-links, all 5 languages: days-until pages got a full Tools section
  (streaks + stats cards, translated titles Alat/Herramientas/Ferramentas/Công
  Cụ), streaks pages got the stats card. Templates taken from each language's
  own main timer page (first attempt reused the EN card → wrong hrefs in
  translations, caught on live verify and rebuilt). Full EN↔translation diff
  of all 6 page types: CSS rule sets and JS function sets are now verified
  identical (only real gap: stats-pin label `order: -1` missing in the 4
  translated main pages — added, live-verified). Scripts
  `_work/tools_crosslinks_fix.py`. Next: Andy pushes with the stats batch.
- **2026-11-13 (Kimi Work, pt 6):** STATS PAGE POLISH — removed the Focus
  Stats self-link card from the Tools row of all 5 stats pages (now 2 cards
  there, same as days-until/streaks pages); picked pin-board chips go RED
  (#DE4B3A, cream text) in dark mode on all 5 stats pages (light stays
  yellow #F2C14E). Script `_work/stats_selflink_darkchip.py`. Next: Andy
  pushes the stats batch.
- **2026-11-13 (Kimi Work, pt 5):** STATS TOOLS CARD — new
  `assets/images/stats-card.png` (480² RGBA, 120 KB, made from a frame of
  `assets/gifs/stats-mascot-light.mp4`, cream bg chroma-keyed to alpha) added
  as the third card in the Tools section of all 35 pages (7 EN + id/es/pt/vi),
  language-prefixed hrefs to `/stats/`, h3 "Focus Stats" kept as brand name in
  every language; script `_work/stats_tools_card.py`. Live-verified markup +
  image serve. Next: Andy pushes the stats feature batch (development →
  master).
- **2026-11-13 (Kimi Work, pt 4):** NEW AMBIENCE SOUNDS — Jazz 1-3 +
  Classical 1-3 (music, ~0.9-1.35 MB each). Files renamed to lowercase
  convention (`ambience/audio/jazz1-3.ogg`, `classical1-3.ogg`; icons
  `ambience/icons/jazz1-3.svg`, `classical1-3.svg` — Andy's originals had
  spaces/capitals, one was `Jazz1.ogg` w/o space). Display names keep
  spacing: "Jazz 1"…"Classical 3" (same as "Lofi 1" pattern). Registered in:
  Studio SOUNDS list (EN + id/es/pt/vi, name/file/icon entries) and all 20
  classic timer pages' SOUNDS (custom-timer builds URLs from id — no list).
  LAZY loading: added the 6 ids to the Studio's LAZY array and the timer
  pages' preload exclusion now skips `/^(lofi|jazz|classical)/` — verified
  0 music oggs fetch on load, jazz1.ogg fetches only on toggle, tile shows
  active. Script: `_work/add_jazz_classical.py`. NOTE: a Bash-tool escape
  mangling (`\1`/`\2` in a heredoc regex replacement became 0x01/0x02
  control bytes) corrupted the 20 timer-page SOUNDS lines mid-task; repaired
  via `_work/repair_sounds_lines.py` and re-verified — all 20 timer pages +
  5 studio pages node --check OK, 52-17 live-checked. LESSON: avoid
  backslash-digit escapes in Bash heredocs; write .py files with the Write
  tool instead. Next: Andy listens to the new tracks on the live site,
  then the Tools-card for stats.

- **2026-11-13 (Kimi Work, pt 3):** STATS PINS REWORKED to the combo model
  (Andy's 13:06 spec, medium, go given). A pin is now metric × timeframe —
  4 metrics (Focus/Breaks/Tasks/Sessions) × 5 segments (Today/This week/
  This month/Custom/All time) = 20 options, max 5 pinned, one combined chip
  on the timer pages. Default for first-time users: all 4 metrics × Today.
  Old pins auto-migrate (`today`→Focus today, `week`→Focus this week, …).
  `assets/js/ttstatpins.js` rewritten to v2 (combo IDs, `custom` reads
  `tt_stats_custom_range`, localized `Metric · Timeframe` labels en/id/es/pt/
  vi). The 📌 toggles on the 5 stats pages (EN + id/es/pt/vi) are replaced by
  a labeled pin board ("Pinned to your timers", 4 rows × 5 chips, 5-pin cap
  toast, pin counter) sitting in its own panel above the data row; script:
  `_work/stats_pinboard_translations.py` (replaces the now-obsolete
  `stats_toggles_translations.py`). EN How It Works got a definitions list
  (`.defs`) explaining Focus / Breaks / Tasks Completed / Sessions (session =
  one timer run play → pause or phase end; pausing splits a stint). Verified:
  EN live-tested (20 chips, migration, cap-5, persistence, fresh defaults,
  chip labels on index), 36 scripts node --check OK, id + vi boards render
  localized. Follow-up same day: pin board panel MOVED up to sit directly
  under the four stat cards on all 5 stats pages (was buried page-bottom
  before the data row). Stat-card interiors RESTRUCTURED on all 5 stats pages
  for tidy alignment: strict two-line layout via `.s-txt` (column) +
  `.s-numrow` (number + delta pill, nowrap) with the label always on its own
  line — long values like "1h 10m" no longer squeeze the label into "F" or
  wrap differently per card. Icon bumped 40→44px on EN. Verified: uniform
  card heights + aligned num/label rows EN + id (DOM geometry, 36 scripts
  node --check OK). NOTE: translated stats
  pages still have pre-duck emoji icons in the cards (duck-icon port still
  pending Andy's go — card LAYOUT is now identical everywhere, only the icons
  differ); translated explainers don't have the `.defs` list yet — add with
  the duck-card port. BUGFIX same day (Andy's "UI is a mess" report): the
  card-restructure regex on the 4 translated pages had mangled the markup
  (named-group numbering off-by-one — visible `id="nFocus"` text, labels
  lost); rebuilt all 4 grids from `git show HEAD:` originals with the correct
  two-line wrap. That damage had crashed each page's render() mid-pass, which
  is ALSO why the activity heatmap and records were blank — and the id diff
  then revealed the translations were missing 3 ids EN uses in JS
  (`hmSub`, `dowAvg`, `hourAvg` — all 4 languages), now restored. LESSON:
  after markup regex edits, verify DOM textContent/ids, not just geometry.
  Verified vi + id live: zero JS errors, heatmap 48 cells + 24-cell hour
  strip, records + streak render, labels correct. Next: Andy reviews, then id
  wording as pilot. Dark-mode polish: picked pin-board chips are tomato red
  (#DE4B3A, white text) instead of amber, on all 5 stats pages — then made
  YELLOW the stats signature color (no color picker on the stats tool):
  picked pin-board chips #F2C14E w/ #58240E text (light + dark) on all 5
  stats pages, and on all 25 timer pages the stats pin chip carries a YELLOW
  LEFT EDGE (#F2C14E, like the days-until/streaks chips' color-coded edges —
  stats has no color picker so yellow is its signature). The yellow TEXT
  experiment was reverted: chip values are back to first-value red #DE4B3A
  (dark: #E0A458), rest brand brown. Stats chip TITLES (`#statsPins .pc-block
  i`) now match the other pins' title color: #58240E light, #E8D9B8 dark,
  #a34a4a classic (were var(--muted) gray — visually off). ALL chip values
  are red like the first: #DE4B3A light, #E0A458 dark, #c65e5e classic. Picked pin-board chips on the stats
  pages stay yellow #F2C14E w/ #58240E text.

- **2026-11-13 (Kimi Work, pt 2):** STATS PINS — built + rolled out
  everywhere (medium, Andy's go). New shared `assets/js/ttstatpins.js`
  (single combined chip, ≤5 metric columns, localized via <html lang>
  en/id/es/pt/vi, seeds today+week on first visit); EN `index.html` now uses
  it (inline copy removed). New `tt_stat_pins_v1` localStorage key.
  Pin toggles (📌 pin/pinned, cap 5) on the EN stats page + all 4 translated
  stats pages (localized toasts). Session recording wired into every timer
  page (EN + id/es/pt/vi): 52-17 & 20-20-20 & flowtime via a 1s poll over
  page state (flowtime publishes `window.ftState` in paint(); custom-timer
  publishes `window.byoState` in render() — kind guessed from phase name
  keywords), main pomodoro (incl. translations) wraps tomato.js
  start/stopTimer; custom-timer + translated index pages also recordTask.
  Rollout scripts: `_work/stats_pins_rollout.py`,
  `_work/stats_toggles_translations.py`. Verified: 240 inline scripts node
  --check OK, recording live-tested on 52-17/202020/flowtime/custom-timer,
  state machine unit-tested, chip row/labels verified EN + id. NOTE:
  translated stats pages still carry the OLD pre-duck stat-card CSS/emoji —
  the duck-icon overhaul is EN-only so far, port pending Andy's go.

- **2026-11-13 (Kimi Work):** STATS TRANSLATIONS REBUILT from the current EN
  stats master. `_work/stats_translations_v2.py` (new) reuses the approved
  pair tables from `stats_translations.py`, patches the 3 pairs whose EN side
  changed in the v2 rework (rhythm labels gained `#dowAvg`/`#hourAvg` caption
  spans, Activity `panel-sub` gained `id="hmSub"`, tooltip var `d`→`dd`), and
  adds ~13 new pairs per language: Custom tab label, 2 date-input aria-labels,
  localized `.hm-ylabels` day letters (Mi/Sn/Sl…, Do/Lu/Ma…, Do/Se/Te…,
  CN/T2/T3…), "14 d avg" legend + `· avg` captions, the 5 `hmSub` segment
  texts, hour-strip tooltip. Rebuilt `id|es|pt|vi/stats/index.html` (115
  pairs + 7 cards each, CRLF, no `tt_lang` redirect). EN untouched. Verified:
  extraction sweep ALL OK (36 scripts), node --check ALL JS OK, spot-grep for
  customRange / avg legend / day letters per language. Next: Andy reviews id
  wording (pilot), then commits on `development` via GitHub Desktop.

- **2026-11-12 (Kimi Work, pt 5):** STATS FILL-THE-MAP + RHYTHM AVG LINES
  (light, Andy's go) — (1) heatmap window is now `max(real history, enough
  whole weeks to fill the card)`: cols from `hmScroll.clientWidth` at 16px
  pitch, so short histories render a year of mostly-empty squares as the
  "fill me" incentive (Andy's design); `flex` is shown BEFORE measuring
  (hidden flex = clientWidth 0 = 4-col bug) and a debounced resize listener
  re-renders only when the column count changes. (2) `renderMini` draws the
  same dashed `.avg-line` on both rhythm charts at the per-bucket average,
  with captions in the chart labels ("By day of week · avg 6h 15m",
  `#dowAvg`/`#hourAvg`, cleared on empty state) — reuses `.avg-line` +
  `position:relative` on `.mini`, offset measured from the first `.mini-lbl`.
  Verified live: grid 885px = card width exactly, 390 cells (347 empty),
  Month 30 lit/355 dim, Week 7 lit + today scrolled into view, today↔month
  re-render keeps the fill, month labels pixel-aligned, both rhythm lines +
  captions present. 21/21 node --check, sweep ALL OK. New translation
  strings: "· avg" (rhythm captions; reuse "14 d avg:" pattern).
  Next: Andy eyeballs EN, then light port of the whole stats arc to
  id/es/pt/vi.
- **2026-11-12 (Kimi Work, pt 4):** STATS POLISH (light, Andy's go) —
  heatmap cell cap: `grid-auto-columns: minmax(9px, 16px)` on `.heatmap` +
  `.hm-months` (was `minmax(9px,1fr)` = giant squares filling the card; Andy:
  "way too big, like before"). Grid is compact + left-packed again, full
  history + highlight unchanged. Bar chart average line (Polar-style):
  dashed `.avg-line` across `.bars` at avg daily focus (`bottom:calc(19px +
  N%)` — 19px = day-label offset, matches bar anchoring), legend item
  "14 d avg: X" (`#avgLegend`/`#avgVal`, hidden when no data). Verified
  live: cells 16×16, months pixel-aligned, line at 49.7% avg/max, legend
  "1h 22m" matches engine avg. 21/21 node --check, sweep ALL OK. New
  translation string: "14 d avg:". Next: Andy eyeballs, then light port of
  heatmap v2 + Custom tab + avg line to id/es/pt/vi.
- **2026-11-12 (Kimi Work, pt 3):** STATS HEATMAP v2 + CUSTOM TIMEFRAME on
  EN `stats/index.html` (medium, Andy's go, native date pickers his pick) —
  heatmap no longer redraws per tab: it always shows FULL HISTORY (first
  session → today) as squares that stretch to fill the card
  (`grid-auto-columns: minmax(9px,1fr)` + `aspect-ratio:1` cells; min 9px then
  horizontal scroll for long histories). Tabs now HIGHLIGHT: This Week = last
  7 days lit / rest `.dim` (opacity .25); This Month = last 30; All Time =
  whole map lit, panel visible again (no longer hidden); Today keeps the
  24-hour strip. New 5th tab "Custom": two native `<input type="date">`
  (`.custom-range` row under the tabs, visible only on that tab), auto-swap
  when from>to, saved to `tt_stats_custom_range`, max = today. The custom
  range scopes the WHOLE page (hero/deltas/share/rhythm via `report(from,to)`
  + `distribution(from,to)` — `segFrom` refactored to `segRange` returning
  `{from,to}`); heatmap scrolls the highlighted range's last day into view.
  Verified live via CDP 1400px override: cells 123×123 filling an 884px card,
  month labels + Su–Sa letters pixel-aligned (0px off), Week 7 lit/35 dim,
  Month 30 lit/12 dim, All 0 dim, Custom Oct 5–20 → 16 lit + sub "Oct 5 –
  Oct 20 highlighted." + localStorage saved, swap guard works, hero focus
  matches engine report to the minute. 21/21 node --check, sweep ALL OK.
  Strings to translate at port time: "Custom" tab, both date-input
  aria-labels, subs "the last 7/30 days are highlighted" / custom
  "X – Y highlighted." (uses translated MON_SHORT), generic all-time sub.
  Next: Andy eyeballs EN (cells get BIG with short history — his call if a
  max cell size is wanted), then light port to id/es/pt/vi.
- **2026-11-12 (Kimi Work, pt 2):** STATS HEATMAP REWORK on EN
  `stats/index.html` (medium, Andy's go) — 4 items: (1) hour-of-day mini
  chart now labels all 24 hours (was 0/6/12/18); (2) vertical divider only
  between the day-of-week and hour-of-day charts inside `.rhythm-grid`
  (stacks to a top border ≤640px); (3) heatmap glanceability — Su–Sa letter
  column (`.hm-ylabels`), month labels along the top (`.hm-months`, labels a
  column when its Sunday's month flips), sub reworded; (4) period-aware
  heatmap: Today → 24-cell hour strip (`.hm-hours`, same red tiers, 0–23
  labels); Week → last 7 days as Sunday-aligned grid column(s); Month → last
  30 days; All Time → Activity panel hidden entirely (`#activityPanel`).
  Fixed during browser verification: hour strip stayed hidden on Today
  (`style.display=''` fell back to the CSS `display:none` — now 'block');
  `.hm-ylabels` 2px row misalignment (padding-top removed); heatmap columns
  stretched across the full panel width (CSS Grid default `justify-content:
  normal` stretches auto tracks — fixed with `grid-auto-columns: 13px`,
  giving a 16px pitch that matches the months row exactly; caught by Andy's
  screenshot, verified by DOM-measuring column x-positions on Week+Month). Verified live in
  InAppBrowser via temp localhost server (DOM-measured: 24 cells/labels on
  Today, 5 pad+7 cells on Week with correct "Nov" label, 3 pad+30 cells on
  Month with "Oct→Nov" flip, panel hides on All Time, divider rule confirmed
  applying). 21/21 inline JS node --check, class sweep clean, JSON-LD parse
  OK. id/es/pt/vi stats pages still have the OLD heatmap — port AFTER Andy
  approves EN (English-first); new strings to translate then: the two
  `#hmSub` variants + Today/Week/Month subs reuse existing patterns.
  Next: Andy clicks through the 4 tabs at 140% zoom; custom date range is
  queued as its own medium pass (not approved yet).
- **2026-11-12 (Kimi Work):** STATS TRANSLATIONS SHIPPED (light, Andy's go) —
  `id|es|pt|vi/stats/index.html` built from the EN master via
  `_work/stats_translations.py` (103 count-asserted pairs + 7 cards per
  language): full SEO set (canonical/og:locale per language), JSON-LD ×3,
  How-It-Works paragraph, FAQ ×5 (visible + JSON-LD), all UI labels (segment
  tabs, hero cards, panel titles/subs, buttons, data note, footer), JS strings
  (toasts, empty states, records rows, DOW/month arrays, Custom Timer legend
  name), cards row reusing the approved per-language card table
  (`_work/card_table.json`) with language-prefixed hrefs. "Focus Stats" +
  select aria-labels stay English per convention. EN stats gained the 6-link
  hreflang cluster + tt_lang redirect; sitemap.xml 40→45 URLs (+5 stats).
  GOTCHAS: (1) ALL repo pages are CRLF — normalize to LF for pairing, convert
  back on write; (2) empty-state strings sit inside HTML, not JS literals —
  pairs must not wrap them in fake JS quotes; (3) the "All-time total" records
  pair starts at `focused <small>' +` — the translated new must NOT re-include
  the leading `' ` the page already has (quote duplication = syntax error).
  Verified: 21/21 inline JS node --check, 15/15 JSON-LD parse, class sweep
  clean, zero EN leftovers, dropdown selects correct language, redirect EN-
  only. New files untracked — Andy reviews id wording first (pilot rule), then
  commits on `development`. Next: stats pin chips (medium) + recorder wiring
  on the other 24 timer pages.
- **2026-11-12 (Kimi Work):** stats heatmap DARK-MODE fix (CSS only, Andy's
  bug report) — the dark base rule `html.theme-dark .hm-cell` (0-2-1) was
  out-specifying every tier rule `.hm-cell.hm-N` (0-2-0), so in dark mode all
  cells rendered as the empty #2a2018 and no red ever showed. Added per-tier
  dark overrides (`.32/.50/.66/.83/solid #DE4B3A`) with higher specificity on
  all 5 stats pages (en/id/es/pt/vi). LESSON: when a component has tier/state
  variants, the dark-theme base override must be re-declared per variant, not
  just for the base class. No JS touched; 6/6 dark rules verified per page.

- **2026-11-12 (Kimi Work):** STATS PAGE MASCOT (Andy's go, medium) — Andy's "Final focus.mp4"
  (3840², 24fps, ~1s loop, duck presenting while the tomato paints a BAR CHART — perfect stats
  mascot). Recolored the flat salmon bg (#CE6E6D) via ffmpeg colorkey → composited over the
  page's exact theme bgs: `assets/gifs/stats-mascot-light.mp4` (#fbf2e9, 36 KB) +
  `stats-mascot-dark.mp4` (#14100c, 34 KB), 720² H.264, audio stripped, faststart. GOTCHA: first
  pass with colorkey similarity 0.14 ATE the tomato's pale-pink body (invisible on the light
  variant, black silhouette on dark) — fixed at similarity 0.06/blend 0.02, frame-verified.
  Placement = Andy's pick: new `.hero-top` flex row at the top of `.stage` — mascot (136px,
  rounded 20px card, 1px border) left, title+lead stacked right, seg tabs/cards untouched;
  stacks vertically under 680px; two stacked `<video autoplay muted loop playsinline>` elements
  flipped by `html.theme-dark` (custom-timer pattern, zero JS). Rev 2 same session (Andy's "not
  visible, bigger, no border, align left"): mascot 136→210px, border+radius removed (bg matches
  the page so it blends), `.hero-top` full-width left-aligned, title/lead left-aligned via
  `.hero-copy` scoping, and the segment TABS moved INSIDE `.hero-copy` — the whole hero is now
  one left-aligned composition beside the mascot (stacks under 680px). 4 scripts node --check, JSON-LD
  parses, class sweep clean, 60/60 tests. New video files untracked — Andy commits with the page.
- **2026-11-12 (Kimi Work):** stats page BUGFIX — dark mode did nothing. The page had the
  `#theme-select` dropdown + all `html.theme-dark` CSS but was MISSING the theme apply/save
  IIFE every other page carries (lost when the shell was copied). Added the canonical head
  script (`site-theme` key, applies saved theme pre-render + on change) — identical to
  custom-timer's. 4 inline scripts node --check. `stats/index.html`.
- **2026-11-12 (Kimi Work):** stats page optical centering nudge (light, Andy's screenshots) —
  donut-hole text ("115h 26m / focus") and the Sessions-card ▶ glyph both sat HIGH: Baloo's
  glyphs ride high in the em box, so the existing flex centering was only geometric. Fix =
  `translateY(4px)` on `.donut-total`/`.donut-sub` (pixel-measured from Andy's screenshot:
  text block sat 6 device px high of the hole center) + `#cSessions .s-ico` translateY(2px).
  CSS only, `stats/index.html`.
- **2026-11-12 (Kimi Work, batch 3 of 3):** STATS DEEP-DIVE batch 3 (Andy's "ok medium, go") —
  period deltas + export/import, EN stats page. (a) Hero cards now compare against the previous
  matching window via new `renderDeltas` — `report(prevFrom, from)` per segment tab; `↑ N%` green
  pill / `↓ N%` muted / `–` flat / `↑ new` when the previous window was empty; hidden entirely on
  All Time and when both windows are zero. New `.s-delta` pill CSS (+ dark override). (b) Export →
  JSON download `{v:1, app:'tomatotimers-stats', exportedAt, s, t}` named by day key; Import →
  file picker, JSON.parse guarded, feeds the new recorder function `ttStats.mergeImport` —
  merge-NOT-replace: version/shape validation, exact-dupe skip (tm|k|s|d / tm|ts keys), junk
  entries skipped (bad kind, <10s, missing tm/ts), floats rounded, caps 8000/4000 keep newest.
  16 new mergeImport assertions (null/garbage shapes, dupe skip, junk skip, rounding, 9000→8000
  cap, near-full merge keeps newest) — 60/60 pass; 3 inline scripts node --check; 3 JSON-LD parse;
  class sweep clean (only JS-concat artifacts + pre-existing inline-styled `.logo` anchor).
  (c) FAQ "Can I move it to another device?" reworded in BOTH visible explainer and JSON-LD to
  describe Export/Import merge. `stats/index.html` + `assets/js/ttstats.js` only. Stats page
  feature-complete pending Andy's review; roadmap after review: recorder wiring on the other
  24 timer pages + pin chips (medium) + translations (light) + sitemap/hreflang/Tools-card.
- **2026-11-11 (Kimi Work, batch 2 of 3):** STATS DEEP-DIVE batch 2 (Andy's
  "ok next, go") — rhythm charts + donut swap, EN stats page. (a) "Your
  rhythm" panel: day-of-week (7 bars, Su-first to match the page) and
  hour-of-day (24 thin bars, labels every 6h, per-bar tooltips) mini charts,
  both driven by the segment tabs; focus sessions only (breaks have no
  "when"); grid 5fr/12fr, stacks under 640px; bars reuse the barGrow
  animation with per-bar stagger. (b) Per-technique share BARS replaced with
  a proper donut — `conic-gradient` built from cumulative share stops (last
  stop pinned to 100%), hole shows total focus for the period, legend rows
  show swatch/name/%·time·sessions, scale-in animation. New pure recorder
  helper `ttStats.distribution(from,to?)` → {byHour[24], byDow[7]} in focus
  seconds. FAQ wording synced to the new UI in BOTH the visible explainer
  and JSON-LD ("colored share bars" → "colored donut chart"); How It Works
  paragraph now names the rhythm/heatmap/records panels. Dead share-* CSS
  removed; reduced-motion list updated. 8 new distribution assertions
  (weekday/hour buckets, breaks excluded, window filter, 400-day-old session
  correctly counted in open-end vs excluded in windowed) — 44/44 pass; 3
  inline scripts node --check; 3 JSON-LD parse; class sweep clean.
  `stats/index.html` + `assets/js/ttstats.js` only. NEXT: batch 3 = period
  comparisons + export/import (merge-not-replace).
- **2026-11-11 (Kimi Work, batch 1 of 3):** STATS DEEP-DIVE batch 1 (K3 High,
  Andy's go — heatmap + streaks + records, EN stats page). (a) Activity
  heatmap: GitHub-style 16-week grid (13px cells, 5 opacity tiers of tomato
  by focus minutes, Sunday-start with leading pad cells, today outlined,
  per-day tooltips, auto-scrolled to the newest week, Less→More legend).
  (b) Records & streaks panel: 🔥 current focus-day streak + longest
  (same alive-through-yesterday convention as the Streak tool) beside
  personal bests — longest session (with timer + date), biggest focus day,
  most tasks in a day, all-time totals. New pure helper in the recorder:
  `ttStats.focusStreaks()` → {current, longest} (set of focus-day keys,
  walk-back for current, sorted run scan for longest) — built for reuse by
  the future stats pin chip. Records aggregate client-side from `data()`
  (longest session, per-day focus max, per-day task max, totals).
  Empty states for both panels. Both panels re-render with the segment tabs
  / storage sync like the rest. Test suite extended: 9 new streak assertions
  (empty, through-yesterday, today-counts, break-days ignored, far-run
  longest) — 36/36 pass; 3 inline scripts node --check; class sweep clean.
  `stats/index.html` + `assets/js/ttstats.js` only. NEXT batches (on Andy's
  go): batch 2 = day-of-week + hour-of-day + donut swap; batch 3 = period
  comparisons + export/import (merge-not-replace).
- **2026-11-11 (Kimi Work, on development post-merge):** stats page card-row
  CSS fix (light model, Andy's "card UI need cleaning up" + screenshot) — the
  stats page's chunk-1 CSS had an invented card scheme (`.tt-cards-row`,
  `.tt-card-title`, `object-fit: cover`, hardcoded colors) that never matched
  the canonical markup (`.tt-card-row`, `.tt-card-text`), so the Timers/Tools
  cards stacked full-width with unstyled text. Replaced with the exact
  canonical tt-card block from `streaks/` — horizontal snap-scroll row,
  240px cards, 170px contained images on #FBF3E4, full dark-theme overrides.
  Swept all 70 classes used in the page against the CSS: zero missing.
  FOLLOW-UP same session: the 4 hero stat cards were top-aligned (inline
  spans flowed onto ONE line + grid stretch left dead space below) — first
  fix made them a stacked flex column (icon over number over label), Andy
  wanted the original ONE-LINE layout just vertically centered: final =
  `.stat-card` is a centered flex ROW (icon + number + label side by side,
  8px gap, align/justify center, wraps on narrow), leftover `margin-top`s on
  `.s-num`/`.s-lbl` removed (gap handles spacing). `stats/index.html` only.
- **2026-11-11 (Kimi Work, pt 3, on master):** LOFI FULL PORT (Andy's go,
  "do the rest, ready to push live") — lofi1/2/3 now registered EVERYWHERE.
  (a) All 20 timer pages (en/id/es/pt/vi × index, 52-17, 20-20-20-rule,
  flowtime): 3 entries added after classroom in each SOUNDS list (main pages
  relative `ambience/audio/`, sub-pages `/ambience/` absolute — per
  convention) AND excluded from the ensureAudio() bulk preload
  (`indexOf('lofi') !== 0` skip) so ~2.8 MB of music doesn't download on the
  first ambience click; playSound()'s existing lazy fetch+replay path covers
  the first tap. custom-timer exempt (buildSoundUrl by id). (b) All 4
  translated Studio pages: same 3 entries (name stays "Lofi 1/2/3", absolute
  paths) + same LAZY skip as EN Studio. Verified: 3 lofi entries + lazy skip
  on all 25 changed pages, 194 inline JS blocks node --check, 0 JSON-LD
  issues. Backups `_backups/2026-11-11-lofi-port/` (24 files). Pushed to
  master 2026-11-11; merged into development same day.
- **2026-11-11 (Kimi Work, on master):** 3 lofi music tracks added to the
  Ambience Studio library (EN page): Andy's own files `lofi1/2/3.ogg`
  (0.85–1.05 MB each, OGG headers verified) + `lofi1/2/3.svg` icons, wired as
  3 new entries at the end of the SOUNDS array in `ambience/index.html` —
  grid tiles, preset editor and preset preview all render from SOUNDS, so one
  array addition covers everything. 4 inline scripts node --check. LAZY-LOAD
  (Andy's go, same session): the 3 music tracks were excluded from the
  upfront preload loop (DOMContentLoaded now skips lofi1/2/3) — ambience
  sounds still preload (~4.8 MB), saving ~2.8 MB + ~25 MB decoded RAM per
  visit; startSound() already fetches + auto-starts a buffered-missing sound
  on first click, so the only cost is a fraction of a second on the first
  music tap. STANDING-RULE GAP — CLOSED same day in pt 3 above.
- **2026-11-11 (Kimi Work):** stats page load animation (light model, Andy's
  go) — the 14-day chart bars now grow up on every page load (scaleY from the
  baseline, 55ms stagger per day left→right, day labels fade in after),
  empty-day ticks and the per-technique share bars animate too (width 0→%,
  120ms stagger per row). Re-renders (segment tabs, demo load, cross-tab
  storage sync) replay the animation — it reads as feedback, not noise.
  `prefers-reduced-motion` disables all of it. CSS + inline delays in
  `stats/index.html` only; 3 inline scripts node --check. Uncommitted.
- **2026-11-10 (Kimi Work):** STATS PHASE 1 (Andy's go, K3.1 Pro High) —
  four agreed tasks, all verified. (1) Shared recorder `assets/js/ttstats.js`
  (new file): `ttStats.recordSession(timerId,'focus'|'break',startMs,durMs)`
  + `recordTask(timerId,ts)` → localStorage `tt_stats_v1` {v:1,s:[],t:[]};
  caps 8000 sessions / 4000 tasks (drop oldest), <10s sessions dropped, quota
  overflow drops oldest half and retries once, then fails silently — stats
  must never break a timer. Pure helpers `report(from,to?)` (4 standard vars
  per Andy: Focus / Breaks / Tasks / Sessions, plus perTimer breakdown) and
  `dailySeries(days)` (oldest→today, sessions bucketed by start day). Timer
  ids: pomodoro, 52-17, 202020, flowtime, custom. (2) Main page wired: script
  include + wrapper IIFE after tomato.js that intercepts window.startTimer/
  stopTimer (verified: play/pause via onPlayClick→onStartTimer, reset,
  mode switches and loop advances all funnel through them) + 2 recordTask
  hooks in toggleDone and the zero-estimate done handler. (3) EN stats page
  `stats/index.html` (new, untracked): 4 segment tabs (Today/Week/Month/All),
  4 hero cards, 14-day stacked focus+break bar chart, per-technique share
  bars, "✨ Load example data" pill (seeded RNG, 42 days, written through the
  recorder so caps apply), two-step Clear all, storage-event cross-tab sync;
  full SEO set + JSON-LD ×3 (FAQ matches visible text), gtag, BSA loader +
  both side zones, Timers + Tools card rows. NOTE: `recordSession` duration
  is MILLISECONDS (converted to seconds on store) — a first-stats-page draft
  passed seconds and every demo session silently failed the 10s guard; caught
  by the unit test, fixed in the loader. (4) Verification: 27-assertion node
  test `_work/test_ttstats.js` (guards, boundary buckets, perTimer, daily
  cells, clear, caps) all pass; 14 inline scripts node --check (incl. the
  rewired index.html), 5 JSON-LD parse. NOT done yet (later phases, per the
  model split): recorder wiring on the other 24 timer pages, stats pin chips
  (medium model), translations (light), sitemap/hreflang (stats has en-only
  hreflang until translations exist), Tools-section card for stats. Next:
  Andy reviews `stats/` in Phoenix (load example data to see it populated),
  runs a real pomodoro session and checks it lands on the stats page.
- **2026-11-09 (Kimi Work):** workflow rule clarified after Andy interrupted a
  too-eager start on the stats build — the flow is discuss → Kimi states model
  + plan → ANDY SAYS GO (explicit) → build. "Are you ready?" = Kimi answers
  and stops (Andy may be switching models). Read-only investigation before
  the go is fine; writing files is not. Added to the model-efficiency policy
  in AGENTS.md. No page files touched.
- **2026-11-09 (Kimi Work):** Classroom sound made usable in timer presets —
  added `{ id:'classroom', ... }` to the SOUNDS list of all 20 timer pages
  (main index + 52-17 + 20-20-20-rule + flowtime × en/id/es/pt/vi). Why:
  dropdowns show user combos synced from shared storage, but each page can
  only PLAY sounds listed in its own SOUNDS array — unlisted = silent layer.
  custom-timer exempt (builds URLs by id; its ambienceSounds var is dead
  code). Main pages: relative path; sub-pages: `/ambience/` absolute. 204
  inline JS blocks node --check. Standing rule added to Site conventions:
  new sounds must always be registered on every timer page, never
  Studio-only. Backups `_backups/2026-11-09-classroom-sounds/`.
- **2026-11-09 (Kimi Work):** new "Classroom" ambience preset ported to all 4
  translated ambience pages (id "Ruang Kelas" / es "Aula" / pt "Sala de Aula"
  / vi "Lớp học" — Andy to review id wording). Andy added the sound + EN
  preset himself (`audio/classroom.ogg`, `icons/classroom.svg`). Translations
  reference `/ambience/...` root-absolute paths so no asset copies needed.
  BUGFIX: EN preset pointed at `icons/Classroom.svg` (capital C) but the file
  is lowercase — would 404 on the live Linux host; path corrected.
  5 pages verified: preset present, 36 inline JS blocks node --check.
  Backups `_backups/2026-11-09-classroom/`. New audio+icon files are untracked
  — Andy commits them with the pages.
- **2026-11-06 (Kimi Work):** pin-chip height fix — measured live in the
  browser (WebBridge): main-page chip was already the slimmer one (58.8px);
  sub-page chips were bloated to 78.3px because Baloo Tammudu's default
  line box is ~2.2em (a 14px line in a 31px box). Fix: explicit
  `line-height: 1.5` on `.pin-chip .pc-name` + `.pc-time` on the 4 ENGLISH
  sub-pages → both now icon-height driven (~57px), matching the main page.
  Pure CSS, no markup/JS. Diagnosis method worth remembering: don't trust
  screenshots with unknown zoom — measure getBoundingClientRect on both
  pages and normalize by logo width. Backups `_backups/2026-11-06-chip-lh/`.
  PORTED same day on Andy's OK to all 16 translated sub-pages (id/es/pt/vi ×
  the 4 timers) — 16/16 applied, all chips now uniform ~57px site-wide.
- **2026-11-06 (Kimi Work):** model-efficiency policy added to AGENTS.md —
  standing rule per Andy: default LIGHT (K2.8), and the flow for EVERY task
  is discuss → Kimi states recommended model + plan → Andy's go → build.
  Light for CSS tweaks/ports, medium for new builds/refactors, heavy
  reserved for git mysteries and unsolved bugs. No page files touched;
  AGENTS.md change for Andy to commit with the next push.
- **2026-11-05 (Kimi Work, pt 35):** pin-row PORTED to all 16 translated
  sub-pages (id/es/pt/vi × 52-17, 20-20-20-rule, flowtime, custom-timer) on
  Andy's OK — identical move as pt 34 via `_work/pinrow_port_translations.py`
  (variant-tolerant: comment block replaced by span, custom-timer pages use
  the sr-only h1 anchor). Verified: header-left chip-free, exactly one
  .pin-row with both chips before .stage, language-prefixed chip links intact,
  140 inline JS blocks node --check, JSON-LD parses. Backups in
  `_backups/2026-11-04-pinrow/`. ALL 20 sub-pages now have side-by-side
  chips — ready to push.
- **2026-11-05 (Kimi Work, pt 34):** pin chips SIDE BY SIDE on the 4 ENGLISH
  sub-pages too (52-17, 20-20-20-rule, flowtime, custom-timer) — Andy didn't
  want them stacked there. Chips moved OUT of the 350px `.header-left` column
  into a new full-width `.pin-row` div sitting between `</div>` (header close)
  and `.stage` (custom-timer: before the sr-only h1). `.pin-row` =
  max-width 1140px centered, padding-left 50px (header 40 + header-left 10) so
  the chips align exactly with the language/theme selects above, flex row,
  gap 8px, wraps on narrow; ≤991px rule centers them (padding 15px). Empty
  row = 0 height, so zero layout shift when nothing is pinned. `#streakChip`
  lost its `margin-top: 8px` (gap handles it). No JS changes — the chip IIFEs
  are location-independent. Custom-timer needed its own comment anchor
  (different line wrap). Verified: 39 inline JS blocks node --check, 12
  JSON-LD parse, header-left chip-free, pin-row before stage on all 4.
  Backups `_backups/2026-11-04-pinrow/`. ENGLISH ONLY — the 16 translated
  sub-pages wait for Andy's OK (English-first rule).
- **2026-11-04 (Kimi Work, pt 33):** pin-chip shake fix — the days-until
  chip visibly jittered every second because Baloo's digits aren't
  fixed-width (each tick changed the chip width, nudging the streak chip
  beside it). Fix: `.pin-chip .pc-time` gets `min-width: 130px` so
  per-second digit changes never resize the chip. 5 ENGLISH pages only
  (index, 52-17, 20-20-20-rule, flowtime, custom-timer) — same one-line
  change ported to the 20 translations on Andy's OK, same session. All 26
  changed files staged for Andy's push (side-by-side chips + shake fix).
- **2026-11-04 (Kimi Work, pt 32):** BRANCH RESCUE — master and development
  had diverged: master held the late-Oct fixes (translated pages' ads at
  top:300px + 1400px gate, 1090px column cap, 400px todo-gap removal) while
  development (branched earlier) held all of Nov 3–4 (streaks, chips, Tools
  sections, blueprint card). Andy switched to master, saw the new files
  "disappear" (they were only on development) — nothing was ever deleted.
  Kimi ran `git merge development` on master locally (Andy's go, he commits
  + pushes himself): all 20 translated pages auto-merged clean; only
  AGENTS.md conflicted (HEAD side empty — kept development's pt 21–31 log
  entries). Also untracked `_work/` + `_backups/` from the index (Andy's
  stray "a" commit had pushed them; .gitignore now covers them). Verified
  post-merge: zero conflict markers repo-wide, every translated page has
  BOTH the Oct fixes AND the Nov work, days-until intact on all 5
  languages, 271 inline scripts node --check, JSON-LD parses. LESSON:
  development must be created fresh from master (or merged back) after
  every publish — never let it sit behind master. LATE ADD to the merge:
  pin chips on the 5 main index pages now sit SIDE BY SIDE (Andy's catch
  during merge review) — `.pin-chip` display:inline-flex + vertical-align:top,
  `#streakChip` margin-top:8px → margin-left:8px, and both chip IIFEs restore
  'inline-flex' instead of 'flex'; they wrap to stacked on narrow screens.
  Sub-pages keep stacking (their header-left column is only 350px — two
  chips can't fit side by side).
- **2026-11-04 (Kimi Work, pt 31):** Tools section ported to all 24
  translated pages (id/es/pt/vi × index, 52-17, 20-20-20-rule, flowtime,
  custom-timer, ambience) — closes the pt 30 gap. Section wording reused
  verbatim from each language's streaks page Tools section (heading Alat /
  Herramientas / Ferramentas / Công Cụ + the approved Days Until card),
  with a NEW translated Streak Counter card appended (heading stays English,
  text + alt translated, links to /<lang>/streaks/). Inserted right after
  the other-rhythm section (timers-section on ambience). ALSO: the EN
  ambience tt-cards width fix (pt 17, width:100% max-width:1200px) finally
  ported to the 4 translated ambience pages — they still had the old 900px
  shrink-wrap bug. Pure HTML/CSS, verified: 1 tools section + both cards +
  language-prefixed links on all 24.

- **2026-11-04 (Kimi Work, pt 30):** Streak Counter card added to the Tools
  section of all 6 ENGLISH pages (index, 52-17, 20-20-20-rule, flowtime,
  ambience, custom-timer), right after the Days Until card — same tt-card
  format. Card art `assets/images/streaks-card.png` = monocle duck
  (128px icon upscaled to 480² transparent, 141 KB; original hi-res zip is
  gone from the Desktop, so the icon was the best source). English only per
  the rule — translations pending Andy's OK. NOTE: translated timer pages
  still have NO Tools section at all (needs the Days Until card too when
  that port happens).

- **2026-11-04 (Kimi Work, pt 29):** new video card on the EN main page grid
  — "Blueprint for success!" (https://youtu.be/zKWmAhtYq-o) with preview
  `assets/gifs/blueprint.mp4` (Andy's "2 sec.mp4" 685 KB → 480p H.264, no
  audio, faststart → 55 KB, frame-checked). Card sits ON TOP of the grid
  (first position) — Andy's new standing rule, now in Site conventions.
  English only per the English-first rule — PORTED same day on Andy's OK:
  blueprint card added to the top of id/es/pt/vi index grids with translated
  aria-labels. Also: added `.gitignore` (`_work/`, `_backups/` — local-only
  per the rules, no longer noise in GitHub Desktop) and resolved a stale
  unmerged index entry on AGENTS.md (leftover from the Nov 1 stash pop;
  file content was already correct, `git add` marked it resolved).

- **2026-11-04 (Kimi Work, pt 28):** STREAKS FULL ROLLOUT — all 3 jobs from
  Andy's go. (a) **Translations shipped**: `id|es|pt|vi/streaks/index.html`
  built from the EN master via `_work/streaks_translations.py` (122
  exact-match rows per language, count-asserted, aborts on miss) — full SEO
  set, JSON-LD ×3, calendar/month strings, seed name translated (Streak
  Pomodoro / Racha Pomodoro / Sequência Pomodoro / Chuỗi Pomodoro); product
  name "Streak Counter" stays English. EN streaks page gained the tt_lang
  redirect, 6-link hreflang, 5-option lang dropdown. sitemap.xml 35 → 40
  URLs. (b) **Welcome seed everywhere**: on a true first visit
  (`tt_streaks_v1 == null`) the streaks page AND every timer page's streak
  chip seed one pinned "Pomodoro Streak" (checkin mode, today pre-checked,
  red, duck-tomato icon) — never re-seeds once removed. (c) **Streak pin
  chip on all 25 timer pages**: EN index hand-built (pt 27), the other 24
  via `_work/streak_chip_port.py` — chip markup + IIFE (translated title/
  count format/link per language) + `#streakChip { margin-top: 8px }` CSS.
  FIX CAUGHT: the port script anchored on the CSS comment mentioning
  `tt_countdowns_v1`, so the chip `<div>`+script landed inside `<head>` on
  all 24 pages — moved them into the body right after the countdown-chip
  IIFE via a fixer script (backups `_backups/2026-11-04-streakchip-fix/`).
  Verified: 235 inline JS blocks node --check, JSON-LD parses everywhere,
  id chip spot-checked (translated strings, `/id/streaks/` link, translated
  seed). Streak chip CSS tweak same day: `#streakChip` got `max-width: 260px;
  padding-right: 18px` (pt translation "Sequência de N dias" was touching the
  chip's right edge at the old 215px cap). Uncommitted. KNOWN GAP to flag: the Tools card section (Days Until
  card) exists only on the 6 English pages — translated timer pages never
  got it; Streak Counter card not added anywhere yet. Next: Andy reviews id
  wording first, then commits on `development`.
- **2026-11-04 (Kimi Work, pt 27):** STREAK PIN CHIP on the English main
  page (`index.html` only, per English-first). Second `.pin-chip`
  (`#streakChip`) stacks below the days-until chip in the same col under the
  mode tabs — identical format/size/theme (reuses all `.pin-chip` CSS incl.
  dark/classic; only new rule `#streakChip { margin-top: 8px }`). Its own
  IIFE reads `tt_streaks_v1`, takes the first pinned streak, and shows icon
  (emoji or `img:` mascot) + name + "🔥 N-day streak" (N in the accent
  `.pc-days` color; dead runs / not-yet-started streaks just show
  "🔥 0-day streak" — longer fallback texts overflowed the chip). Streak math copied verbatim from
  the streaks page (count-up = days since start; check-in = run ending
  today, falling back to yesterday while today is unchecked). Click/Enter/
  Space → `/streaks/`; updates on `storage` events, no pin → display:none,
  no 1s ticker needed (daily granularity). Verified: 12 JS blocks node
  --check, 3 JSON-LD parse, 8-assertion math test (countup boundaries,
  alive-through-yesterday, dead runs, gaps). Uncommitted. Next: Andy
  pin-tests in Phoenix (pin a streak → reload main page), then ports to
  52-17 / 20-20-20-rule / flowtime / custom-timer on his OK.
- **2026-11-04 (Kimi Work, pt 26):** streaks rev 5 — CALENDAR LANES (fixes
  the "calendar explodes with many streaks" problem). All view now assigns
  every visible streak a FIXED lane (index in the hideAll-filtered list), so
  each streak's line runs in its own row straight across the month instead
  of bars re-stacking per cell. Cap = 5 lanes (MAX_LANES); active streaks
  beyond lane 5 roll up into a "+N" pill at the cell's top-right (hover
  tooltip lists their names). Bars are now absolutely positioned per lane
  (`.cal-bars` fixed 35px, lane step 7px; cl/cr connection overhangs moved
  from margins to left/right offsets); focus view's single big bar centered
  in the lane area (top 13px). Mobile cells 48→56px so 5 lanes fit under
  the day number. Explainer paragraph documents the 5-line cap (FAQ/JSON-LD
  didn't claim otherwise — untouched). ALSO: filter chips vertical centering
  fixed — chip is now a fixed 30px-high flex row, all spans line-height 1
  (dot/emoji/name/count sit on one optical center); rev 5b: Baloo glyphs
  ride high in the em box, so chip text spans (`.cname`/`.cnum`, incl. the
  All chip, now span-wrapped) get `transform: translateY(1.5px)` — dot and
  icon stay geometrically centered, text drops to optical center. All 4 JS blocks node
  --check, 3 JSON-LD parse. Uncommitted.
- **2026-11-04 (Kimi Work, pt 25):** streaks rev 4 — CHECK-INS NOW TOGGLE:
  clicking ✓ again (big stats-band button AND per-row mini button) undoes
  today's check-in via shared `toggleToday()` (toast confirms either way);
  done state is a green `.done` style instead of a disabled button. Manage
  row action order is now pin → hide → edit → csv → delete (pin leftmost).
  Filter chips row centered (`.chips { justify-content: center }`). New
  streaks default to the monocle duck mascot (`DEFAULT_ICON =
  'img:duck-monocle'`, was 🔥). Also resolved leftover git stash-conflict
  markers in this file (kept the stashed pt 20–24 entries, deleted only the
  3 marker lines; full-repo scan = zero markers). Main script node --check
  passes. Uncommitted, `streaks/` still untracked — Andy must be on
  `development` before committing. Next: wire the streak pin chip into the
  5 English timer pages on Andy's go.
- **2026-11-04 (Kimi Work, pt 24):** streaks rev 3 — tiny chip eye toggle
  REMOVED (too small to hit); hide/show is now a text button in the manage
  list before pin (hidden rows dim: icon/name/count at 45%). The fake
  "check-in" mode badge Andy tried to click is now a REAL per-row action:
  "✓ check in" mini-button on check-in streaks (green "✓ done today" when
  used — quick check-in without focusing); count-up rows show a plain
  borderless "count-up" label so nothing looks clickable that isn't.
  Explainer + all-hidden hint reworded to match. node --check passes.
- **2026-11-03 (Kimi Work, pt 23):** streaks rev 2 — ALL-VIEW FILTERING:
  every streak chip gets a 👁/🚫 toggle (persisted as `hideAll` on the
  streak object) that hides its line from the All view; hidden chips dim,
  streak keeps counting, hint covers the all-hidden case; explainer How
  It Works paragraph documents it (FAQ/JSON-LD untouched). DELETE
  CONFIRMATION: delete is now two-step — first click turns the button red
  "sure?" for 3s, second click deletes (undo toast still there as backup).
  Main script node --check passes.
- **2026-11-03 (Kimi Work, pt 22):** streaks rev 1 after Andy's first look —
  lang dropdown globe padding restored (was overlapping "English"); stats
  band cards now flex-centered vertically (numbers looked top-glued next
  to the taller note card); CALENDAR IS NOW ALWAYS VISIBLE even with zero
  streaks (differentiates from days-until's hidden board — empty calendar
  shows "Add your first streak above — it will draw its line right here.",
  empty-state presets move below it); new "✨ Load 3 example streaks" pill
  in the empty state creates deletable demo data relative to today
  (Morning run 🏃 7-day run after a gap, Read 20 pages 📚 checked in
  today, Days without coffee ☕ count-up 45 days). Main script node --check
  passes.
- **2026-11-03 (Kimi Work, pt 21):** STREAKS PROTOTYPE (English only,
  uncommitted, untracked `streaks/index.html` — Andy to switch to
  `development` BEFORE committing). General streak counter, deliberately
  NOT card-styled like days-until: hero = one big month calendar where
  every streak draws a colored line (bars connect across consecutive day
  cells, Google-Calendar style); filter chips (All + per-streak) above,
  stats band + manage list + export/import below. Two modes: check-in
  (daily tap, miss = current run breaks, best streak kept forever,
  BACKFILL allowed by tapping any past day ≥ start — Andy's call: "no
  reason to punish user") and count-up (days-since, zero maintenance).
  Per streak: name/icon (12 emoji + 16 mascots)/color (same 6) / start
  date; milestones 🔥 every 7 days, ⭐ at 100/365 in focus view. Storage
  `tt_streaks_v1` (checkins as date-key map). Export all → JSON, import
  merges by id, per-streak CSV. Pin flag stored per streak (📌 in manage
  list) — timer-page chip NOT wired yet (comes after Andy approves the
  page). No share links, no welcome seed, no translations/hreflang/
  tt_lang redirect yet (lang dropdown = English only). Full SEO set
  (title/description/canonical/og/JSON-LD WebApp+Breadcrumb+FAQ matching
  visible text, FAQ answers verbatim). Verified: 4 JS blocks node --check,
  3 JSON-LD parse, 21-assertion math test (alive/dead streaks, backfill
  healing, best-streak survival, month counts, countup boundaries).
  Next: Andy reviews in Phoenix → pin chip wiring on timer pages →
  share links? → welcome seed? → translations.
- **2026-11-01 (Kimi Work, pt 20):** HOTFIX — live pin chip rendered
  "transparent" (text only, no card). Cause: the development→master merge
  committed UNRESOLVED conflict markers (`<<<<<<< HEAD` / `=======` /
  `>>>>>>> development`) into `index.html` (wrapping the entire pin-chip
  CSS block, so the browser dropped those rules) and `AGENTS.md` (2
  regions). origin/development is clean — markers existed on master only.
  Resolved by hand: kept the development side everywhere, deleted all 9
  marker lines across the 2 files, full-repo scan confirms zero markers
  left. LESSON: after any merge, grep for `^<<<<<<<` before committing —
  GitHub Desktop/web can leave markers in a file that still gets committed.
  Andy to commit `index.html` + `AGENTS.md` directly on master and push
  (one-time hotfix exception to the development-first flow).
- **2026-11-01 (Kimi Work, pt 19):** empty-state mascot image REMOVED from
  all 5 days-until pages (text + preset chips only now; `.empty img` CSS
  gone too). **Welcome seed SHIPPED to all 30 pages** via
  `_work/seed_welcome.py`: on a true first visit (no `tt_countdowns_v1`
  key at all) every timer page's pin-chip IIFE and every days-until page
  seeds one pinned countdown — name "👋 Click me!" (id: Klik aku!, es:
  ¡Haz clic!, pt: Clique aqui!, vi: Nhấn vào tôi!), target = first open
  +30 days, color #DE4B3A, icon `img:duck-astronaut`. It's pinned by
  default so the chip shows on timer pages immediately; unpinning or
  deleting is permanent (never re-seeds — the key exists after first
  write). Existing users with a store are untouched. Verified: node test
  simulates first visit (target exactly +30d, chip regex parses it, no
  re-seed on 2nd visit), all 235 inline JS blocks pass node --check,
  backups in `_backups/2026-11-01-seed-welcome/`. Uncommitted.
- **2026-10-31 (Kimi Work, pt 18):** pin chip SHIPPED to all 20 translated
  timer pages (id/es/pt/vi × index, 52-17, 20-20-20-rule, flowtime,
  custom-timer) via `_work/add_pin_translations.py` — extracts the exact
  CSS/HTML/JS blocks from the EN masters, translates visible strings
  (tooltip title, default name, 🎉 Hari Ini/Hoy/Hoje/Hôm Nay, Ended,
  day/days), and points the chip link at `/<lang>/days-until/`. Storage key
  `tt_countdowns_v1` is shared across languages, so a pin made on any
  language's days-until page shows everywhere. Ambience pages deliberately
  excluded (EN ambience has no chip either). All 20 pin scripts pass
  node --check; backups in `_backups/2026-10-31-pin-translations/`.
  Uncommitted — Andy reviews id first, as usual.
- **2026-10-31 (Kimi Work, pt 17):** ambience cards REAL alignment fix —
  pt 16's max-width change didn't solve it. Actual root cause:
  `ambience/index.html`'s `.page-wrapper` is a flex column with
  `align-items:center`, so each `.tt-cards` section shrink-wrapped to its
  content — the 5-card Timers row hit the 1200px cap and looked aligned,
  but the 1-card Tools row floated to the middle. Fix: `.tt-cards` now
  `width:100%; max-width:1200px` (line ~1421). English ambience only;
  other EN pages use normal block layout and were never affected;
  translations untouched per English-first rule. Copied to GitHub clone,
  uncommitted.
- **2026-10-31 (Kimi Work, pt 16):** ambience card alignment fix (its
  `.tt-cards` was max-width 900px — the odd one out; now 1200px like every
  other page, so the Tools section sits left-aligned like the main page).
  Then **days-until translations SHIPPED** — `id/es/pt/vi/days-until/`
  built from the EN master via `_work/days_until_translations.py` (~90
  exact-match pairs per language, count-asserted, aborts on miss): full
  SEO set (title/description/keywords/canonical/og:locale per language —
  pt_BR), JSON-LD WebApplication + BreadcrumbList + FAQPage translated,
  explainer, form, toasts, card actions, aria labels, month names
  (Mei/Agu/Okt/Des, Ene/Dic, Fev/Dez, Th1–Th12), presets (Natal/Tahun
  Baru/…), cards row reusing the approved per-language card texts from the
  timer pages, footer strings from the same. AM/PM kept everywhere.
  EN days-until gained the `tt_lang` redirect script (translations exist
  now) + full 6-link hreflang; all 5 days-until pages carry the 6-link
  cluster. sitemap.xml 30 → 35 URLs (+5 days-until). All 5 pages: 5
  scripts node --check OK, 3 JSON-LD parse, no English leftovers, lang
  dropdown selects correct language. Synced to GitHub clone. Next: Andy
  reviews id wording first (as usual), then es/pt/vi, then merge.
- **2026-10-31 (Kimi Work, pt 15):** new "Tools" card section on all 6
  English pages (index, 52-17, 20-20-20-rule, flowtime, ambience,
  custom-timer) — a separate `<section id="tools" class="tt-cards">` right
  after the Other Rhythm section (ambience: after `timers-section`),
  reusing the exact tt-card style. First card: **Days Until Countdown**
  → https://www.tomatotimers.com/days-until/ with new art
  `assets/images/days-until-card.png` (Andy's frame_25.png, 2160² RGBA →
  bbox-trimmed → padded square → 480², 149 KB — same pipeline as the
  custom-timer card). Heading is plain "Tools" per Andy; SEO keywords live
  in the card copy ("deadline countdown", "exams, launches, holidays").
  days-until itself does NOT get the section (self-link). NOTE: the card
  link 404s until days-until is merged to master — they ship together on
  the development branch. All 6 pages' scripts pass node --check.
- **2026-10-31 (Kimi Work, pt 14):** main-page pin-chip top margin 6px →
  14px — was hugging the POMODORO tab row. Sub-page placement approved
  as-is by Andy.
- **2026-10-31 (Kimi Work, pt 13):** pin-chip REPOSITIONED per Andy — the
  floating-in-the-side-lane approach collided with the BuySellAds side
  zones (and clipped at the viewport edge on the sub-pages). New home on
  all 5 English pages: IN-FLOW, left-aligned under the row above the
  mascot — main `index.html`: own `col-lg-12` directly under the mode-tabs
  row (aligns with the POMODORO tab's left edge); 4 sub-pages: inside
  `.header-left` directly under the language/theme selects (follows the
  header's responsive wrap for free). All absolute positioning + media
  queries removed — zero ad-lane conflicts, no clipping at any width.
  Move scripted (`_work/pin_chip_move.py` + a variant pass for
  custom-timer's line-broken header markup). All 5 pages' scripts pass
  node --check. Synced. Next: Andy checks alignment at 140% zoom.
- **2026-10-31 (Kimi Work, pt 12):** pin-chip ported to the other ENGLISH
  timer pages — `52-17/`, `20-20-20-rule/`, `flowtime/`, `custom-timer/`
  (pin limit stays 1 per Andy; multi-pin shelved until more pin formats
  exist). Applied via `_work/pin_chip_port.py` (exact-match anchors, aborts
  on miss): same chip markup + IIFE as the main page, CSS re-themed to the
  shared vars (`--panel/--text/--border/--tomato`, `html.theme-dark`
  automatic — no classic theme on these pages). Placement differs from the
  main page: stage is 780px so the chip floats LEFT of the stage
  (`right: calc(100% + 18px); top: 120px` on the relative `.stage`) at
  ≥1300px, tucks centered at the top of the stage below that.
  custom-timer's `.stage` gained `position: relative`. All pages' inline
  scripts pass node --check (9/10/7/6 scripts). Synced to GitHub clone.
  Next: Andy pin-tests on all 4 pages at 140% zoom.
- **2026-10-30 (Kimi Work, pt 11):** pin-chip on the ENGLISH main page
  (Option A, Andy's pick; ONE pin only — days-until unchanged, the second
  flank slot is reserved for future pin formats). `index.html` gains
  `.pin-chip` markup + CSS + self-contained IIFE right after the mascot
  block: reads `tt_countdowns_v1`, finds the pinned countdown, shows
  icon (emoji or `img:` mascot) + name + live-ticking "N days · HH:MM:SS"
  (🎉 Today / Ended states), click/Enter/Space → `/days-until/`. Floats
  left of the mascot at ≥1300px (absolute inside the relative container,
  no layout shift), tucks centered under the mascot below that. Themed
  for light/dark/classic; countdown color = left accent bar; updates on
  `storage` events. NO pin → chip stays display:none, page 100%
  unchanged. Date parser unit-tested (Feb-30/leap/garbage guards). Next:
  Andy pin-tests in Phoenix (pin on days-until → reload main page),
  then ports to the other timers after approval.
- **2026-10-30 (Kimi Work, pt 10):** card icon nudged down per Andy —
  `.cd-emoji` now `align-self: flex-end; margin-bottom: 2px` (bottom-aligns
  with the countdown row instead of centering across name+countdown). Size
  unchanged (60px img / 56px emoji, approved).
- **2026-10-30 (Kimi Work, pt 9):** icon sizes bumped per Andy ("kinda
  small") — picker cells 40→58px (img 30→46, emoji glyph 19→28px), picker
  button 40→52px, card icon 40→60px img / 56px emoji, share-hero icon
  54→72px / 68px emoji. CSS-only, days-until. Andy also asked whether pin
  is testable in Phoenix Code — YES: pin state lives in localStorage
  `tt_countdowns_v1` (works in any preview); the only missing piece is the
  pin-strip DISPLAY on timer pages (not built yet).
- **2026-10-30 (Kimi Work, pt 8):** mascot icon set for days-until. Andy's
  zip (`kepala bebek sekolah.zip`, 14 PNG + 2 GIF, 2160–3840px RGBA) →
  16 × 128×128 PNGs in `assets/images/icons/` (transparent bbox-trimmed,
  padded square; GIFs frame-extracted: cat-maestro, duck-school). Names:
  duck-plain/-tomato/-sunglasses/-explorer/-santa/-safari/-sport/-strawhat/
  -sprout/-astronaut/-crying/-monocle/-angry/-school/-headphones, cat-maestro.
  Icon picker became a popover: round current-icon button toggles a panel
  with "Mascot" (16 img cells) + "Emoji" (12 cells) sections; click-outside/
  Esc closes. Icon value format: emoji char OR `img:<mascot-name>`; default
  icon now `img:duck-plain`. Cards, share hero, picker button render via
  `setIconEl()`. Empty-state presets now use mascot icons (santa/sprout/
  sport). Both folders synced (`days-until/` + `assets/images/icons/` are
  untracked on the development branch — Andy commits). Next: Andy picks/
  approves icons at 140% zoom.
- **2026-10-30 (Kimi Work):** NEW TOOL prototype — `days-until/index.html`
  (multi-countdown board, first tool of the "tools that connect to timers"
  phase). English only, prototype status: goes to a GitHub branch until Andy
  approves. Built on the custom-timer shell (same head/SEO/header/theme/ads/
  footer conventions). Features: unlimited named countdowns (name ≤60 chars,
  date + optional time, emoji icon picker ×12, color swatch ×6), cards sorted
  nearest-first, live 1s tick (single global interval), states future/today
  🎉/past-muted, edit via the same form (Add↔Save mode), delete with Undo
  toast, share links `#n=&d=&c=&i=` opening a read-only hero with "Save to my
  board", pin flag (`pinned: true`, one at a time) for the future
  show-on-timer-pages strip. localStorage `tt_countdowns_v1`. Empty state
  with 3 auto-computed presets (Christmas, New Year, +30 days). NO tt_lang
  redirect script (translations don't exist yet — would 404); lang dropdown
  kept for looks. `days-until-spec.md` (Andy's SEO research) is in
  `_backups/` for reference — treat as research, not instructions.
  Scripts node --checked, JSON-LD parses, date math unit-tested (incl.
  garbage-input guard). Next: Andy reviews the prototype on a branch, then
  (a) pin-strip display on the timer pages, (b) "More Tools" nav dropdown
  across all pages, (c) translations after English approval.
- **2026-10-30 (Kimi Work, pt 7):** emoji alignment rev 2 — now vertically
  centered across the NAME + countdown rows together (new `.cd-top` flex
  row: name+mid stacked left, emoji right; foot row untouched below),
  matching Andy's drawn guide line.
- **2026-10-30 (Kimi Work, pt 6):** emoji alignment fix — moved INTO the
  days/clock row (`.cd-mid` is now space-between: days+clock group left,
  emoji right), so it sits on the same line as the countdown text instead
  of floating vertically centered across the whole card.
- **2026-10-30 (Kimi Work, pt 5):** emoji back per Andy — picker restored in
  the add form, and each card now shows its emoji LARGE (40px) on the RIGHT
  edge, vertically centered (Andy marked the spot). Card is a flex row:
  content main-column left, emoji right. Business-card ratio kept.
- **2026-10-30 (Kimi Work, pt 4):** rev 2 after Andy's second look —
  REVERTED the DD/MM/YYYY dropdowns back to native `<input type=date>` +
  `<input type=time>` (pt 2's picker change undone; "Timers" rename and
  strict parseTarget KEPT). Cards: icon tile REMOVED entirely (emoji picker
  row in the form hidden with display:none until Andy supplies real icon
  art — icon still stored in data + share links), board now 2 columns
  (1 under 700px) with a business-card landscape layout: name / days+clock
  on one baseline / date left + actions right. Left color stripe stays.
  NOTE for Andy: the tomato image he asked about is the EMPTY-STATE mascot
  (`tomato-cartoon.svg`, placeholder per the MASCOT PLACEHOLDER convention).
- **2026-10-30 (Kimi Work, pt 3):** cards went HORIZONTAL — emoji/icon now
  sits in a tinted rounded tile on the LEFT (card accent color via
  `--cd` + color-mix, rgba fallback), accent stripe moved from top border to
  left border, content (name / big days / clock / date / actions) in a right
  column, actions left-aligned. Vertical layout abandoned per Andy's review.
- **2026-10-30 (Kimi Work, pt 2):** prototype rev 1 after Andy's first look —
  "Other Rhythm" section + nav pill renamed to "Timers" (this is a non-timer
  page), and native date/time inputs replaced with explicit dropdowns:
  DD / MM(month name) / YYYY (current..+10) + optional hour(1–12) /
  minute(5-min steps) / AM-PM ("--" hour = all-day). parseTarget made STRICT
  (rejects Feb-30-style rollovers, leap years verified). All scripts +
  date tests pass.
- **2026-10-29 (Kimi Work):** main-page side ads moved from `top: 300px`
  back up to `top: 80px` (both `.bsa-left/right-sidebar-wrapper` in
  `index.html`) so they start right below the promo bar like flowtime
  instead of floating mid-page over the to-do section. Safe now because
  the header content is capped at 1090px (2026-10-28 pt 28), which leaves
  clear side lanes at the 1400px+ viewports where `.bsa-side-ad` shows.
  English `index.html` only — translations (id/es/pt/vi `index.html`) still
  at 300px pending Andy's review, per the English-first rule. Backup
  `_backups/2026-10-29_main-ad-top/`. Next: Andy eyeballs it live, then the
  same 80px change goes to the 4 translated main pages.
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
