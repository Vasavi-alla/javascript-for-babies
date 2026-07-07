# 04 — Lesson Blueprint & Visualization Catalog

## Anatomy of every lesson (the 6 parts, in order)

1. **Hook** (2–3 sentences). Why this concept exists — the problem it solves. Never start with syntax.
   > *"Your program calculated the perfect tip. Then the line ended — and the machine forgot it instantly. You need a way to make it remember."* → variables.

2. **Visualize** (the core, 5–12 steps). Code pane + visualization pane, driven by the Stepper. Each step: one line of code highlights, one thing happens in the picture, one short caption explains it. At the pivotal step, a **prediction gate** (pink sticky): "Before you press next — what will `console.log(b)` show?" The learner answers, *then* the reveal plays, then a "why" note appears (whether they were right or wrong).

3. **Under the Hood** (collapsible prose, but not optional in spirit). The accurate, deeper explanation: correct terminology (allocation, binding, coercion, execution context), what the simplification above hid, links to related lessons. This section is why the app never becomes "pretty but shallow."

4. **Play** (1–3 micro-exercises). Interact with the visualization directly: drag a value into a slot, write a selector that lights up the right node, fix a broken snippet, or a 3-question quiz where each answer is *replayed* in the viz rather than just marked right/wrong.

5. **Teach-back** (the mastery gate). "Explain X to a friend who has never coded" — a textarea, saved to the journal. After submitting, a model answer appears for self-comparison, plus the 1–2 analogies the lesson used. This builds the user's own teaching material over time.

6. **Recap** (auto-generated). 2–4 recall cards added to the spaced-recall deck (e.g., "Sketch what memory looks like after `let a = {x:1}; let b = a;`"). Shows which future lessons build on this one.

> Two **optional curated sections** render between the checks and Teach-back, in this order: **🎤 In an interview** then **💼 On the job** (both dated subsections below). They appear only on lessons where they earn their place, not on every lesson.

### Authoring quality checklist (every lesson must pass)
- [ ] One mental model only — anything extra split into its own lesson
- [ ] At least one prediction gate at the point of highest surprise
- [ ] The gotcha (if the topic has one) is celebrated, not buried
- [ ] Under the Hood names the real terminology an interviewer would use
- [ ] Viz is a pure function of step index (scrub back/forward works)
- [ ] Teach-back prompt written; model answer written
- [ ] Verified in the browser at desktop AND ~1280px laptop width

---

## Visualization component catalog
Reusable components in `src/viz/`. Built once, reused across lessons — consistency **is** pedagogy: when the learner sees the same CallStackTower in Phase 3, Phase 6, and Phase 10, the knowledge compounds.

