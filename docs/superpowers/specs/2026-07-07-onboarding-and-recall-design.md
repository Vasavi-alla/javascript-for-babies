# Onboarding welcome + returning-learner recall — design

**Date:** 2026-07-07
**Status:** approved (design); not yet planned/implemented
**Author:** brainstormed with the user (Vasavi)

## Why

Learners finish a session and leave. Nothing brings them back into contact with
what they already covered, so it fades. Two additions fix the ends of that loop:

1. **A welcome modal** greets a brand-new learner, says who built this and why,
   takes their name, and sets the expectation that (a) short interview-style
   questions will appear as they go, and (b) they must tick **mark lesson
   complete** so their journey — and those questions — follow them.
2. **A recall check** surfaces interview questions on the topics a returning
   learner has already covered, so retention gets tested, not assumed.

Both lean on the *existing* "mark lesson complete" mechanism (already in
`LessonShell.tsx`) and the existing learner-name store — this feature makes that
mechanism *matter* and *visible*.

## Non-goals

- No grading, scoring, or right/wrong marking. The recall check is **self-rated
  confidence only** — the learner tells themselves how solid they feel.
- No backend. Everything persists to localStorage via the existing stores.
- No change to the existing per-lesson "🎤 in an interview" teaching section
  (`def.interview` + `InterviewCard`). That stays exactly as it is — it is
  *guidance* on how to answer, a different thing from the new question bank.
- Phase 0 is never quizzed (too foundational to be interview material).
- This feature authors the question bank for **phases 1–3 only**; the mechanism
  works for every phase, later phases are filled in future sessions.

---

## Feature A — Welcome modal

### Trigger & lifecycle
- **Show when:** the learner's name is still `DEFAULT_NAME` (`'friend'`, from
  `src/content/learner.ts`) **and** a persistent "seen" flag is not set.
- **Dismiss / stop showing:** entering a name (the primary path) sets the name
  away from the default, so it never shows again. A "maybe later" close also
  sets a persistent flag `jfb-welcome-seen` so refreshes do not re-nag. A small,
  always-available "who drew this? ✏️" affordance on the home page lets a curious
  learner re-open it (re-opening never resets the name).
- **Mount point:** rendered in `Layout.tsx` (wraps every route) but self-gates so
  it only appears over the home page (`useLocation().pathname` is `/` or ends in
  `-journey`). It must not appear over a lesson.

### Content (the copy Vasavi asked for)
Ordered, in the app's simplest-English register (see content rules below):

1. **Hi, welcome.** One warm line.
2. **Who I am.** Vasavi — a tester. Worked at **Amazon** and **Siemens**, now at
   **Dover**. (Reuse one of the existing `/vasavi/*.webp` portraits, as the home
   page and BreakCoach already do.)
3. **Why I built this.** For fellow testers who want to *become automation
   testers* and actually *understand how it works* — not just lean on AI.
4. **Your name.** A text field (same normalize rules as `useLearnerName`: trim,
   30-char cap, empty → stays `friend`). Saving writes via `useLearnerName`'s
   setter, which also gives the home page its `/<name>-journey` address (existing
   behavior — reuse, do not reinvent).
5. **What to expect.** "As you go, I'll ask you a few interview-style questions
   on what you've covered. They're **not graded** — they're just so *you* can see
   how confident you feel about each idea."
6. **The one habit that makes it work.** "Tick **mark lesson complete** at the
   bottom of each lesson. That's how your journey — and those questions — follow
   you back here."
7. **Primary action:** `InkButton` "start on page one ▸" (saves name if typed,
   closes). **Secondary:** "maybe later" (closes, sets seen flag).

### Visual & responsive (the "visually rich + iPad" requirement)
- Sketchbook skin, consistent with `BreakCoach.tsx`: `fixed inset-0 z-50` flex
  center, ink backdrop (`color-mix(in srgb, var(--color-ink) 35%, transparent)`),
  `motion` entrance (fade + slight `y`/`rotate` settle), body content on a
  `PaperCard`/`StickyNote` surface with a floating Vasavi portrait (bordered,
  slightly rotated, as BreakCoach floats `/yawn.png`).
- **iPad / touch:** no hover-only affordances; tap targets ≥ 44px; the card is
  `max-h-[90vh] overflow-y-auto` so it never clips on shorter landscape iPad
  viewports; width `min(92vw, ~34rem)`; the name input has
  `enterKeyHint="done"`, `autoCapitalize="words"`, `autoCorrect/off`,
  `spellCheck=false` (mirror the existing `EditableName` input attributes).
- **A11y:** `role="dialog"`, `aria-modal="true"`, `aria-labelledby` on the
  heading, Escape closes (= "maybe later"), focus moves to the input on open and
  is trapped within the dialog, backdrop click closes. Respect
  `prefers-reduced-motion` (snap instead of animate), matching the app guardrail.

---

## Feature B — Returning-learner recall check

### The question bank (new content)
New file `src/content/interview-questions.ts`:

```ts
export interface InterviewQuestion {
  id: string                                   // stable, e.g. "iq-1.4-const-reassign"
  lessonId: string                             // the lesson that equips you to answer; eligibility = this lesson completed
  type: 'oral' | 'coding'                       // explain-aloud vs read/write code
  difficulty: 'straightforward' | 'tricky'
  prompt: string                                // the interviewer's question
  code?: string                                 // optional snippet shown with the prompt (coding qs; \n line breaks, one source line)
  answer: ReactNode | string                    // the model answer, revealed after the learner has thought
}

export const INTERVIEW_QUESTIONS: InterviewQuestion[]
```

