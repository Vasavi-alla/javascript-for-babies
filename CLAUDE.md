# js-for-babies

A visual, animated JavaScript learning webapp — zero to hero, ending at Playwright automation testing. Built for one learner (Lijas) whose goals are: (1) deeply *understand* JS through visualizations instead of memorizing syntax, (2) become an automation tester, (3) understand well enough to teach anyone.

## Session startup — do this first
1. Read `docs/plan/00-MASTER-PLAN.md` (vision, principles, decisions).
2. Read `docs/plan/05-PROGRESS.md` (what's done, what's next).
3. Continue from the "Next up" section of the progress file. Update it before the session ends.

## The plan files
| File | What it holds |
|---|---|
| `docs/plan/00-MASTER-PLAN.md` | Vision, teaching principles, phase overview, decision log |
| `docs/plan/01-CURRICULUM.md` | Full lesson-by-lesson curriculum (Phases 0–10) |
| `docs/plan/02-ARCHITECTURE.md` | Tech stack, folder structure, lesson framework, sandbox engine |
| `docs/plan/03-DESIGN-SYSTEM.md` | "Warm sketchbook" style guide: colors, fonts, components, motion |
| `docs/plan/04-LESSON-BLUEPRINT.md` | Anatomy of a lesson + visualization component catalog |
| `docs/plan/05-PROGRESS.md` | Status board and session log — keep this updated |

## Non-negotiable principles (from the user)
- Visualizations NEVER replace explanation — every animation is paired with the "why" and "how it works under the hood."
- Never skip fundamentals. Assume zero prior knowledge.
- No generic blue/purple UI. Style is **warm sketchbook** (see design system).
- Every lesson ends with a "teach-back" element — the learner should be able to teach the concept to someone else.

## Conventions (once the app is scaffolded)
- React + TypeScript + Vite. App code is TS; the *taught* language is plain JS.
- Lessons are data + React components registered in a lesson registry (see architecture doc).
- Run dev server: `npm run dev`. Before claiming a lesson works, load it in the browser.