| Component | Teaches | First used | Reused in |
|---|---|---|---|
| `InstructionTape` | Programs = sequential instructions | 0.1 | 2.x loops |
| `EngineDiagram` | Browser/engine/Node architecture | 0.2 | 8.3, 10.1 |
| `ConsolePane` | console.log output | 0.3 | everywhere |
| `MemoryWall` / `MemoryDiagram` 🎬 | Slots, values, bindings; heap mode adds reference arrows | 0.4, 1.2 | 1.x, 3.x, 4.4–4.5, 5.7 |
| `ErrorAnatomy` | Reading errors | 0.5 | 5.8, 10.10 |
| `ValueZoo` | Types as categories | 1.1 | 1.8, 8.6 |
| `NumberLine` | Arithmetic, floating point | 1.5 | — |
| `StringTrain` | Strings as indexed sequences | 1.6 | 4.1 (arrays rhyme with it) |
| `CoercionMachine` 🎬 | Coercion, == vs ===, truthiness | 1.9 | 2.2 |
| `ExpressionTree` | Evaluation order, precedence, short-circuit | 1.10 | 2.4, 8.5 |
| `FlowRoad` 🎬 | Branching & loop control flow | 2.1 | 2.x, checkpoint replays |
| `LoopMachine` | for-loop anatomy, nesting | 2.6 | 2.7 |
| `FunctionMachine` 🎬 | Functions, params, return, purity, HOFs | 3.1 | 3.x, 6.3, 9.3, 9.6 |
| `ScopeLens` 🎬 | Scope bubbles, lookup, shadowing | 3.5 | 5.3 |
| `CallStackTower` 🎬 | Frames, recursion, errors, async pauses | 3.6 | 3.9, 5.x, 6.1, 6.6, 10.6 |
| `ClosureBackpack` 🎬 | Closures | 3.7 | 5.7 (leaks) |
| `ArrayShelf` | Arrays & mutating methods | 4.1 | 4.x |
| `ObjectLocker` | Objects, nesting, destructuring, storage | 4.3 | 4.9, 7.7, 10.9 |
| `PipelineBelt` 🎬 | map/filter/reduce | 4.7 | 4.8, checkpoint |
| `JSONizer` | Serialization | 4.10 | 6.7, 10.8 |
| `TwoPassScanner` 🎬 | Execution contexts, hoisting, TDZ | 5.1 | 5.2 |
| `ThisCompass` 🎬 | `this` binding rules | 5.4 | 5.6 |
| `PrototypeChain` 🎬 | Prototypes, classes desugared | 5.5 | 5.6 |
| `EventLoopMachine` 🎬🎬 | The flagship: stack + Web APIs + queues + loop | 6.2 | 6.5, sandbox async mode |
| `PromiseTimeline` 🎬 | Promise states, chaining, combinators, await | 6.4 | 6.6, 6.8 |
| `NetworkRoundTrip` 🎬 | HTTP, fetch, interception | 6.7 | 10.8 |
| `DOMTree` 🎬 | Live DOM ⇄ rendered page | 7.1 | 7.x, 10.4 |
| `SelectorLab` 🎬 | CSS selectors → Playwright locators | 7.2 | 10.3 (v2) |
| `EventBubbles` 🎬 | Event propagation & delegation | 7.4 | 7.5 |
| `RenderPipeline` | Why elements "aren't ready yet" | 7.8 | 10.5 |
| `ModuleGraph` | Modules, npm, POM structure | 8.1 | 8.2, 10.7 |
| `TestPyramid` | Testing strategy tradeoffs | 9.2 | 10.11 |
| `AssertionScale` | expect/matchers, toBe vs toEqual | 9.4 | 10.5 |
| `TestRunnerPane` | Simulated Vitest/Playwright output | 9.5 | 10.2 |
| `PlaywrightBridge` 🎬 | Automation architecture | 10.1 | 10.x |

### Design notes for the two hero visualizations
**`MemoryDiagram`** (the workhorse, built first in M1)
- Two modes: *simple* (Phase 1: labeled boxes on paper) and *heap* (Phase 4+: a stack column of name→slot bindings on the left, a heap cloud of objects on the right, blue-pencil arrows crossing over).
- The Phase 4 "upgrade moment" is scripted: the simple picture literally redraws itself into the accurate one while the caption admits the simplification. This is the app's philosophy in one animation.
- API sketch: `<MemoryDiagram frames={FrameState[]} heap={HeapObject[]} arrows={Ref[]} stepIndex={n} />` — driven entirely by declarative state per step.

**`EventLoopMachine`** (the flagship, M5)
- Fixed stage layout: CallStackTower (left), Web API waiting room (top right, hand-drawn timers/fetch clouds), macrotask conveyor (bottom), microtask express lane (above it, visibly shorter/faster), and a hand-drawn crank arm that only rotates to feed the stack when the tower is empty.
- Must correctly play: `setTimeout 0`, promise-vs-timeout ordering, blocked-stack scenarios, and eventually user code from the sandbox.

---

## Screen inventory (beyond lessons)
| Screen | Purpose |
|---|---|
| Curriculum map (home) | Compact journey map. Phases 0–1 elevated in a "start here — the foundation" section (user feedback: values/variables are THE building blocks). Cards show a plain-words teaser, not jargon |
| Phase page (`/phase/:n`) | Each phase's own "lab": plain-words intro (2–3 newbie-friendly paragraphs with an analogy), key-terms glossary on sticky notes, "after this phase you can…" list, lesson list, prev/next nav. Content in `src/content/phase-intros.ts`. User feedback: the map must itself teach — no expert one-liners |
| Lesson page | The 6-part anatomy above |
| Recall deck | Daily review of due cards; drawing prompts answered by revealing the original viz |
| Journal | All teach-back answers, editable — "your own textbook, written by you" |
| Sandbox (M4+) | CodeMirror + live MemoryDiagram/CallStackTower; seeded from lessons |
| Progress | Prediction accuracy per phase, streak, export/import |

## Under-the-Hood style contract (2026-07-05 — applies to ALL prose content going forward)

Learner feedback: UTH read as "a different course" — dense sentences, unglossed jargon,
colleague voice. The contract (full rationale in
docs/superpowers/specs/2026-07-05-under-the-hood-rework-design.md):

