<img src="public/icon-192.png" width="96" align="right" alt="Vasavi" />

# JS for Babies — *see JavaScript think*

A visual, hands-on JavaScript learning notebook, built for one learner: **Vasavi**.
It starts from absolute zero — "what is a program?" — and ends at writing real
Playwright automation tests. No prior knowledge assumed, no step skipped.

The name is the promise: every concept is explained like you're brand new, because you are.

## Why this exists

Tutorials show you *syntax*. This notebook shows you **what the machine is doing** —
every lesson pairs an animated visualization with the plain-English "why" and the
under-the-hood "how". The goal isn't to memorize JavaScript; it's to understand it
well enough to **teach it to someone else** (every lesson ends with a teach-back).

## How a lesson works

1. **Hook** — a tiny story or problem that makes the concept matter.
2. **Watch it happen** — step through real code while a hand-drawn visualization
   shows memory, the call stack, loops, closures… actually moving. No quizzes here;
   just watching the machine think.
3. **Under the hood** — three short paragraphs of honest explanation, plus a fun
   fact with a real everyday-world hook.
4. **Checks** — typed answers, not multiple choice. You *type* what the console
   would print, because recognizing an answer is not the same as producing one.
5. **Write code by hand** — most lessons end with a LeetCode-style exercise:
   a story, precise requirements (what, never how), and an exact expected output.
   Your code runs for real in a sandboxed Web Worker and is checked against the
   output and the required syntax. Stuck? See the model answer with a line diff.
6. **Teach it back** — explain the concept in your own words; an AI mentor
   (Gemini) judges the understanding, never the wording.

Along the way: a study coach that counts only *active* minutes and nudges real
breaks, a streak calendar, a daily note sticker — and **Barnaby**, the resident
cat, who patrols the bottom of every page, walks, sleeps, and enjoys being petted.

## The curriculum (Phases 0–11)

| Phase | Territory |
|---|---|
| 0 | What a program is, the console, talking to the machine |
| 1 | Values, variables, types — the memory model |
| 2 | Decisions and loops — control flow |
| 3 | Functions — parameters, returns, scope, closures, callbacks, recursion |
| 4 | Collections — arrays, objects, references |
| 5 | How JS *really* runs — hoisting, `this`, execution contexts |
| 6 | Async — the event loop, single-threaded & non-blocking, promises, async/await |
| 7 | The DOM — JS meets the page |
| 8 | Modern JS & tooling |
| 9 | **Node.js** — the terminal, process & env, files, Node's event loop |
| 10 | Testing fundamentals (Vitest) |
| 11 | **Playwright** — automation testing, the destination |

## Running it

```bash
npm install
npm run dev      # local dev server
npm run build    # production build (static, deploys anywhere)
```

Works great on a laptop and is tuned for **iPad + Apple Pencil** (16px inputs,
smart-punctuation normalization, Add-to-Home-Screen PWA icons).

### The AI mentor (optional)

Exercises and teach-backs can call Gemini for feedback. Provide a key either way:

- paste it once in the app when the mentor first asks (stored in `localStorage`), or
- create `.env.local` with `VITE_GEMINI_KEY=…` for local dev.

**Never commit the key, and never bake it into a public deploy build** — prefer
the paste-once flow for deployed copies.

## Project layout

```
docs/plan/        the master plan, curriculum, architecture, design system, progress log
src/engine/       lesson shell, stepper, code runner (Web Worker), practice, coach
src/lessons/      one file per lesson, registered in src/lessons/index.ts
src/design/       warm-sketchbook primitives (rough.js cards, buttons, stickers)
src/app/          pages: home map, phase pages, lesson page — and the cat
public/cat/       Barnaby's sprite loops (walk / sit / sleep / pet)
```

Built with React 19 + TypeScript + Vite, Tailwind v4, Motion, rough.js, Zustand,
and a 2-second-timeout Web Worker sandbox for running learner code safely.

---

*Made with patience, for Vasavi — one page of the notebook at a time.* 🐈
