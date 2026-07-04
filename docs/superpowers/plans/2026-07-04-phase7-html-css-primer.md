# Phase 7 HTML/CSS Primer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give Phase 7's intro page the bare-minimum HTML/CSS vocabulary (tag, attribute, CSS-as-a-language) that its lessons currently assume without ever teaching.

**Architecture:** Content-only change to one existing data object (`PHASE_INTROS[7]`) in `src/content/phase-intros.ts`. No new components, no new lessons, no renumbering. The existing `PhasePage.tsx` renderer already maps `plainWords` to paragraphs, `keyTerms` to glossary cards, and `youCan` to a checklist — nothing there needs to change.

**Tech Stack:** TypeScript data file (`src/content/phase-intros.ts`), no new dependencies.

## Global Constraints

- Full exact copy for every string is specified below — do not paraphrase or "improve" it without checking with the user first (it was already approved verbatim).
- This file's strings are plain single-quoted JS string literals (not JSX) — any apostrophe inside a string **must** be the curly `’` character, never a straight `'`, or the file fails to parse. Literal `<` `>` `"` characters are safe as-is (React renders them as plain escaped text, confirmed against existing entries like `.login-form button` and `expect(actual).toBe(expected)` elsewhere in this file).
- Do not touch any file under `src/lessons/` — this fix is intro-page-only per the approved spec (`docs/superpowers/specs/2026-07-04-phase7-html-css-primer-design.md`).
- Do not `git commit` — per this project's standing rule, leave changes in the working tree unless the user explicitly asks for a commit.

---

### Task 1: Add HTML/CSS vocabulary to `PHASE_INTROS[7]`

**Files:**
- Modify: `src/content/phase-intros.ts` (the `7: { ... }` entry inside `PHASE_INTROS`, currently starting at line 198)

**Interfaces:**
- Consumes: the existing `PhaseIntro` interface already defined at the top of this file (`whyNeeded: string[]`, `plainWords: string[]`, `keyTerms: KeyTerm[]`, `youCan: string[]`) — unchanged, no new fields.
- Produces: nothing new is consumed by other files beyond what `PHASE_INTROS[7]` already provides; `PhasePage.tsx` already iterates these same arrays.

- [ ] **Step 1: Read the current `7: { ... }` entry to get exact current text**

Run a Read on `src/content/phase-intros.ts` around line 198-217 to reconfirm the exact current strings before editing (they may have shifted slightly if anything else touched this file). Current known content (as of this plan being written):

```ts
  7: {
    whyNeeded: [
      'JavaScript exists to make web pages come alive: menus that open, forms that complain, feeds that refresh without reloading. All of it works by editing the browser’s live model of the page — the DOM. For you specifically, this phase is the job: an automated test finds elements in this tree, acts on them, and reads the results back out of it. The DOM is your future workplace.',
    ],
    plainWords: [
      'A web page looks like a picture, but to the browser it’s a family tree of elements — the DOM. Every button, heading and input is a node on that tree, and JavaScript can find any node, read it, change it, or listen to it.',
      'Finding nodes is done with selectors — little address patterns like “the button inside the login form.” When a user clicks, an event ripples through the tree, and code can catch it at any level.',
      'Pay extra attention here: this tree is exactly what you’ll automate for a living. A Playwright test is, at heart, “find this element, act on it, check the result.” Testers who write good selectors are worth gold; this phase is where that skill starts.',
    ],
    keyTerms: [
      { term: 'DOM', meaning: 'The Document Object Model — the live family tree the browser builds from HTML. Change the tree and the page changes instantly.' },
      { term: 'element / node', meaning: 'One item in the tree: a button, a paragraph, an image.' },
      { term: 'selector', meaning: 'A pattern for finding elements, like ".login-form button" — the address system of the page.' },
      { term: 'event', meaning: 'A signal that something happened: a click, a keypress, a form submit. Code can listen and react.' },
      { term: 'event bubbling', meaning: 'Events ripple upward from the element to its ancestors — so a parent can hear its children’s events.' },
      { term: 'rendering', meaning: 'The browser turning the tree into pixels. Elements can exist before they’re visible — the root cause of flaky tests.' },
    ],
    youCan: [
      'Sketch the DOM tree for a simple page',
      'Write a selector to hit any element — first try',
      // (2 more youCan lines follow — leave them untouched)
    ],
  },
```

- [ ] **Step 2: Prepend the new HTML/CSS paragraph to `plainWords`**

Use the Edit tool. Old string (the `plainWords` array's opening through its first existing paragraph):

```ts
    plainWords: [
      'A web page looks like a picture, but to the browser it’s a family tree of elements — the DOM. Every button, heading and input is a node on that tree, and JavaScript can find any node, read it, change it, or listen to it.',
```

New string:

```ts
    plainWords: [
      'Every web page’s structure is written in HTML — plain text wrapped in tags, like <li class="todo">buy milk</li>. The tag name (li) says what kind of thing this is; anything else inside the angle brackets, like class="todo", is an attribute — extra information about that one element. CSS is a separate language for how things LOOK (colors, spacing, layout) — and it uses the same kind of selectors you’re about to learn, just to say which elements to style instead of which ones to grab in code.',
      'A web page looks like a picture, but to the browser it’s a family tree of elements — the DOM. Every button, heading and input is a node on that tree, and JavaScript can find any node, read it, change it, or listen to it.',
```

(Note: the *italic* on "look" from the approved copy becomes plain-text ALL CAPS here — `plainWords` entries are plain strings, not JSX, so there is no italic markup available. This matches how other intros in this same file emphasize words, e.g. Phase 6's "it is single-threaded".)

- [ ] **Step 3: Prepend three new cards to `keyTerms`**

Old string (the `keyTerms` array's opening through its first existing entry):

```ts
    keyTerms: [
      { term: 'DOM', meaning: 'The Document Object Model — the live family tree the browser builds from HTML. Change the tree and the page changes instantly.' },
```

New string:

```ts
    keyTerms: [
      { term: 'HTML', meaning: 'The language a web page’s structure is written in — plain text wrapped in tags.' },
      { term: 'tag / attribute', meaning: 'A tag like <li> names what kind of thing an element is; an attribute like class="todo" (written inside the tag) adds extra information about it.' },
      { term: 'CSS', meaning: 'A separate language for how things look — colors, spacing, layout. Uses the same kind of selectors you’ll write to find elements.' },
      { term: 'DOM', meaning: 'The Document Object Model — the live family tree the browser builds from HTML. Change the tree and the page changes instantly.' },
```

- [ ] **Step 4: Prepend one new line to `youCan`**

Old string (the `youCan` array's opening through its first existing entry):

```ts
    youCan: [
      'Sketch the DOM tree for a simple page',
```

New string:

```ts
    youCan: [
      'Read an HTML tag and its attributes, and explain what CSS is for',
      'Sketch the DOM tree for a simple page',
```

- [ ] **Step 5: Verify no straight apostrophes were introduced**

Run:
```bash
grep -n "don't\|it's\|you're\|isn't\|doesn't\|can't\|won't" src/content/phase-intros.ts
```
Expected: no matches from the three snippets just added (the new text above contains no contractions at all, so this should simply confirm zero hits in the added lines — if it finds a hit inside your new text, replace the straight `'` with `’`).

- [ ] **Step 6: Build**

Run: `npm run build`
Expected: `tsc -b && vite build` completes with no errors (matches the same command used to verify every other fix earlier this session).

- [ ] **Step 7: Leave the change in the working tree**

Do not run `git add` / `git commit`. Report the diff to the user and wait for them to explicitly ask for a commit (per this project's standing rule — see Global Constraints above).
