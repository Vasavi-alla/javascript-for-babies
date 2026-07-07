# "🎤 In an interview" section — design

**Date:** 2026-07-07
**Status:** approved design, spec under user review
**Author:** brainstormed with Lijas

## Problem

Many concepts from Phase 3 on are the ones interviewers actually ask about:
closures, `this`, the event loop, prototypes, promises, and so on. The learner's
goal (3) is "understand well enough to teach anyone" — and the sharpest test of
real understanding is answering a technical interviewer *simply but correctly*.

The course already has two adjacent sections, and neither does this job:

- **Teach it back** — "explain X to a friend who has *never coded*." Deliberately
  jargon-free and casual. Proves you can simplify; does *not* prove you own the
  vocabulary.
- **On the job** — a hand-drawn work moment. Bound by the strictest "simplest
  English, gloss or cut all jargon" rules in the app. Shows a scenario; does not
  coach an answer.

Missing is the third register: **a technical interviewer asks, and you give the
crisp, correct-terminology answer that proves you truly understand.** Technical,
but said simply.

## Solution overview

A new, optional lesson section — **`🎤 In an interview`** — added to the curated
set of interview-relevant lessons. It renders between **On the job** and **Teach
it back**, so the reading flow is:

> here's the technically-precise answer for an interviewer → now put it in your
> own words for a total beginner.

Each card has three bands: **Say this** → **If they dig deeper** → **Don't say**.

### The lesson anatomy, updated

```
Hook
Watch it happen
Under the hood
Your turn (quiz)
🎤 In an interview     (optional, NEW)
💼 On the job          (optional, existing)
Teach it back
Recap
```

## Data model

A new optional field on `LessonDef` (`src/engine/lesson/types.ts`):

```ts
/**
 * Optional "🎤 in an interview" section (rendered after On-the-job, before
 * teach-back): the technically-precise spoken answer a real interviewer wants.
 * This is the ONE section that uses real terminology unglossed — that is the
 * point. Content rules: see 04-LESSON-BLUEPRINT.md ("In-an-interview contract").
 * `question` + `say` are required; `deeper` and `dontSay` render only when set.
 */
interview?: {
  /** What the interviewer asks, in their words. e.g. "What's a closure?" */
  question: string
  /** The COMPLETE spoken answer: headline + the substance you volunteer right after. */
  say: ReactNode
  /** A real code example to talk through (NOT a toy). code is a JS string with \n breaks. */
  example?: { code: string; note?: string }
  /** Only the genuinely harder follow-up they push for. Cite the lesson each term was taught. */
  deeper?: ReactNode
  /** The common shallow/wrong answer, and why it is shallow. */
  dontSay?: { wrong: string; why: string }
}
```

**Two revisions after building the calibration card (2026-07-07):**

1. **`say` is a full answer, not a one-liner.** In a real interview you give the
   headline sentence and then keep talking to show substance, without waiting to
   be prompted. So `say` is the headline plus the 1–2 sentences you volunteer
   right after (~20–30 seconds). `deeper` is reserved for the genuinely *harder*
   probe that comes after your full answer.
2. **`example` added — a real artifact, not a toy.** A `makeCounter` is what every
   interviewer has heard a hundred times. Each card carries a concrete, real-ish
   snippet the candidate talks through (a discount factory, a `retry` wrapper, a
   block-scope leak), rendered under a "Show this on paper" band. `code` is a JS
   string with `\n` breaks, kept on one source line so the lint extractor stays
   robust; `note` is an optional one-line caption. Only vocabulary taught at the
   lesson's position may appear in the code.

Only `question` + `say` are required. `deeper` and `dontSay` render only when
present — not every concept has a classic trap, and a lean two-band card is fine.

## Component

New file `src/design/InterviewCard.tsx`, sketchbook skin consistent with
`JobScene.tsx` (wobbly border radii, ink token with fallback). It renders the
three bands:

- **question** — the interviewer's line, styled as a mic'd question (🎤).
- **Say this** — the headline answer band.
- **If they dig deeper** — the escalation band (only if `deeper` set).
- **⚠ Don't say** — the trap band: the wrong answer struck/quoted, then the
  one-line "why it's shallow" (only if `dontSay` set).

No new engine logic beyond the field and the card.

## Rendering

`src/engine/lesson/LessonShell.tsx` gains one section block, placed **between the
On-the-job block (ends line ~116) and the Teach-back block (begins line ~118)**:

```tsx
{def.interview && (
  <section>
    <TapeLabel id={`interview-${def.id}`} color="var(--color-marker-coral)">
      🎤 in an interview
    </TapeLabel>
    <PaperCard id={`interview-card-${def.id}`} tilt={false} className="mt-3 max-w-3xl">
      <InterviewCard {...def.interview} />
    </PaperCard>
  </section>
)}
```

