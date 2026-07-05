# Fresher review — Phase 8 & 9 (2026-07-05)

Method: same as rounds 1–2. Read all 14 lessons as a learner who has completed Phases 0–7 and
nothing else — hook, code pane, every step caption cross-checked against the viz code at that
index, underTheHood, quizzes (would my typed answer be accepted?), teach-backs, recaps, and
exercises (would my natural correct solution pass the rules?). Plus scripted sweeps: caption
density, SVG overflow, and first-use greps for every technical term.

**Overall verdict: solid.** Pacing is right (9–11 steps everywhere, no bundled captions — the three
56–60-word flags are single-idea arcs). Forward references are flagged, not taught. Metaphors are
color, not concept-names. The exercises verified end-to-end. But the fresher hit **one real wall,
one contradiction, and a handful of desyncs** — list below, worst first.

---

## A. Findings

### A1 — HIGH · "CI" is never defined anywhere in the course, yet Phase 8–9 lean on it constantly
As a fresher I hit "the CI server" in 8.2 (lockfile step), then "how CI knows pass from fail" as
the *climax* of 9.2, then CI in 9.4, 9.5, 9.6, 9.8… and I genuinely do not know what those two
letters mean. `grep "continuous integration" src/` → **zero hits**. The only real definition lives
in phase-intros **[11]** — three phases after first use. The Phase-9 intro itself uses "CI server"
casually without expanding it.
**Fix:** one-sentence gloss at first lesson use (8.2 lockfile step): "CI — continuous integration:
a robot teammate that reinstalls and re-runs the whole suite on every change (Phase 11 sets one up
for real)". Re-anchor briefly in 9.2's ci-payoff. Add a `CI` keyTerm to phase-intros **[8]** and
**[9]** (the [11] one already exists).

### A2 — HIGH · git / repo / commit / .gitignore assume a tool the course has never mentioned
`grep git` across Phases 0–7: **zero hits.** Then 8.2 says "never commit it to git", 9.4 says
"git remembers forever — anyone with the repo has them", 9.5 builds a whole step on `.gitignore`.
As a fresher: what is git? What is a repo? What does commit mean? The *reasoning* in those steps is
excellent — but it rests on an untaught noun.
**Fix:** first-use gloss in 8.2's node_modules step ("git — the project's version-control memory:
it records every change ever made and shares them with the team; 'committing' = recording") +
a `git & the repo` keyTerm in phase-intros [8]. Subsequent uses (9.4, 9.5) then stand.

### A3 — HIGH (consistency) · 9.8's hello.js puts `import` mid-file — directly contradicting 8.1
8.1 teaches, with a badge: "import lives at the top of the file and can never hide inside an if."
9.8's mission script then shows `console.log(line)` on line 9 and `import { writeFileSync }` on
line 11. Legal (ESM hoists imports) but the fresher just watched the course break its own rule in
the final checkpoint.
**Fix:** reorder the CODE sample — import first, then the constants; adjust highlightLines.

### A4 — MED · 9.7's pictures lag the captions by one beat (steps 3→5)
The step that *teaches* `await res.json()` shows the body still unparsed ("still needs unpacking"),
the parse + `Ada` console line lands on the *next* step (whose caption is about `?.`), and
`no pet` lands on the step after *that* (the "name the discipline" step). Round-2 rule: the payoff
lands ON the step that promises it.
**Fix:** shift VIEWS 3–5: view[3] = parsed, console `['200','Ada']`, json note; view[4] = console
adds `'no pet'`, ?./?? note; view[5] = full console, discipline note (badge unchanged).

