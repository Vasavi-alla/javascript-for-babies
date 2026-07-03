# Mission format for Phases 3–4 — design (supersedes 2026-07-03-lesson-format-variety-design.md)

## Problem & verdict on the previous attempt

Every lesson from Phase 0 through 3.5 runs the identical ritual (hook → stepper → under the hood → 3 MCQs → teach-back → recap), which the user finds boring over a long journey. The previous spec's fix — keep the skeleton, vary the entry point — was piloted as a "playground-first" 3.1 and **rejected by the user** ("just a try-it-first section, no other change, same as the others"). The user also flagged that Phase 3's copy drifted from the warm, plain-words Phase 0–2 voice.

**Decision (user-approved 2026-07-03):** Phases 3–4 are rebuilt in a *mission format* — a story identity per phase plus do-first challenge lessons. Phases 0–2 stay exactly as they are (the pace change itself is part of the hook: "you've graduated from the classroom"). Phase 5+ gets its own decision when reached.

## Non-negotiables carried forward

- Predict-before-reveal gates stay; visualization + real under-the-hood depth stay (~250 words, per feedback-compact-under-the-hood); teach-back closes every lesson; fun facts only when story-worthy.
- All copy in the warm zero-knowledge Phase 0–2 voice — the tone fix rides along with the rewrite.
- No new colors/fonts/primitives: everything composes existing `design/` components and the 4 marker color tokens.
- The code pane never leaves: every manipulation in the viz updates real JS beside it. Syntax stays the label on the mechanism.

## Experience design

**Phase 3 = The Machine Shop.** The learner is hired as an apprentice; every lesson is a customer **work order**. Story lives in small sketchbook framing devices (paper work-order card, "SHIPPED ✓" stamp, a shop shelf) — no dialogue trees or cutscenes.

**Work-order anatomy** (replaces the classic anatomy for mission lessons):
1. **Work order card** — the customer's complaint in plain words; this is the hook, framed as a problem to solve.
2. **The job** — 2–4 micro-challenges on a live viz. The learner acts first; explanation arrives as feedback on what they did (fail-then-learn beats). Prediction gates woven in. Every challenge has an "I'm stuck — show me" escape.
3. **Ship it** — stamp + the built machine joins the **Shop Shelf** (a strip on the phase page fed by the progress store). 3.11's tip calculator is assembled from shelf machines — the cumulative pull.
4. **Shop notes** (= Under the Hood, unchanged depth) → **Final inspection** (short check, varied formats: type-the-output, click-the-buggy-line — not always MCQ) → **Train the next apprentice** (= teach-back) → sticky-note recap.

**Anti-samey safeguard:** work orders come in different **job types**, deliberately alternated, so the rhythm never repeats twice. If every mission had the same challenge→feedback→ship loop we'd recreate the boredom one level up.

| Lesson | Work order | Job type |
|---|---|---|
| 3.1 | "You're hired." First commission: greeting machine for a customer typing the same sentence 100×/day. Built — and nothing happens (define ≠ run); discover the GO button. | Build |
| 3.2 | Two-slot translation machine; values dropped in the wrong order → wrong output teaches positional matching; fresh slots per call. | Build |
| 3.3 | "My machine SHOWS the answer but won't HAND it to my next machine" — swap the console.log part for a return part. | Repair |
| 3.4 | Inventory day: machines stored in labeled boxes like any value; arrows as the compact stamp. | Stocktake |
| 3.5 | "My machine can't find its parts" — rooms & toolboxes; ScopeLens lookup ray survives inside. | Repair |
| 3.6 | Rush hour: orders piling on the spike (LIFO). Classic stepper survives here — push/pop is truly sequential. | Rush hour |
| 3.7 | "The machine that remembers": a counter that keeps counting after leaving the shop (ClosureBackpack). | Mystery |
| 3.8 | A machine with a slot that accepts another machine (HOFs/callbacks). | Build |
| 3.9 | The machine that orders from itself; CallStackTower builds and unwinds. | Rush hour |
| 3.10 | Quality control: sealed pure machines vs ones leaking pipes outside; defaults/rest. | Inspection |
| 3.11 | The big commission: tip calculator assembled from the learner's shelf. | Delivery |

**Phase 4 = The Warehouse** (promotion after Phase 3). The planned vizzes already fit: ArrayShelf = numbered shelf rows, ObjectLocker = labeled bins, PipelineBelt = the sorting conveyor. Highlights: 4.2 shift/unshift as a direct-manipulation "everything slides" job; 4.4 references as the flagship **mystery** ("someone changed my crate and I never touched it!" — two delivery slips, one crate); 4.7 map/filter/reduce on the sorting line; checkpoint = **the warehouse audit** (test-results dashboard, first taste of the QA job). Full per-lesson mapping is decided lesson-by-lesson during conversion, alternating job types as in Phase 3.

## Engine design (all additive; Phases 0–2 untouched)

- **`MissionDef` + `MissionShell`** — a sibling of `LessonDef`/`LessonShell`, not a bolt-on field. The lesson registry maps each id to one or the other; both formats coexist.
- **Challenge sequencer:** a mission holds an ordered list of challenges; the shell renders the work-order card, then challenges one at a time ("job step 2 of 4"). Contract: each challenge is an interactive component that calls `onComplete()` when the job is done. Fail-then-learn beats live *inside* the challenge component (shared why-card component for consistency), so each job can have its own rhythm.
- **Per-phase theme config** (vocabulary only): Phase 3 "shop notes"/"SHIPPED ✓"; Phase 4 "warehouse manual"/audit language. Same shell, different words.
- **Shop Shelf component** on the phase page, fed by the existing progress store.
- **New sketchbook components** (work-order card, why-card, stamp, stuck-reveal, challenge progress dots) composed from existing primitives.
- **Varied final-check kinds** built only as lessons need them, never speculatively.

## Rollout: two-lesson pilot, then convert

The single-lesson pilot failed partly because one lesson can't show the rhythm *changing*. Pilot = **3.1 (Build) + 3.3 (Repair)**, both full quality, end to end. The user runs both in the browser and gives the verdict. If it lands: convert 3.2/3.4/3.5, build 3.6–3.11, then Phase 4 as the Warehouse.

**Cleanup (during pilot implementation):** delete `lesson31.old.tsx`; remove the `playground` field from `LessonDef`/`LessonShell` (superseded; git history keeps it). The old spec file is deleted — this document replaces it.

## Verification

Build the pilot, `npm run dev`, walk both missions end to end (work order → challenges → ship → shop notes → final inspection → teach-back → recap) at desktop and ~1280px. Then the user runs it themselves (standing preference) and makes the keep/adjust/revert call.

## Out of scope

Phase 5+ format decisions; Phase 4 implementation (mapped only); speculative engine work for check kinds or job types no pilot lesson uses.
