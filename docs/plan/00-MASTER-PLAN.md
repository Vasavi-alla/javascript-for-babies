# 00 — Master Plan

## Vision
A single-page webapp where JavaScript is *seen*, not memorized. Every concept — from "what is a variable" to "how Playwright waits for a locator" — is taught with an animated, steppable visualization sitting next to a plain-language explanation of what's really happening in the machine. The learner finishes able to (a) write real JavaScript, (b) work as an automation tester with Playwright, and (c) teach every concept to someone else.

## Who it's for
- Primary learner: absolute beginner, goal = automation tester.
- Secondary use: a teaching tool — lessons must be presentable to others.

## Teaching principles (the soul of the app — never violate these)
1. **See it, then name it.** Show the mechanism animating first, attach the syntax second. Syntax is the label, not the lesson.
2. **Visuals + depth, never visuals instead of depth.** Every animation has an "Under the hood" explanation. If a lesson looks pretty but a learner couldn't explain *why*, the lesson is broken.
3. **One mental model per lesson.** A lesson teaches exactly one idea. Related ideas get their own lessons and link back.
4. **Type, don't recognize.** *(Revised 2026-07-03; replaces "predict before reveal.")* "Watch it happen" plays uninterrupted — no questions block the animation. The thinking happens in the checks instead, where the learner TYPES concrete answers (values, outputs, counts, keywords) rather than picking from options; MCQs survive only where the contrasting options are themselves the teaching. Prediction moments live on inside mission challenges, where predicting-then-pressing-GO is the interaction itself.
5. **Teach-back closes every lesson.** A prompt like "Explain to a friend why `let x = 5` doesn't put 5 *inside* x's name." The learner types/says it; a model answer is available to compare.
6. **Nothing is magic.** When we simplify (e.g., "variables are labeled boxes"), we say it's a simplification and later revisit with the accurate model (stack/heap, references).
7. **Spaced recall.** Recap cards resurface earlier concepts inside later lessons (closures resurface scope; Playwright resurfaces promises).

## Decision log
| Date | Decision | Why |
|---|---|---|
| 2026-07-02 | Visual style: **Warm sketchbook** — cream paper, hand-drawn ink diagrams, highlighter accents | User choice; explicitly no generic blue/purple |
| 2026-07-02 | Interaction: **Phased** — guided step-through visualizations first, live code-visualizing sandbox added later | User choice; ship lessons fast, add power later |
| 2026-07-02 | Automation target: **Playwright** (deep dive) | User choice; JS-native, industry momentum |
| 2026-07-02 | Stack: React + TypeScript + Vite; Framer Motion; rough.js for hand-drawn SVG; Zustand + localStorage for progress | See `02-ARCHITECTURE.md` |
| 2026-07-03 | "Watch it happen" is question-free; checks are typed-input first (MCQ only when options teach) | User: stepper interruptions broke the flow; typing = recall, clicking = recognition |
| 2026-07-03 | ONE lesson format for all phases: the classic 6-part anatomy (+ a write-code exercise per lesson) | Mission/Machine Shop format was built, trialed, and retired — the story analogy didn't land; consistency with Phases 1–2 won |
| 2026-07-05 | Phase 11 expanded 13 → 18 stops: dedicated setup (11.2), config-decoded (11.3), test data & parameterization (11.8), cross-browser projects/devices (11.12), tags & selective runs (11.13), CI-pipeline-decoded (11.16); dynamic-content handling named in 11.6; capstone scope widened to match | User request: explicit coverage of why/setup/config/dynamic testing/env vars/"deploy" (= CI + report publishing) + gaps found in review (data-driven, cross-browser, tags) |

## The journey at a glance (details in 01-CURRICULUM.md)
| Phase | Title | Core question |
|---|---|---|
| 0 | The Machine | What *is* a program, and how does JavaScript actually run? |
| 1 | Values & Variables | What happens in memory when I create a variable? |
| 2 | Making Decisions & Repeating | How does a program choose and loop? |
| 3 | Functions | How do we package behavior, and what are scope and closures *really*? |
| 4 | Collections | How do arrays and objects live in memory (references!)? |
| 5 | Under the Hood | Execution contexts, call stack, hoisting, prototypes, `this`, GC |
| 6 | Time & Async | The event loop, callbacks, promises, async/await |
| 7 | The Browser & DOM | The DOM tree, events, selectors — the automation tester's hunting ground |
| 8 | Modern JS & Tooling | Modules, npm, debugging, ES6+, a taste of TypeScript |
| 9 | Testing Mindset | Why we test, assertions, test pyramid, Vitest |
| 10 | Playwright | Locators, auto-waiting, fixtures, POM, network, CI — job-ready |

## Build milestones (implementation order)
| Milestone | Deliverable | Status |
|---|---|---|
| M0 | Scaffold: Vite app, design system, app shell, lesson framework (Stepper engine), curriculum map screen | not started |
| M1 | Phase 0 + Phase 1 lessons (the memory visualizer is the hero piece) | not started |
| M2 | Phase 2 + Phase 3 lessons (flowcharts, scope lens, closure visualizer) | not started |
| M3 | Phase 4 + Phase 5 lessons (reference vs copy, call stack tower, prototype chain) | not started |
| M4 | **Sandbox v1** — live editor that visualizes user-typed code (variables + call stack) | not started |
| M5 | Phase 6 lessons (event loop machine, promise timelines) + sandbox async support | not started |
| M6 | Phase 7 + Phase 8 lessons (live DOM tree, event bubbling playground) | not started |
| M7 | Phase 9 + Phase 10 lessons (assertion playground, Playwright simulator) | not started |
| M8 | Polish: spaced-recall deck, teach-back review, progress export, a11y pass | not started |

Keep statuses mirrored in `05-PROGRESS.md` (that file is the source of truth for day-to-day).

## How to resume in a new session
1. Read this file + `05-PROGRESS.md`.
2. Pick up the top item in "Next up."
3. When a lesson is built, verify it in the browser before marking done.
4. Log the session at the bottom of `05-PROGRESS.md`.