Tape color is `--color-marker-coral`, keeping the three trailing sections
distinct: On-the-job (yellow) · In-an-interview (coral) · Teach-back (teal).

## Content contract (the important nuance)

This section deliberately **breaks the rule that governs every other prose block.**
Captions, Under-the-hood, and On-the-job must gloss or avoid jargon. The interview
section is the one place that uses the bare real terms **on purpose** — because
demonstrating you own the vocabulary is the entire point.

Rules for authoring an `interview` block:

1. **Real terms, unglossed, are required** in `say`/`deeper`. "The scope stays
   alive on the heap," "the microtask queue drains before the next macrotask."
   That precision is what proves understanding.
2. **Technical but simple** = precise words in plain sentence structure. Short
   sentences, one idea each, no waffle. Not dumbed-down words in tangled
   sentences.
3. **Every term must already be taught** earlier in the course. Cite the lesson
   on first heavy use in `deeper` (e.g. "the heap (4.6)"). The interview answer
   is a *payoff*, never where a concept is introduced.
4. **No em dashes** in the spoken bands (consistency with On-the-job's spoken
   register); keep sentences short.
5. **`dontSay.wrong`** is a real shallow answer a nervous candidate gives;
   `dontSay.why` is one line on what it confuses (usually "where it lives" vs
   "what it does", mechanism vs syntax).

### Linting

The interview block is **excluded from `lint-uth.mjs`'s JARGON check** (rule 3) —
its whole job is unglossed real terms. It **still gets** the sentence-length
(≤28 words) and idiom-blocklist checks. Implementation: add an `extractInterview`
pass in `scripts/lint-uth.mjs` mirroring `extractJob`, run the sentence/idiom
rules over it, and skip the JARGON pass for this section only.

## Scope — curated lessons

Only lessons a real JS / automation interviewer would probe. Candidate set
(~32 lessons); final inclusion confirmed per-lesson during authoring:

**Back-ports (below the Phase-3 floor, user-approved):**
- 1.9 — `==` vs `===` and coercion
- 1.4 — `var` vs `let` vs `const` (scope + TDZ tie-in)

**Phase 3:** 3.5 scope & lookup · 3.6 call stack · **3.7 closures** ·
higher-order functions · 3.9 recursion
**Phase 4:** 4.6 value vs reference · 4.5 copying & equality (`{} !== {}`) ·
4.7 map/filter/reduce
**Phase 5:** 5.1 hoisting & TDZ · **5.4 `this` binding** · **5.5 prototypes** ·
5.6 classes desugared
**Phase 6:** 6.1 blocking vs non-blocking · **6.2 the event loop** ·
**6.4 promises** · 6.5 micro/macrotask order · 6.6 async/await
**Phase 7:** 7.1 DOM · 7.2 selectors → locators · 7.4 event delegation ·
7.8 why elements "aren't ready yet"
**Phase 8/9:** 8.4 `?.` / `??` · 9.3 CJS vs ESM · 9.6 Node's event loop (libuv)
**Phase 10:** 10.2 the testing pyramid · 10.4 `toBe` vs `toEqual` ·
10.6 test doubles & TDD
**Phase 11:** 11.6 auto-waiting · 11.9 the Page Object Model ·
11.10 network interception · 11.15 flakiness

## Rollout

Pure content feature. Engine work is one-time (field + card + LessonShell block +
lint pass). Then author `interview` blocks phase by phase (1.4/1.9 back-ports,
then 3 → 11), each against the contract above. Verify as elsewhere: `npm run
build` green, `node scripts/lint-uth.mjs` clean, browser spot-check a sample
(closures 3.7, `this` 5.4, event loop 6.2 are the richest).

No commits without the user's explicit word (standing project rule).

## Out of scope (YAGNI)

- No interactive "write-yours-then-reveal" textarea — that would duplicate
  Teach-back's interaction two sections apart.
- No code-ladder / follow-up chain / "senior signal" band — the lean three-band
  card was chosen over both richer variants.
- No recall-deck cards generated from interview answers (could revisit in M8).

## Blueprint & memory updates

- Add an **"In-an-interview contract"** subsection to
  `docs/plan/04-LESSON-BLUEPRINT.md` (the rules above), and add the section to
  the lesson-anatomy list.
- The three trailing sections now have clear, distinct jobs:
  On-the-job (show a work moment, simplest English) ·
  In-an-interview (technical answer, real terms) ·
  Teach-back (explain to a non-coder).
