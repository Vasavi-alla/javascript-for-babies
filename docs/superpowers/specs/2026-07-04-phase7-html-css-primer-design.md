# Phase 7 HTML/CSS baseline vocabulary — design

## Problem

A full-curriculum beginner read-through (2026-07-04, all 76 built lessons) found that Phase 7
(The Browser & DOM) quietly assumes HTML/CSS literacy that Phases 0-6 never built. Specifically:

- Lesson 7.1's very first code sample is raw markup (`<li class="todo done">`) with no sentence
  anywhere saying what a tag or an attribute is — only inferable from the example.
- "CSS" is used constantly from 7.2's title onward (and leaned on directly in 7.8's CSSOM
  discussion) as a thing distinct from HTML and JS, but it is never actually defined as its own
  language anywhere in the phase.

A learner who came in with genuinely zero web exposure (not just zero JS) can follow every DOM
concept taught (tree, selectors, events, rendering) and still be quietly lost on the raw syntax
underneath them.

## Decision

Fix this at the **Phase 7 intro page only** (`PHASE_INTROS[7]` in
`src/content/phase-intros.ts`) — the overview a learner reads before starting lesson 7.1. No
lesson files change, no renumbering.

Two other placements were considered and rejected:

- **A new dedicated lesson** (full hook/viz/quiz/exercise, matching every other lesson's
  format) — most consistent with "never skip fundamentals," but touches ~90 existing
  cross-references to "7.X" scattered across lesson prose, `registry.ts`, and `index.ts` if
  inserted before 7.1 (renumbering 7.1→7.2 … 7.9→7.10). Rejected as disproportionate machinery
  for what turned out to be bare-vocabulary scope (see below), and too risky to do by hand.
- **Folding a few extra steps into the front of lesson 7.1** — no renumbering, but makes one
  lesson teach two unrelated ideas (page markup + the DOM tree) and grows an already-built
  lesson. Rejected in favor of the intro page, which already exists specifically to carry
  vocabulary a phase's lessons will assume.

## Scope

Bare-minimum vocabulary only: a learner should recognize a tag and an attribute when they see
one, and know that CSS is a separate styling language. **Not in scope:** writing HTML/CSS from
scratch, CSS syntax/properties, or anything beyond what the existing Phase 7 lessons already
lean on.

## Content (exact copy, approved by user)

In `PHASE_INTROS[7]`:

**New paragraph, prepended to `plainWords` (before the existing DOM paragraph):**

> "Every web page's structure is written in HTML — plain text wrapped in tags, like
> `<li class="todo">buy milk</li>`. The tag name (`li`) says what kind of thing this is;
> anything else inside the angle brackets, like `class="todo"`, is an attribute — extra
> information about that one element. CSS is a separate language for how things *look* (colors,
> spacing, layout) — and it uses the same kind of selectors you're about to learn, just to say
> which elements to style instead of which ones to grab in code."

**Three new cards, prepended to `keyTerms`:**

- `HTML` — "The language a web page's structure is written in — plain text wrapped in tags."
- `tag / attribute` — "A tag like `<li>` names what kind of thing an element is; an attribute
  like `class="todo"` (written inside the tag) adds extra information about it."
- `CSS` — "A separate language for how things look — colors, spacing, layout. Uses the same
  kind of selectors you'll write to find elements."

**One new line, prepended to `youCan`:**

- "Read an HTML tag and its attributes, and explain what CSS is for"

Existing `whyNeeded` is untouched (already motivates the DOM/testing angle; doesn't need the
HTML/CSS vocabulary itself).

## Files touched

- `src/content/phase-intros.ts` only (`PHASE_INTROS[7]`).

## Verification

- `npm run build` (`tsc -b && vite build`) after the edit.
- Read the rendered strings back to confirm no stray straight apostrophes inside the
  single-quoted string literals (project-specific gotcha — see `05-PROGRESS.md`).
