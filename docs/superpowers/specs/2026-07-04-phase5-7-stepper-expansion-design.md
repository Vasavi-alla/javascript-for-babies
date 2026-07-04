# Phase 5-7 "watch it happen" expansion — design

## Problem

The user (a true beginner, learning JS for the first time) reviewed the newly-built Phase 5
(Under the Hood), Phase 6 (Time & Async), and Phase 7 (DOM) lessons and felt the "watch it
happen" stepper was paced for someone who already knows JS, not someone meeting the concept
for the first time.

A full-repo survey (all 9 Phase 5 lessons, all 9 Phase 6 lessons, all 4 built Phase 7 lessons —
22 lessons total) confirmed this quantitatively:

- **Every single lesson sits at 5-6 steps.** Not one goes above 6, even though
  `04-LESSON-BLUEPRINT.md` specifies a 5-12 step range and "one thing happens, one short
  caption explains it" per step. These lessons cluster at the floor of the range.
- **Captions routinely bundle 2-3 distinct facts into one step.** Example (6.2, "handoff"
  step): registering the callback, where it goes, AND what does *not* happen, all in one
  caption with one animation beat. Final steps of a lesson are the worst offenders (6.1, 6.2,
  6.3, 6.5, 6.8, 6.9 all pack a main point plus 1-2 bonus asides into their last step).
- **Metaphor consistency gap.** 14 of the 22 lessons already follow the project's own
  Phase-4+ rule (real term leads, metaphor is an occasional callback — e.g. 5.1, 5.2, 5.5,
  5.6, 5.9, 6.2, 6.3, 6.5, 6.7, 6.9, and all of Phase 7). The other 8 (5.3 rope, 5.4 compass,
  5.7 janitor/broom, 5.8 spark/net, 6.1 restaurant/hostage, 6.4 receipt/kitchen, 6.6
  shelf/bookmark, 6.8 kitchen-lanes) keep their metaphor as the *sustained* primary narrator
  for the whole lesson instead of bridging the first mention and then handing off to the real
  term. That inconsistency — not missing metaphor — is what read as "off."
- **Two genuine bugs**, unrelated to pacing, found in the process:
  - 5.4 ("this"): the checklist step names `apply` in "bind/call/apply" but never explains it
    anywhere in the lesson (bind and call each get a one-line gloss; apply doesn't).
  - 7.1 (DOM tree): step 2 says "every lookup, every edit, every **listener** starts here" —
    listeners aren't taught until 7.4, three lessons later. A real forward-reference to an
    undefined term.
  - 6.3 underTheHood has a corrupted/stray character ("fine and永remains") — encoding
    artifact.

## Fix pattern

Two rules, applied together, per lesson:

### 1. Step-splitting

Any step whose caption contains more than one distinct fact, event, or aside gets split into
separate steps — one visual beat, one fact, per step. Target counts:

- Flagship (🎬) lessons: ~9-12 steps (top of the blueprint's range — these are the hardest,
  highest-payoff concepts: this, prototypes, event loop, promises, fetch, DOM tree, selectors,
  events).
- Regular lessons: ~7-9 steps.

Each new step needs its own entry in that lesson's `VIEWS` array (the `Viz` component stays a
pure function of `stepIndex` — no exceptions). Splitting sometimes means a genuinely new visual
state (e.g. showing the queue receive an item as its own beat, separate from the rule firing),
not just chopping the caption text in place.

Where a lesson's final step currently bundles a main point + asides (the pattern flagged
above), the asides become their own trailing steps instead of parentheticals.

### 2. Metaphor bridge-then-fade (in-lesson, not just cross-phase)

For the 8 lessons where metaphor is currently the sustained narrator: the *first* step that
introduces the lesson's hardest term keeps one clause of the metaphor as a bridge, but the
real term stays the label. Every step after that — in the same lesson — uses the real term
alone; the metaphor may return once, briefly, as a closing callback (e.g. in the recap), never
as the ongoing explanatory device. This mirrors the existing cross-phase weaning schedule
(0-1 metaphor-first → 4+ real-terms-only) at lesson-grain: bridge once, then let it go.

