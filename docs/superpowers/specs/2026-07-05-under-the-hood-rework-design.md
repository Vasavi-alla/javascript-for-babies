# Under-the-Hood Rework — Design

**Date:** 2026-07-05
**Status:** Approved by user (register calibrated on the 1.10 sample; idiom rule added from user feedback; rollout adjusted: calibration batch = Phases 0–2, user review gates the rest)

## Problem

Lijas reports the "Under the Hood" sections are too technical — and the issue runs from Phase 1,
not just the recent phases. Three confirmed symptoms (user-selected):

1. **Dense sentences** — single sentences packing 3+ facts with em-dashes and parentheticals;
   he knows each word but loses the thread.
2. **Unglossed jargon** — words that were never taught and never glossed inline
   (e.g. "React re-renders", "layout thrash", "load-bearing").
3. **Register jump** — the steps talk to a beginner; under-the-hood suddenly talks to a
   colleague/interviewer. It reads like a different course.

Explicitly NOT the problem: length. Lijas wants the depth; he wants it readable. This matches
the course's non-negotiable: depth stays, hand-waving is forbidden — the fix is the *prose*,
never the facts.

A bonus finding from the calibration sample: the sweep will also catch real teaching bugs —
1.10's current text uses `user && user.name`, but property dots are not taught until 4.4.

## Goal

Rewrite the `underTheHood` content of **all 115 lessons** to a single teaching voice under a
written style contract, preserving every fact and the existing 3–4-paragraph shape.

## Non-goals

- No UI/component/engine changes. The 💼 badge is plain text inside the existing `<p>`.
- Steps/captions, quizzes, exercises, recaps, hooks: out of scope — EXCEPT a teachBack
  modelAnswer that contradicts a rewritten fact gets a consistency touch-up in the same lesson.
- No shortening mandate. Trimming asides that serve no learner is allowed; cutting facts is not.
- Caption-side idioms (e.g. the standing "file it away" phrase) are out of scope for this
  rework; the idiom rule and blocklist stand ready if Lijas reports the same friction there.

## The Style Contract (becomes the standing rule for all future content)

1. **One idea per sentence, max two clauses.** No triple-clause em-dash chains.
2. **Plain claim first, machinery second.** Every paragraph opens with its point in everyday
   words, then explains the mechanism.
3. **Every term is taught, glossed, or cut.** A technical term must have a lesson behind it
   (cited by number, as now) or an everyday-words gloss at first use. Insider asides about
   things never taught (React, thrash, structural typing…) are glossed or deleted.
4. **One voice for the whole lesson.** Under-the-hood addresses the same beginner the captions
   address. Test: would a step caption ever say this sentence this way?
5. **Job notes: kept, badged.** Career/interview content opens with **"💼 On the job —"**
   (bold, inside the paragraph) and speaks in the teaching voice.
6. **Rewrites may not grow a section.** Same paragraph count (3–4); word count ≤ the original.
   Facts are never sacrificed — a fact that resists plain phrasing needs a gloss, not deletion.
7. **Plain International English.** No idioms, no slang, no culture-bound references
   ("pecking order", "load-bearing", "earning its keep", "cries wolf"). Prefer the literal
   word. Test: translated word-for-word into another language, does the sentence still make
   sense? An idiom blocklist is seeded in the lint and grows with every offender found.

Existing content rules continue to apply unchanged: metaphors get boundary lines; fun facts
need everyday hooks; forward references flag, never teach.

## Calibration example (approved)

1.10, current fourth paragraph:

> "Short-circuiting is also load-bearing in real code: `user && user.name` deliberately uses
> the skip to avoid touching `.name` when there's no user."

Rewritten under the contract:

> "The skip you watched (short-circuiting) is more than a speed trick — real code depends on
> it. An example built only from tools you own: `count !== 0 && total / count > 5`. When count
> is 0, `&&` skips the right side entirely — so the division by zero never happens. The left
> side protects the right side."

And the precedence paragraph, post-idiom-rule:

> "When several operators share one line, the engine applies them in a fixed order: `!` runs
> first. Then arithmetic (`*` before `+`, as you watched). Then comparisons. Then `&&`, then
> `||` — and `=` always last. But here is the honest professional habit: nobody remembers this
> full list. When in doubt, add parentheses — they redraw the tree exactly how you want."

## Mechanics

- Content-only edits to the `underTheHood: (…)` JSX block in each `src/lessons/phaseN/*.tsx`.
- Job-note badge: `<p><strong>💼 On the job —</strong> …</p>` — no new components.
- Each lesson edited by hand (register work cannot be codemodded); verified per batch.

## Verification (per batch)

1. **Lint script** (scratchpad, run per batch): extracts UTH text per lesson and flags
   (a) sentences over ~28 words, (b) blocklisted idioms/jargon without a nearby gloss
   marker, (c) sections whose word count grew beyond the original.
2. **Fresher read** of every rewritten section (the established review ritual).
3. **Build green** after each batch (UTH is standalone — no steps/views impact expected;
   counts re-verified anyway).
4. **Human gate:** after Batch 1, Lijas/user sample the register before the rollout continues.

## Rollout

| Batch | Scope | Gate |
|---|---|---|
| 0 | Style contract written into `docs/plan/04-LESSON-BLUEPRINT.md` + memory rule saved | — |
| 1 | Phases 0–2 (24 lessons) — the calibration batch (per user: "till phase 2, then review") | **User/Lijas review the register before the rest proceeds** |
| 2 | Phases 3–4 (25 lessons) | lint + fresher read + build |
| 3 | Phases 5–6 (18 lessons) | lint + fresher read + build |
| 4 | Phases 7–8 (15 lessons) | lint + fresher read + build |
| 5 | Phases 9–10 (15 lessons) | lint + fresher read + build |
| 6 | Phase 11 (18 lessons) | lint + fresher read + build |

Commits per batch; pushes only on the user's explicit request (project rule).

## Risks

- **Fact drift while rewording** — mitigated by the rewrite-the-sentence-never-the-fact rule
  and the per-batch fresher read comparing against the original's claims.
- **Voice monotony** — plain does not mean flat; analogies remain allowed as color under the
  existing metaphor-boundary rules.
- **Blocklist incompleteness** — it grows during the sweep; the final list ships in the lint
  script for all future content.

## Success criteria

- Lijas reads under-the-hood sections without stalling (the real gate, after Batch 1).
- Lint clean across all 115 lessons: no over-long sentences, no unglossed blocklist terms,
  no section grew.
- Every fact from the originals preserved or deliberately (and visibly, in the batch notes)
  removed as an insider aside.
- Build green; all existing verifications still pass.