- **Keyed to `lessonId`** so a question becomes eligible only once that lesson is
  marked complete. Multiple questions per lesson are allowed and expected.
- **Coverage authored now:** every lesson in **phases 1, 2, 3** (~29 lessons),
  aiming ~2 questions each with a deliberate spread of `type` and `difficulty`
  (some oral, some coding; some straightforward, some tricky). Phase 0 excluded.
- Even coding questions are **not auto-checked** — the learner reads the prompt,
  thinks, reveals `answer`, and self-rates. `answer` for a coding question shows
  the worked solution / expected output.

### Trigger & the 8-hour gate
- Fires on **opening any lesson page**. In `LessonShell` (or a small wrapper in
  `LessonPage`) on mount:
  - Compute `eligible` = questions whose `lessonId` is in `completedLessons` and
    whose lesson is phase ≥ 1.
  - If `eligible.length === 0` → never show (brand-new learners, phase-0-only
    completions).
  - If `now − lastRecallShownAt < 8h` → never show this session.
  - Otherwise → show the recall overlay, and **immediately stamp
    `lastRecallShownAt = now`** (so skipping still resets the 8h clock — no
    nagging on refresh, exactly as the user asked).

### Selection
- From `eligible`, pick **up to 3** questions, ordered by **least-recently-asked**
  (a question never rated sorts first; then oldest `ratedAt`), with light
  tie-breaking to vary `type`/`difficulty` across the set. Deterministic given
  the stored state so a back/forward within the overlay is stable.

### Flow (per question)
`prompt` (+ `code` if present) shown → **[reveal answer]** button → `answer`
appears → **"How confident are you?"** three self-rate buttons:
🙁 not yet · 😐 getting there · 🙂 solid. Rating advances to the next question.
After the last: a short "nice — back to your lesson" close. **Skippable at any
point** ("skip for now"); skipping still counts as shown (clock already stamped).

### Storage (progress store additions)
Extend `src/store/progress.ts` (`ProgressState`, persisted under `jfb-progress`):

```ts
recall: Record<string, { confidence: 'low' | 'ok' | 'solid'; ratedAt: string }> // keyed by question id
lastRecallShownAt: string | null
rateRecall: (questionId: string, confidence: 'low' | 'ok' | 'solid') => void
markRecallShown: () => void   // sets lastRecallShownAt = new Date().toISOString()
```

Adding fields to the persisted store is backward-safe (zustand `persist` merges;
missing keys fall back to the initializer defaults) — no migration needed.

### Visual & responsive
- Same overlay skin/pattern as the welcome modal and BreakCoach (`fixed inset-0
  z-50`, ink backdrop, `motion`, paper surface). A little "🎤 quick recall"
  header, a 1-of-3 progress dot row, and the reveal/rating controls as
  `InkButton`s. `code` renders in the existing `CodePane` component.
- Same iPad/touch and a11y rules as Feature A (scrollable card, ≥44px targets,
  dialog semantics, Escape = skip, reduced-motion aware).

---

## Content rules (both features' copy + all question/answer text)
The app has a strict content contract — this content obeys it:
- Simplest English in the app; one idea per sentence; plain international English.
- **No em dashes**; **no idioms** (see `feedback-uth-style-contract`).
- Curly apostrophes (`'`) inside any JS string literal (straight `'` breaks the
  string and has bitten this codebase repeatedly).
- Only vocabulary already taught by the referenced lesson may appear unglossed in
  a question — a recall question must be answerable from what the learner covered.

## Files touched (anticipated — the plan will pin exact anchors)
- **New:** `src/content/interview-questions.ts` (bank + type), phases 1–3 content.
- **New:** `src/design/WelcomeModal.tsx` (Feature A).
- **New:** `src/engine/lesson/RecallCheck.tsx` (Feature B overlay).
- **Edit:** `src/store/progress.ts` (recall fields + actions).
- **Edit:** `src/app/Layout.tsx` (mount `WelcomeModal`, self-gated to home).
- **Edit:** `src/engine/lesson/LessonShell.tsx` **or** `src/app/LessonPage.tsx`
  (mount `RecallCheck`, self-gated by 8h + eligibility).
- Possibly a small "who drew this? ✏️" re-open affordance on `CurriculumMap.tsx`.

## Verification
- `npm run build` green.
- Manual (the user verifies in-browser, incl. **iPad**):
  - Fresh state (clear `jfb-learner-name` + `jfb-welcome-seen`) → welcome modal
    appears over home; entering a name closes it, redirects to
    `/<name>-journey`, and it does not reappear on refresh.
  - "maybe later" closes and does not reappear; the re-open affordance works.
  - With ≥1 completed phase-1+ lesson, opening a lesson shows the recall check;
    reopening within 8h does **not**; after 8h it does again.
  - Phase-0-only / nothing-completed learners never see the recall check.
  - Confidence ratings persist across reloads; least-recently-asked ordering
    holds.
  - iPad (or narrow + touch emulation): both overlays scroll, never clip, and
    every control is tappable.
- `node scripts/lint-uth.mjs` clean if the linter covers the new content files
  (confirm scope in the plan).

## Open follow-ups (out of scope now)
- Authoring phases 4–11 question banks (future sessions).
- A "confidence board" that surfaces the stored `recall` self-ratings back to the
  learner over time (nice future addition; not built now).