Concretely for 5.7 (GC): keep "the garbage collector — think of it like a janitor sweeping
unreachable islands" at first mention, then every subsequent step says "reachable" /
"unreachable" / "the garbage collector" without re-invoking janitor/broom/islands as the
explanation itself.

The 14 already-compliant lessons are not touched for this rule — only split for pacing.

### Scope per lesson (touching "everything," per user's answer)

- **Steps**: full structural rework per the two rules above. This is where almost all the
  work lives.
- **Hook**: light touch only — trim/simplify if it assumes a term the steps haven't bridged
  yet. Most hooks read well already (they're the sampled evidence's strongest section).
  No hook gets *the same* pattern.
- **underTheHood**: stays inside the standing budget (3 short paragraphs, ~250 words). Fix
  the 6.3 encoding artifact. Otherwise touch only if a sentence assumes a term the reworked
  steps no longer establish at that point.
- **Quiz**: keep the typed-check format (standing rule). Reword only if a question currently
  leans on a term that was only ever explained via a now-removed sustained metaphor.
- **Exercises / teachBack / recap**: untouched, unless a recap line references a metaphor
  word that no longer appears in the reworked steps.

### Drive-by bug fixes (independent of the pacing/metaphor work, done regardless)

1. 5.4: add a short gloss for `apply` where it's first named (e.g. "apply — same idea as
   bind, but takes the arguments as an array"), or fold it into the existing `bind`/`call`
   explanation so it's no longer a bare name-drop.
2. 7.1: reword step 2 to drop the premature "listener" reference (e.g. "Every lookup and
   edit starts by walking or searching from here") — nothing here requires the word.
3. 6.3: fix the corrupted character in underTheHood.

## Pilot

Two lessons, chosen to cover both fix types:

- **5.4 ("this")** — flagship, sustained-metaphor lesson (compass/needle), has the `apply`
  gap. Validates step-splitting + metaphor-fade + bug fix together.
- **6.2 (event loop)** — flagship, already technical-primary. Validates step-splitting alone
  (the simpler case), confirming the pattern doesn't need the metaphor-fade treatment
  everywhere.

After the user verifies both in the browser (`npm run dev`), the identical pattern rolls out
to the remaining 20 lessons (5.1, 5.2, 5.3, 5.5, 5.6, 5.7, 5.8, 5.9, 6.1, 6.3, 6.4, 6.5, 6.6,
6.7, 6.8, 6.9, 7.1, 7.2, 7.3, 7.4). Step-splitting applies to all 20. The metaphor-fade rule
applies only to the 7 of those still in the "sustained metaphor" bucket: 5.3, 5.7, 5.8, 6.1,
6.4, 6.6, 6.8.

## Verification

- `npm run build` (TypeScript) must stay green after each lesson edit — `Viz` components are
  hand-written SVG/motion code, easy to introduce a type mismatch when adding VIEWS entries.
- No automated test suite exists for lesson content; correctness is manual. Each edited lesson
  gets a pass checking: every step highlights the right code lines, every VIEWS entry the
  step needs actually exists, and the quiz/teachBack/recap still make sense against the new
  step sequence.
- The user verifies each lesson in the browser before it's considered done (standing working
  agreement in `05-PROGRESS.md`).
- `05-PROGRESS.md` gets updated with the session's work once the pilot (and later the full
  rollout) is verified.

## Out of scope

- Phase 7 lessons 7.5-7.9 (not yet built) — unaffected by this work.
- Any other phase (0-4, 8-10) — not part of this request.
- Adding new exercises, quiz questions, or teach-back prompts.
- Engine/component changes to the stepper itself (no code changes needed there — `Step` has
  no count limit and `StepperControls`'s dot row has no hard cap).