1. One idea per sentence, max two clauses. No triple-clause em-dash chains.
2. Plain claim first, machinery second — every paragraph opens with its point in everyday
   words, then the mechanism.
3. Every term is taught (cite the lesson number), glossed inline in everyday words, or cut.
   No insider asides about untaught things.
4. One voice: UTH talks to the same beginner the captions talk to.
5. Job notes kept, badged: open with "💼 On the job —" (bold), teaching voice.
   (SUPERSEDED 2026-07-06: job content now lives in the On-the-job section — see below.)
6. Rewrites may not grow a section (3–4 paragraphs; word count ≤ original). Never cut facts —
   gloss them.
7. Plain International English: no idioms, no slang, no culture-bound references. Test: does a
   word-for-word translation still make sense?

Lint: `node scripts/lint-uth.mjs [phase…]` — flags long sentences, blocklisted idioms/jargon,
and growth vs `scripts/uth-baseline.json`.

## Quiz-stem contract (2026-07-06 — applies to ALL quiz questions)

1. Complete problem statement: the stem states every background fact the question depends on
   ("n can be any number"). Never leave the situation or input universe to guesswork.
2. Explicit answer shape (typed checks): the stem ends by naming a valid answer's form
   ("Type the count — 0 if none." / "Type its name." / "Type yes or no."), placeholder
   reinforces it. MCQs exempt (options are the shape).
3. Never explain the approach. No "try to find…", no pointing at the trick. Reasoning
   difficulty is the point; interpretation difficulty is the only defect.

## The "🎤 In an interview" section (2026-07-07)

A curated card on interview-critical lessons (Phase 3+, plus the 1.4 / 1.9 back-ports —
33 lessons total). It gives the technically-precise spoken answer an interviewer wants,
not a metaphor. `LessonDef.interview?` renders **above 💼 On the job**, after the checks.

Placement in the file: the `interview: { … }` object sits immediately before `teachBack: {`.
Anatomy (fixed bands, rendered by `InterviewCard`): question bubble (🎤) → **Say this**
(`say`) → **Show this on paper** (`example.code` in a `<pre>` + italic `note`) → **If they
dig deeper** (`deeper`) → **⚠ Don't say** (struck `dontSay.wrong` + `dontSay.why`).

Copy + example contract (the one section exempt from gloss-everything):
- **Real terms, unglossed** in `say` / `deeper` — that precision is the whole point. This is
  the ONLY section that does not gloss jargon.
- `say` is a **full spoken answer** (headline + the 1–2 sentences you volunteer right after,
  ~20–30s), never a one-liner. `deeper` is only the genuinely harder follow-up.
- Every card carries a **real `example`** — an artifact a candidate would actually talk
  through, never a `makeCounter`-style toy. `code` is a JS string on one source line (`\n`
  breaks) so the lint extractor stays robust; only vocabulary taught at or before this
  lesson may appear; **show the behavior at least twice** when the point is persistence or
  difference (e.g. call the closure twice; print two queue outcomes).
- Every technical term must be **taught earlier**, cited on heavy use (e.g. `the heap (4.6)`).
- **No em dashes** anywhere; short sentences (≤28 words), one idea each; curly apostrophes
  (`’`) inside string literals.
- `dontSay.wrong` is a real shallow answer; `dontSay.why` names what it confuses (usually
  mechanism vs syntax, or "where it lives vs what it does").

Lint: `node scripts/lint-uth.mjs` runs `extractInterview` — sentence-length + idiom + em-dash
checks. The **jargon check is deliberately NOT applied** here (unglossed terms are intended).

## The "On the job" section (2026-07-06 — replaces 💼 paragraphs in underTheHood)

Placement: between the checks and teach-back (LessonShell renders `def.onTheJob`).
Anatomy (fixed): tape label → <Scene> one italic "One day at work…" line → an artifact
(JobScene family: chat / app moment / review / test run / interview / pipeline) →
<Takeaway> with one <Key> phrase.
Content rules: simplest English in the app — short sentences, NO em dashes; only vocabulary
taught at this lesson's position (everyday words fine; gloss or cut jargon; one plain phase
pointer allowed); real QA words may be seeded with an everyday gloss ("the success flow
(the happy path, where everything works)"); the artifact shows, prose never retells it.
Lint: `node scripts/lint-uth.mjs` checks onTheJob blocks (idioms, sentence cap, em-dash ban).
