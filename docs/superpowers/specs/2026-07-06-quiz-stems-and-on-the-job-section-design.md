# Quiz-Stem Clarity + the "On the job" Section — Design

**Date:** 2026-07-06
**Status:** Approved by user. Calibrated in a visual-companion session on Phase 2: combined
"job-moment artifact × hand-drawn skin" treatment chosen (A+C), v3 content approved, placement
B chosen (after quick checks, before teach-back). Mockups preserved in
`.superpowers/brainstorm/363-1783355912/content/` (phase2-on-the-job-v3.html, placement.html).

## Problem

Two clarity gaps block a non-native-English, never-coded learner:

1. **Quiz stems too terse to interpret.** 2.3's "For how many values of n can bigPrize() ever
   run? Type the number." states neither the background fact the game depends on (n could be
   *any* number) nor what a valid answer looks like.
2. **Job notes don't land.** The 59 💼 paragraphs inside Under the Hood are prose-only, still
   carry fancy/figurative English, and lean on vocabulary untaught at their lesson's position
   (status codes in Phase 2, assertions before Phase 10). The learner cannot *co-relate* —
   yet the job connection is the course's entire endgame.

User-set principles: difficulty may live in the thinking, never in decoding the English.
Job moments should be **shown as they will actually look at work**, not described.

## Workstream 1 — The Quiz-Stem Contract (standing rule for all quiz content)

1. **Complete problem statement.** The stem states every background fact the question depends
   on ("n can be any number"). Never guess the situation or the universe of inputs.
2. **Explicit answer shape** *(typed checks)*. The stem ends by naming a valid answer's form —
   "Type the count — 0 if none.", "Type its name.", "Type yes or no." The placeholder
   reinforces it (`how many…`). MCQs are exempt: options are the shape.
3. **Never explain the approach.** No "try to find…", no pointing at the trick (2.3's quiz 2
   currently says "notice the first case has NO break" — spotting that IS the test). What a
   question tests never changes; only how it asks.

**Calibration (approved).** 2.3 quiz 1 → "n can be any number. How many of them make
bigPrize() run? Type the count — 0 if none." / placeholder "how many…"; accepts and why
unchanged. 2.3 quiz 2 → drop the no-break hint; "Type it" → "Type the count."

**Scope:** all ~300 stems in all 115 lessons. Reasoning-hard is NOT a finding. Widen accepts
where new phrasing invites variants; whys untouched unless contradicted.

## Workstream 2 — The "On the job" Section (replaces the 💼 paragraphs in UTH)

### What it is

A new, optional lesson-page section that renders the lesson's job connection as a
**hand-drawn artifact of the real workplace moment** — a bug-report chat, a code-review
comment, a test-run printout — in the app's rough-ink sketchbook style.

- **Placement (chosen: B):** between the quiz ("quick checks") and teach-back. The learner
  has done the concept by then, so the moment lands as payoff — and it warms up teach-back.
- **Section anatomy (fixed):** tape label `💼 ON THE JOB` → one italic **scene caption** in
  plain future-work words ("One day at work, you will write a bug report like this:") →
  the **artifact** → one **takeaway** line with a highlighted key phrase.
- **Migration:** all 59 💼 paragraphs move OUT of `underTheHood` (UTH gets shorter) and are
  rebuilt as sections. Lessons without a note simply have no section.

### The template family (~6 artifact shapes cover all 59 notes)

team chat (bug report / teammate exchange) · app moment (a sketched page showing the bug) ·
code review comment (code + reviewer bubble) · test run (terminal card with ✓/✗ rows) ·
interview exchange (interviewer bubble + your-answer bubble) · CI pipeline (step row).

### Content rules (the simplest English in the app)

1. **Short sentences. NO em dashes.** Fragmented dash-chains read as broken English to
   non-native speakers (user-reported twice). This surface bans them outright.
