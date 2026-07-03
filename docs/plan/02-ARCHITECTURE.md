# 02 — Architecture

## Stack (decided 2026-07-02)
| Concern | Choice | Why |
|---|---|---|
| Framework | React 19 + TypeScript + Vite | User requested React; TS keeps the app maintainable across many sessions |
| Routing | react-router (v7, library mode) | Lesson URLs like `/phase/1/lesson/2` make progress shareable/bookmarkable |
| Animation | Framer Motion (`motion`) | Declarative step-based animations; layout animations for memory/stack diagrams |
| Hand-drawn rendering | rough.js (SVG) + rough-notation (highlights/underlines on text) | The entire sketchbook look; wraps our SVG primitives |
| Styling | Tailwind CSS v4 + CSS custom properties for the design tokens | Fast iteration; tokens in `03-DESIGN-SYSTEM.md` |
| Code display | Shiki (custom warm light theme) | Accurate highlighting; renders to HTML we can annotate per-token |
| Code editing (M4+) | CodeMirror 6 | The sandbox editor |
| Code execution (M4+) | Acorn (parser) + custom step-evaluator (see Sandbox engine) | We need step *events*, not just results |
| State | Zustand + `persist` middleware → localStorage | Progress, teach-back journal, prediction scores; no backend needed |
| Charts (rare) | Plain SVG first; visx only if genuinely needed | Most "charts" here are custom diagrams anyway |
| Fonts | Self-hosted via @fontsource (see design system) | Offline-friendly |
| Tests | Vitest + Playwright (dogfooding — the app that teaches Playwright is tested with Playwright) | Later milestones |

## Folder structure
```
src/
  app/                 # shell: routes, layout, curriculum map screen
  design/              # design-system components (PaperCard, StickyNote, HandArrow, RoughBox, HighlightMark, ...)
  engine/              # lesson framework (see below)
    stepper/           #   useStepper, StepperControls, StepScript types
    sandbox/           #   (M4+) acorn-based evaluator emitting StepEvents
  viz/                 # reusable visualization components, one folder each
    memory-diagram/    #   MemoryDiagram, MemoryWall
    call-stack/        #   CallStackTower
    event-loop/        #   EventLoopMachine
    ...                #   (full catalog in 04-LESSON-BLUEPRINT.md)
  lessons/             # one folder per lesson: phase1/lesson-02-variables/
    phase0/ ... phase10/
  content/             # lesson registry: metadata, ordering, prerequisites
  store/               # zustand stores: progress, journal, predictions
  styles/              # tokens.css, paper texture, global styles
```

## Lesson framework (the core abstraction — build in M0)
A lesson is **a React component + a step script**. The framework gives every lesson the same skeleton and controls so lessons stay cheap to author.

```ts
// content/registry.ts
interface LessonMeta {
  id: string;              // "1.2"
  slug: string;            // "what-is-a-variable"
  title: string;
  phase: number;
  prereqs: string[];       // lesson ids
  vizComponents: string[]; // which catalog components it uses
  sandboxSeed?: string;    // code to preload in sandbox (M4+)
}
```

```ts
// engine/stepper — a lesson's visualization is driven by a StepScript
interface Step {
  id: string;
  explanation: ReactNode;      // the "what just happened" panel text for this step
  code?: { source: string; highlightLines?: number[] };
  prediction?: {               // optional predict-before-reveal gate
    question: string;
    options: string[];
    correctIndex: number;
    whyText: string;           // shown after answering, right or wrong
  };
}
// useStepper(steps) → { index, next, prev, goto, isPrediction }
// Viz components receive `stepIndex` and animate to match — every viz is a
// pure function of (props, stepIndex), which makes steps scrubbable both ways.
```

**Rule: visualizations are deterministic functions of the step index.** No fire-and-forget animations; the learner can scrub back and forth and the picture is always correct. Framer Motion `layout` + `AnimatePresence` handle the tweening between step states.

### Lesson page anatomy (matches 04-LESSON-BLUEPRINT.md)
```
┌────────────────────────────────────────────────┐
│ Hook (why this matters, 2–3 sentences)         │
├───────────────────────┬────────────────────────┤
│ Code pane             │ Visualization pane     │
│ (current line inked)  │ (animates per step)    │
├───────────────────────┴────────────────────────┤
│ Explanation panel for current step             │
│ [◀ prev]  ● ● ● ○ ○  [next ▶]                  │
├────────────────────────────────────────────────┤
│ Under the Hood (deeper prose, collapsible)     │
│ Play (mini-exercise / quiz)                    │
│ Teach-back (textarea → journal) · Recap cards  │
└────────────────────────────────────────────────┘
```

## Sandbox engine (M4 — design now, build later)
Goal: user types JS, we visualize variables/stack/heap/event-loop live.

- **Parse** with Acorn → ESTree AST.
- **Evaluate** with our own tree-walking interpreter that emits `StepEvent`s:
  `varDeclared`, `varAssigned`, `frameEntered { fnName, args }`, `frameExited { returnValue }`, `heapAllocated { kind }`, `refCreated`, `conditionEvaluated`, `loopIteration`, `taskQueued { queue: 'macro'|'micro' }`, `consoleLog`, `errorThrown`.
- Viz components already consume step states from the guided lessons — the sandbox just becomes **another producer of the same step stream**. This is why M0's "viz = pure function of step" rule matters.
- Safety: hard step limit (e.g. 10k) to survive infinite loops; run in the main thread first (simpler), move to a Worker if UI jank appears.
- Scope v1: expressions, variables, functions/closures, control flow, arrays/objects. Async (setTimeout/promises) lands in M5 alongside Phase 6.
- Not supported (fine): full stdlib, DOM APIs inside the sandbox — the DOM lessons use a different live-preview mechanism (a real sandboxed iframe).

## Progress store
```ts
interface ProgressState {
  completedLessons: Record<string, { completedAt: string }>;
  predictions: Record<string, { correct: number; total: number }>; // per lesson
  journal: Record<string, string>;      // lessonId → teach-back answer
  recallDeck: RecallCard[];             // generated on lesson completion
}
```
Persisted to localStorage; add JSON export/import in M8 so progress survives machine changes.

## Performance & quality guardrails
- rough.js shapes are memoized per (shape, seed) — re-rendering must not redraw wobbles (visual noise) or cost CPU.
- Respect `prefers-reduced-motion`: steps snap instead of tween.
- Every lesson keyboard-navigable: ←/→ steps, Enter confirms predictions.
- Target: lesson route chunk < 200KB; viz components lazy-loaded per phase.
