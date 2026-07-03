# Lesson format variety — design

## Problem

Every lesson so far (Phase 0–3.5) is built on the same fixed ritual: Hook → stepper-driven viz with one prediction gate → Under the Hood → 3 multiple-choice quiz questions → teach-back → recap. The visualizations themselves differ (`FunctionMachine`, `ScopeLens`, `CoercionMachine`, etc.), but the *interaction rhythm* around them never changes. Over a long journey (11 phases), identical rhythm breeds fatigue even when the content is good.

This was flagged once before (see memory `feedback-lesson-variety`, after Phase 2) with a chosen menu of formats, but it was never implemented — lesson 3.5 (Scope), built after that decision, still uses the classic format, and the `LessonDef`/`LessonShell` types don't have the fields that decision assumed existed.

This spec covers: confirming the format menu, mapping it across the remaining Phase 3 lessons, and fully specifying the first pilot (3.1) that will actually get built and judged.

## Non-negotiables carried forward

- Visualization stays the star in every format — no format replaces the visual payoff with text. Formats vary the *entry point*, not whether a lesson is visual.
- Under the Hood stays simple-but-technically-accurate (real terminology, ~250 words, per `feedback-compact-under-the-hood`).
- No new colors, fonts, or visual primitives — every format reuses existing `design/` components (`PaperCard`, `StickyNote`, `TapeLabel`, `InkButton`, `CodePane`, `HighlightMark`) and the existing 4 marker color tokens (`--color-marker-yellow`, `--color-marker-coral`, `--color-marker-teal`, `--color-pencil-blue`).
- Verify-in-browser-before-marking-done still applies (existing working agreement).

## Format menu (confirmed, reused from the earlier decision)

1. **Fix-the-bug** — open on broken code; the learner debugs before the concept is formally explained.
2. **Detective case file** — mystery framing (evidence → verdict) over the same stepper mechanics; section labels change tone.
3. **Playground-first** — an interactive widget appears before any explanation; the learner free-plays and forms a theory, then the hook/stepper names and formalizes what they just did.
4. **Direct-manipulation viz** — the click-through stepper is replaced by an always-interactive visualization (hover/drag) at the learner's own pace.
5. **Varied check formats** — quiz questions aren't always multiple-choice (e.g. type-the-output, click-the-buggy-line).

Classic stepper remains valid where a concept is genuinely sequential (e.g. call stack push/pop).

## Rollout approach: pilot one lesson, then decide

Rather than committing to rewrite all of Phase 3 up front, or speculatively building engine support for all 5 formats:

- **3.1 is the pilot.** Build it complete and full-quality (all 6 anatomy parts, matching the bar of Phase 0–2), using the **playground-first** format.
- The engine (`LessonDef`/`LessonShell`) gets extended with only the minimum new capability the pilot needs — not all formats' plumbing up front.
- The pre-existing `lesson31.tsx` content is preserved as `lesson31.old.tsx` alongside the new file, so the old version can be restored instantly if the new format teaches worse. Once the user confirms a direction, the unused version is deleted.
- After the user verifies 3.1 in the browser and compares it against how Phase 0–2 lessons felt, they decide: (a) keep it and continue converting 3.2–3.11 per the mapping below, (b) adjust the format choice, or (c) revert to the classic format entirely.
- Each subsequent format (fix-the-bug, detective case file, direct-manipulation, varied checks) gets its own engine work and pilot lesson when its turn comes — not built speculatively now.
- The Phase 5 shift (below) follows the same pilot-then-decide treatment when Phase 5 is reached (M3 on the progress board) — it is not being built now.

## Phase 3 format mapping (plan, not commitment — revisit after 3.1)

| Lesson | Concept | Format | Rationale |
|---|---|---|---|
| 3.1 | What is a function? | **Playground-first** (pilot, built now) | Introduces the machine metaphor for the first time — nothing to explain yet, so let the learner discover it hands-on before naming it. |
| 3.2 | Params vs arguments | Direct-manipulation | Dragging values into labeled slots is naturally manipulable rather than step-revealed. |
| 3.3 | `return` | Fix-the-bug | The classic return-vs-console.log confusion is naturally a "why didn't this print?" bug to debug. |
| 3.4 | Function expressions/arrows | Classic stepper | Genuinely sequential: slot appears → value drops in → call happens. |
| 3.5 | Scope | Detective case file | The "lookup ray" mechanic already reads like a mystery/investigation. |
| 3.6 | Call stack | Classic stepper | Inherently step-by-step: frames push and pop. |
| 3.7 | Closures | Detective case file | Billed in-app as "the most magical thing in JS" — earns mystery treatment. |
| 3.8 | HOFs & callbacks | Playground-first | Poking at passing functions around before formalizing suits discovery. |
| 3.9 | Recursion | Classic stepper | Stack building/unwinding is sequential by nature. |
| 3.10 | Defaults/rest/pure functions | Fix-the-bug | An impure-function bug is a natural, concrete hook. |
| 3.11 | Checkpoint: tip calculator | Playground-first | Matches the build-and-verify style already used in checkpoints 1.11/2.8. |

3.1–3.5 are all reworked (not just 3.6 onward), since the user wants full-phase consistency rather than a format split partway through.

## 3.1 pilot — concrete design

**Engine change** (additive, backward-compatible — every other lesson keeps working untouched):

- New optional `LessonDef` field: `playground?: { prompt: ReactNode; Widget: ComponentType }`.
- `LessonShell.tsx`: when `def.playground` is present, render a new section between the title header and the hook, using the existing `TapeLabel` + `PaperCard` components. Label: **"try it first"**, colored with the existing `--color-marker-yellow` token (already used for "your turn" — thematically this is an early hands-on moment; no new color introduced).
- Nothing else in `LessonShell` changes. `Viz`, `CodePane`, `StepperControls`, `PredictionCard`, `QuizCard`, teach-back, recap, done-button, and phase nav are all reused exactly as they are today.

**Content change for 3.1 itself:**

- A new interactive `Widget` component shows a hand-drawn `FunctionMachine`-style hopper with a row of clickable value chips (reusing the `InkButton` pattern already used for quiz options). Clicking a chip feeds it into the hopper and an output appears on the other side, freely, before any text explains what a function is. Clicking (not drag-and-drop) keeps this touch-friendly and consistent with existing interaction patterns in the app.
- The `hook` copy is rewritten to *name* what the learner just did ("You just dropped a value into that machine and watched something come out the other side — that's a function") instead of motivating the concept before any code, since the learner already has hands-on context.
- The existing stepper/viz section, Under the Hood, quiz, teach-back, and recap are all still written and still fully formalize the mechanism precisely as before — the playground only changes what comes *first*, not what the lesson ultimately teaches.
- Full quality bar: this is not a stripped-down proof of concept — it must be as complete and well-crafted as the Phase 0–2 lessons it's being compared against.

## Verification

- Build 3.1 fully, run `npm run dev`, and view it in the browser end to end (playground → hook → viz stepper → under the hood → quiz → teach-back → recap) at desktop and ~1280px widths, per the existing lesson-authoring checklist in `04-LESSON-BLUEPRINT.md`.
- User compares it against the feel of Phase 0–2 lessons and makes the keep/adjust/revert call described above.

## Out of scope for this spec

- Engine support for fix-the-bug, detective case file, direct-manipulation, or varied quiz-check formats — designed and piloted individually when their lesson comes up.
- Any changes to lessons 3.6–3.11 content (only the format mapping/plan is recorded here).
- Any Phase 5 implementation work.