2. **Anchored in taught vocabulary.** Everyday words are always fine (button, click,
   screenshot, username); untaught JARGON is glossed in everyday words or cut. One plain
   phase pointer allowed ("Phase 10 makes reviewing part of your job."). Displaced
   future-flavored examples (2.3's status codes) relocate to existing later notes.
3. **Real QA vocabulary is seeded with glosses where natural** — approved example: 2.1's
   bug report says "I expected the success flow (the happy path, where everything works)…
   the program took the failure path", planting the exact term 10.3 later teaches.
4. **Show, don't tell.** The artifact carries the demonstration; prose only does what the
   artifact can't (scene caption + takeaway). Words per note go DOWN.

### Calibration content (approved v3, Phase 2 complete)

- **2.1 · team chat:** bug report bubble ("The login button does nothing on iPad. I expected
  the success flow (the happy path, where everything works): the button is visible, so click
  it. The program took the failure path. The boolean isVisible was false.") + grateful dev
  reply. Takeaway: every bug report is a story about a branch.
- **2.2 · app moment:** quantity field holding `0` + wrong "please enter a quantity" warning
  + one code line (`if (quantity)` → 0 is falsy). Takeaway: the falsy list is the tester's
  edge-value list.
- **2.3 · code review:** PR card with the dead gate annotated + reviewer comment "Every score
  above 40 stops at gate one, so gate two never gets a turn. Swap the order: check
  score >= 90 first."
- **2.6 · test run:** dark terminal card, 50 usernames, hand-circled ✗ at user 24, note "the
  counter names the failing lap: i = 24". Phase-11 pointer: data-driven testing.

### Engine & code shape (follows existing conventions: JSX composition, like vizzes)

- `LessonDef` gains optional `onTheJob?: ReactNode` (engine/lesson/types.ts).
  `LessonShell` renders it in a PaperCard section between quiz and teach-back when present.
- Shared components in one file, `src/design/JobScene.tsx` (all named exports): `JobScene`
  (section wrapper — LessonShell renders the tape label) + `Scene` / `Takeaway` / `Key`,
  plus artifact pieces (`ChatBubble`, `ReviewCard`, `TestRunCard`, `Pass`/`Fail`,
  `AppMoment`, `PipelineRow`; an interview exchange is two `ChatBubble`s). Hand-drawn skin
  via wobbly border radii on the app's ink/marker tokens. Lessons compose these per note.
  (The implementation plan's Task 2 carries the exact component code.)
- The earlier `NoteCode` idea is superseded: artifact components carry their own code areas.

### Lint

- `scripts/lint-uth.mjs` gains an `onTheJob` extractor with the same idiom blocklist and
  28-word sentence cap, PLUS an em-dash ban for this surface only.
- UTH word counts drop as notes move out (always ≤ baseline, so lint stays green). No
  re-baseline required.

## Non-goals

- No curriculum changes, no new lessons, no difficulty changes, no fact/career-content cuts.
- Captions, hooks, exercises, teach-backs: out of scope (swept when friction is reported).
- No animation in v1 artifacts; static sketches only.

## Rollout

1. Build the section: types + LessonShell slot + JobScene component family + lint extractor.
2. Migrate Phase 2 (the four approved artifacts) → **user browser-verifies the section**
   (new visual element gate).
3. Remaining phases in batches (0–1, 3–4, 5–6, 7–8, 9–10, 11), each: migrate notes → rebuild
   under the content rules → lint + build.
4. Quiz-stem audit runs alongside in the same per-phase batches.
5. Blueprint doc (`04-LESSON-BLUEPRINT.md`) gains both contracts; the old "💼 badge inside
   UTH" rule is marked superseded.

## Verification

1. Per batch: `node scripts/lint-uth.mjs` clean + `npm run build` green.
2. Phase-2 browser gate after step 2; spot-checks per later batch.
3. Before/after table of every stem and every migrated note, presented to the user.
4. Fresher read per change: situation complete? shape explicit? approach unexplained? no em
   dashes? only taught vocabulary? artifact shows, prose doesn't retell?
5. Commit only on the user's word.

## Success criteria

- Any quiz stem is understood on first read: what is asked, what to type.
- Every lesson with a job note ends with a moment the learner will literally recognize at
  work someday — in the simplest English in the app.
- UTH is shorter everywhere; the job payload lives in its own visual section.