### A5 — MED · 9.4's hook opens with three unglossed jargon terms in one sentence
"…localhost on your machine, **staging** in **CI**, and production for the **smoke tests**." A
fresher knows none of the three (CI fixed by A1, but not here yet in reading order… actually 8.2
precedes it — still, staging and smoke tests are never defined anywhere).
**Fix:** reword the hook plainly ("on your machine, on the team's private practice copy of the
site — called staging — and on the live site") and drop "smoke tests" (or gloss it). Also gloss
"staging" at its second use in the env-why caption. In 9.2's ci-payoff, gloss "pipeline" and
prefer "stops the release" over "stops the deploy".

### A6 — MED-LOW · 8.2's install caption claims "line 12 appeared!" — but the code pane is static
The CODE pane always shows the devDependencies line; nothing appears. Round-2 defect class:
captions must not narrate on-screen events that don't happen.
**Fix:** reword to "recorded as line 12" (or add a before/after codeOverride — reword is enough).

### A7 — MED-LOW · 9.6 has two dynamic labels that overflow their boxes
The scripted audit skips dynamic content; hand-measuring: `'global — STUCK on readFileSync'` at
fs7 mono ≈ 134px in a 100px frame (spills both sides), and `'🌐 await page.click()'` ≈ 93px+emoji
in a 94px job card (borderline).
**Fix:** shorten to `'STUCK: readFileSync'` and `'🌐 page.click()'`.

### A8 — LOW batch · exercise rules reject some natural correct solutions
- 9.2 `mustUse /===\s*0/`: a correct `failures > 0 ? 1 : 0` is rejected → widen to
  `===\s*0|>\s*0|!==\s*0`.
- 9.8 exit-code check: a correct `if (disk["hello.txt"]) { exit = 0 }` solution matches none of
  the accepted patterns → add `|if\s*\(\s*disk\s*\[` .
- 8.6 `startsWith|[0]`: a correct `.charAt(0)` is rejected → add `|charAt\s*\(\s*0\s*\)`.

### A9 — LOW batch · quiz accept-lists miss plausible typings
- 9.6 order question: `A,B,C` / `a,b,c` (no spaces) not accepted → add.
- 9.5 Q1 is a leading yes/no ("does adding utf8 fix that?") — answer is embedded. Optional reword:
  "readFileSync without utf8 hands you raw ___?" accept buffer/bytes.

### A10 — LOW · small polish
- 8.3 final step's code pane reverts to the *buggy* code (codeOverride doesn't persist) — add
  `codeOverride: FIXED_CODE` to `where-to-find-it`.
- 9.7 "request **fixture**" — "fixture" is unintroduced jargon; say "a built-in helper called
  request (Playwright's word for it: a fixture — Phase 11 explains why)".
- 9.7 "name the discipline" — 6.7 already whispered "this is API testing, precisely"; acknowledge
  the echo ("6.7 named it once in passing — now it's official") so the fresher doesn't wonder if
  they mis-remember.
- 8.2 dev-dependencies caption: first use of "production" — add "(production = the live site real
  users visit)".

## B. What read WELL as a fresher (keep)
- 9.2's stack-trace three-pass read (what/where/who) — the single best moment of the two phases;
  the 3.6-tower callback lands hard.
- 8.3's bug hunt with the wrong number "caught at its birth line" — evidence-not-guessing sticks.
- 9.3's timeline-first framing dissolves the "why two systems?!" confusion before it forms.
- 8.4 paying off 2.4's old promise explicitly — continuity like this makes the course feel alive.
- 9.8's checkpoint assembling *only* known pieces, with the two classic snags pre-answered and the
  iPad path — zero anxiety.
- All 14 exercises: requirements are WHAT-not-HOW, and every model answer executes to the exact
  expected output (scripted verification).

## C. Recommended batches
- **Batch 1 (glosses & consistency — A1, A2, A3, A5):** ~6 files + phase-intros. Highest fresher value.
- **Batch 2 (viz sync & labels — A4, A6, A7):** 3 files.
- **Batch 3 (rules/quiz/polish — A8, A9, A10):** 6 small edits.

**✅ ALL THREE BATCHES APPLIED (2026-07-05, build green, NOT committed).** A1: CI glossed at first
use (8.2 lockfile badge), re-anchored in 9.2's ci-payoff (with pipeline glossed and deploy →
release), CI keyTerms added to phase-intros [8] and [9]. A2: git glossed via a new badge on 8.2's
node_modules step + caption pointer, "git & the repo" keyTerm in intros [8], repo glossed inline
in 9.4's secrets step. A3: 9.8's hello.js reordered — import now first (8.1's rule kept, caption
says so), highlightLines updated. A4: 9.7 VIEWS realigned — '200' prints on the status step, the
parse lands on the json step, 'Ada'/'no pet' land on the read-safely step, notes shifted to their
captions, new roundup note added (9 ↔ 9 preserved). A5: 9.4 hook reworded (staging glossed, smoke
tests dropped). A6: "line 12 appeared" → "that's how line 12 got there". A7: 9.6 labels shortened
('STUCK: readFileSync', '🌐 page.click()'). A8: mustUse widened in 9.2 (===0|!==0|>0), 9.8
(+if(disk[), 8.6 (+charAt(0)). A9: 9.6 quiz accepts A,B,C/abc variants; 9.5 Q1 rewritten as the
buffer question. A10: 8.3 final step keeps FIXED_CODE; 9.7 fixture reworded as "a built-in helper
called request" with the fixture word flagged; 6.7 echo acknowledged in name-the-discipline;
production glossed in 8.2. Verified: build green, steps↔views all OK, all 14 exercise model
answers re-executed and pass.
