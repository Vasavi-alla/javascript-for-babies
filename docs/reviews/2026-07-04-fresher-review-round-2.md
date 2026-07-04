# Fresher read-through, round 2 — full curriculum (Phases 0–7, all 76 lessons)

**Date:** 2026-07-04 · **Method:** role-played a zero-experience learner reading every lesson surface in order — hook, every stepper caption *cross-checked against the visualization code for that step*, Under the Hood, every quiz (questions + why-texts), teach-back prompts + model answers, recaps, and code exercises. Then re-read findings with a teacher/UX-designer hat to propose fixes.

**Overall verdict:** the curriculum is in genuinely strong shape — the last rounds of fixes (density split, stepper expansion, depth lessons 4.2/4.5, the 4.6 reassign act, jargon glosses) all landed. Phases 5 and 6 are the best-taught material in the app. What remains is mostly **one dead-feature hangover (the removed prediction system), one deferred structural gap (HTML tag vocabulary), and a handful of small desyncs/staleness** — plus a set of polish ideas. Nothing found suggests a learner would *stay* confused about a concept; several places would make them briefly think the app is broken.

---

## A. Cross-cutting findings (ordered by severity)

### A1. 🔴 HIGH — Lesson 0.2 asks its central question and never answers it (dead prediction)
- Step `predict-where` caption: *"Here's the question that confuses almost every beginner. Think carefully before answering."* → **nothing follows.** The prediction UI was removed engine-wide (`engine/stepper/types.ts:28`), so the question ("where does your JavaScript actually run?") and its answer (**on the visitor's machine, in their browser — a million visitors = a million computers**) are invisible.
- That fact is now taught **nowhere** in 0.2 — not steps, not Under the Hood, not quiz — yet the teach-back asks exactly it ("where does JavaScript actually run when someone visits a website?"). A fresher literally cannot answer from the lesson.
- **Fix:** replace the step with two real steps — one that *asks* the question in the caption, the next that *answers* it, with a small viz beat (code file traveling from "your laptop" to "friend's browser," engine badge running it there). This is also the lesson's best possible visualization moment.

### A2. 🟠 MED — Orphaned "Predict…" captions across Phases 0–3 (systemic; 27 files still carry dead `prediction` data)
Captions still command an interaction that no longer exists. Where the **next step answers the question explicitly**, the beat works as rhetoric (most cases: 0.1, 0.3, 0.4, 1.1–1.11, 2.1, 2.5, 3.3–3.5). But:
- **2.3 `predict-order`** — *"Suppose grade were 95. Walk the gates before answering."* The answer (only "A" prints; flip the order and everything ≥70 prints "C"; **order IS the logic**) was in the dead prediction and is never stated in any visible step; the next caption switches to `switch`. A fresher who silently guessed "A, B and C" is never corrected. → Add the answer as the next step's opening sentence.
- **2.6 `predict-checks`** — caption literally ends with a colon pointing at nothing: *"Here's the counting question that separates readers from tracers:"*. → Ask the question in the caption ("The body runs 5 times — how many times does the CHECK run?") and open the next caption with "Six — five yeses and one final no. Checks = laps + 1."
- **0.5 `predict-done`** — asks *why* "Done" never printed; the why (error halts, line 3 never reached) lands only in quiz/recap, not in the stepper. → One added sentence in the `fixed` caption.
- **Wording sweep for the rest:** phrases like "Predict.", "Commit to a prediction.", "predict before you continue" imply a button that doesn't exist ("am I missing something?"). Reword to plain questions ("…what happens next?") — the question→next-step-answers pattern already used in 1.1/3.3 is the house style that works.
- **Bigger option worth considering:** the prediction beats were pedagogically good. If ever revisited, they could return as optional *typed* micro-checks between steps (consistent with "type, don't recognize") rather than MCQs. Not urgent; the caption sweep is.

### A3. 🟠 MED — 2.7: the stepper spoils its own prediction
At step `predict-continue` ("Predict the console"), the viz already renders continue-mode **with the answer on screen**: the console line `1 2 4 5` and the "skip THIS lap only" label. The thinking beat is dead on arrival.
**Fix:** at that step render the track in a neutral pre-run state (chips uncolored, console line hidden); reveal the skip + console on the next step.

### A4. 🟠 MED — Teach-back model answers cite fun facts that were removed from their lessons
- **2.6** model answer ends: *"Fun fact: counters are called i because FORTRAN made I-through-N variables integers in 1957…"* — this fact was deliberately removed from 2.6 per the fun-fact rule.
- **2.7** model answer ends: *"…after Dijkstra's famous 1968 letter 'Go To Statement Considered Harmful.'"* — same (trimmed from the lesson body).
- Learners compare their explanation against a model that references material they never saw — reads as "was I supposed to know that?"
- Verified the rest of the app: only these two are stale (2.1's branch-prediction and 2.5's Halting Problem model-answer mentions are still taught in their lessons).
- **Fix:** delete those two sentences from the model answers.

### A5. 🟠 MED — Stale cross-references from the Phase 4 renumbering + one literal placeholder
- `lesson49.tsx` (`non-mutating` caption): *"unlike push/pop/shift (4.2)"* → should be **(4.3)** (4.2 is now memory/O(1)).
- `lesson48.tsx` (Under the Hood): *"an arrow (4.4 forever)"* → the arrow/reference lesson is **4.6** (4.4 is Objects). The other "4.4" refs in 4.8 (dynamic keys) are correct.
- `lesson414.tsx` (`filter-failures` caption): **"(lesson 2.x's NOT, still earning)"** — a literal unfilled `2.x` placeholder shown to the learner. The `!` operator was taught in **1.10**.
- **Round-2.1 addition — four stale PHASE numbers from the Node.js insertion (9→10→11 shift; only 7.9 was fixed previously):**
  - `phase0/lesson02.tsx:210` — Playwright's commands-browsers-from-outside architecture: *"You'll see that architecture again in Phase 10"* → **Phase 11**.
  - `phase1/lesson15.tsx:262` — *"an assertion called toBeCloseTo, which you'll use in Phase 9"* → **Phase 10** (Vitest).
  - `phase2/lesson28.tsx:262` — *"a name you'll meet formally in Phase 9: boundary testing"* → **Phase 10**.
  - `phase3/lesson311.tsx:245` — *"In Phase 9 you'll write precisely that with Vitest"* → **Phase 10**.
- All other Phase 8–11 references verified correct against the registry, and every forward **lesson** number (9.6, 9.7, 10.5, 11.3, 11.5, 11.7, 11.8) verified against `01-CURRICULUM.md`'s phase tables. Full grep of every `N.M` cross-reference in Phases 4–7 confirms everything else is correct.

### A6. 🟠 MED — F12/DevTools instructions vs iPad (a primary device)
0.3's Under the Hood ("press **F12** … Console tab"), 1.11's graduation ("Press F12 in this very browser"), 2.8's graduation, and 4.13's fun fact ("Open DevTools → Application → Local Storage") all assume a keyboard browser. iPad Safari has no DevTools — on the project's own primary device the "real graduation" steps are impossible as written.
**Fix:** add "(on a computer)" + an iPad-friendly alternative sentence, e.g. "On iPad, use the built-in Try-console above; on a laptop, press F12."

### A7. 🟡 MED-LOW — The deferred Phase 7 gap, scoped precisely: HTML *tag vocabulary* is never taught
The earlier fix (HTML/CSS primer in the Phase 7 intro + keyTerms) covers the *concepts* well: tag, attribute, CSS-as-look-language. What's still missing is the **vocabulary of the actual tags** every Phase 7 code sample uses: `body`, `h1`, `ul`, `li`, `p`, `button`, `input`, `form`, `nav`, `a`. 7.1's very first sample is `<h1>My List</h1>` + `<ul id="items">` + two `<li>` — a fresher can follow the tree mechanics but silently wonders what "ul" or "li" *mean* on every sample for nine lessons.
**Recommended fix (small, no new lesson needed):**
1. One gloss caption beat in 7.1 step `parse` or `element-nodes`: "the tag names are just abbreviations — h1 = the top heading, ul = an Unordered (bulleted) List, li = a List Item inside it, p = a paragraph."
2. Add a "the 10 tags you'll keep seeing" mini-glossary to the Phase 7 intro keyTerms (or a sticky-note card on the phase page): body, h1–h3, p, ul/li, a, button, input, form, div/span ("the plain boxes").
3. CSS needs nothing more — 7.2 teaches selectors from scratch and 7.8 explains `display:none` in place.
(The alternative — a full 7.0 HTML primer lesson — is defensible but heavier; the glosses close ~90 % of the gap.)

### A8. 🟡 LOW — "Frozen picture" steps in Phases 0–4 (the badge fix was never backported)
Phase 5–7 lessons have the `badge?` annotation so elaboration-only steps always show something appearing. Phases 0–4 predate it; these steps add a new fact with zero visual change (the "nothing happens on next-click" feel):
1.8 `roundup-safe` · 2.1 `else-optional` · 2.2 `wrap-explicit` + `wrap-precision` · 2.3 `rule` + `rule-break-discipline` · 2.4 `taste` · 2.7 `grid-scope` · 3.10 `wrap` · 4.1 `length-offbyone` + `write-const-tease` · 4.4 `bracket-dynamic-why` · 4.12 `set-pattern` + `map-vs-object`.
**Fix:** backport the badge pattern to these ~13 steps (small per-lesson View additions).

### A9. 🟡 LOW — 2.2 falsy-six reveal desync
Captions split the six falsy values into two steps ("First three: false, 0, ''…" then "The other three…"), but the viz shows **all six chips at once** on the first step. Stagger the chips 3 + 3 to match the narration.

### A10. 🟠 MED — 1.4's const "fine print" teaches a distinction the learner cannot ground yet *(user-flagged)*
- Under the Hood: *"const welds the label to the box — it does not weld the box shut… in Phase 4, when boxes start holding arrows to bigger things, you'll see that a const arrow can still point at a thing whose insides change. File that away."*
- The paragraph needs three not-yet-taught ideas to parse (changing "in place", arrows/references, values-with-insides), and in Phase 1 the learner cannot construct a single example where the two welds differ — for every value they know, the distinction is invisible. "You'll understand later" asks a beginner to carry an unresolved puzzle; careful learners loop on it instead of filing it. It also half-spoils the deliberately planted "const but mutated?!" mystery (4.1/4.3 → resolved by 4.6, where the same sentence lands perfectly because the arrow is on screen).
- **Fix — flag, don't teach:** keep the honesty as a pure promissory note: *"For every value you know so far (numbers, strings, booleans), const truly freezes things — that's the whole story today. In Phase 4 you'll meet bigger values where const has one surprising piece of fine print; we'll open it exactly when you can watch it happen (lesson 4.6)."* Let 4.6 keep owning the label-vs-contents mechanics. (Optional, lower priority: 1.2's parallel disclosure could drop its "holds an arrow" clause the same way — though it poses no puzzle, so it's less urgent.)
- **General rule for every "file that away" note in the app:** flag the existence of fine print, name the payoff lesson, and borrow 1.10's best-in-app framing ("a preview, not homework") — never introduce mechanics that need future concepts to parse.

### A11. 🟡 MED-LOW — the string "train" metaphor wobbles in two places *(user-flagged)*
- What works: order, per-car position numbers, last car = length − 1, gluing with `+` — the metaphor carries all of 1.6's checks fine.
- Wobble 1 — **immutability fights the vehicle**: re-coupling and swapping cars is what real trains are *for*, yet strings forbid exactly that; and "gluing two trains" leaves both originals intact, which no physical train does. The lesson states the rule ("you can't swap car 0") but never admits the metaphor just ended.
- Wobble 2 — **three pictures for one idea**: memory = wall of boxes (0.4), strings = train cars (1.6), arrays = shelf cells (4.1), while 1.6 itself promises indexing "works identically for arrays." Same concept, three costumes — invites the learner to hunt for a difference that doesn't exist.
- **Fixes (cheap):** (a) draw the train's cars in the same row-of-numbered-cells visual style as the memory wall and the array shelf so the three rhyme; (b) add one metaphor-boundary sentence to the immutability paragraph: *"here the train picture ends — unlike a real train, you can never swap or uncouple a car; every 'change' manufactures a brand-new train."*
- **New convention worth adopting app-wide:** the app already says when a *simplification* is 90 % true (1.2); it should equally say when a *metaphor* ends. One "here the picture ends" line at each metaphor's breaking point.

### A12. 🟡 Round-2.1 full sweep of the two new classes (all 76 lessons) — three more fixes, rest verified clear
Swept every forward-reference phrase ("file that away", "hold that thought", "preview", "properly meet", "fine print", "fully clicks"…) and every sustained metaphor for unacknowledged breaking points.

**New fixes:**
- **1.7 Under the Hood (LOW)** — *"One preview for lesson 1.9: `null == undefined` is true, but `null === undefined` is false…"* shows the `==`/`===` symbols two lessons before 1.9 teaches them — immediately after 1.3 spent a whole lesson establishing that `=` is not "equals." A fresher stares at two-and-three equals signs with no anchor. **Fix — gloss before symbols:** *"One preview for lesson 1.9, where you'll meet JavaScript's two ways of asking 'are these equal?': the loose way (written `==`) considers the two nothings equal; the strict way (`===`) knows better."*
- **3.5 TDZ fun fact (LOW-MED)** — *"the zone between entering a block and reaching a `let` line — where the variable exists but may not be touched yet"* asserts the variable **exists before its line** — that's 5.1's pass-1 registration mechanic, unteachable here, and it quietly contradicts 3.5's own model (variables are born at their `let`, live in their bubble). Same family as A10. **Fix — describe the observable behavior, not the hidden mechanism:** *"the stretch of code above a `let` line — where using the name throws an error — is officially called the Temporal Dead Zone."* (The recap's phrasing, "the region before a let line," is already fine.)
- **2.2 Boolean-izer funnel (LOW-MED, metaphor boundary)** — the funnel picture implies the value is consumed/transformed ("drops the value through this funnel and out comes true or false"), and no step says the original is untouched — a learner can believe `if (username)` *converts* username to false. **Fix:** one clause on the `else` step: *"(the funnel only reads the value to answer the question — username itself is untouched, still `""`)."*
- **3.8 (optional polish)** — *"the parameter action simply holds a reference to the same function value"*: swap "holds a reference to" for "points at" and the sentence uses only taught vocabulary; keep "Phase 4 makes this exact."

**Checked and verified clear (no change needed):**
- 3.4's function-is-an-object footnote (plain-words gloss "a bundle of stuff that happens to be runnable" + self-limiting "keep this footnote for then") · 5.8's async-error foreshadowing (labeled, learner advanced) · 4.12's WeakMap/GC clause (GC plain-worded since 0.4/1.3, references taught by then) · 0.4's garbage-collector janitor · 2.5's single-threaded gloss (teach-with-gloss, needed in the moment) · 6.3's promise-shape preview (N+1, self-contained) · 1.10's `&&`/`||` note (the "preview, not homework" model) · 1.8 TypeScript / 1.9 ESLint / 2.4 `?.` flags.
- Metaphors verified sound: **3.7 backpack** (its breaking point — backpacks hold copies — is explicitly countered: "It doesn't copy count; it keeps the living variable itself", and 5.3 formally retires it) · **6.4 receipt** (bridges to pending/fulfilled/rejected immediately; settled/resolved naming note included) · **1.2 boxes** (the 90%-true disclosure is the house model) · **3.1→3.3 machine** (3.3 explicitly reframes greet's output as the window, not the chute) · 4.1 shelf / 4.4 locker / 4.5 cloakroom / 5.3 rope / 5.7 broom / 5.8 spark-net / 6.6 shelf / 6.8 lanes — all bridge to real terms with no contradiction points found.

---

## B. Small per-lesson polish (all LOW)

| Lesson | Issue | Suggested fix |
|---|---|---|
| 1.5 `line` caption | "The operators you know — plus **two new friends** coming up" — only `%` is new; the count confuses | "…plus one operator nobody learned in school" |
| 1.6 hook | "lengths, positions and **slicing** all become obvious" — slicing undefined until Under the Hood | say "cutting pieces out" or gloss |
| 3.7 Under the Hood | "keeps that variable alive **on the heap**" — heap is undefined until 4.6 | add "(a longer-lived area of memory — Phase 4 draws it properly)" |
| 3.7 `wrap` caption | name-drops "React hooks" — meaningless to the learner | "…event handlers, Playwright helpers — all backpacks" |
| 3.10 `REST_CODE` | sample uses `numbers.reduce((total, n) => total + n, 0)` — visibly more advanced than anything taught (deferred to 4.9 in a parenthesis) | consider a `for...of` sum in the sample and let 4.9 own reduce |
| 5.6 hook + Phase-5 intro | "desugar" used unglossed | one parenthetical: "(desugar = take the sugar-coating off and show the plain machinery)" |
| 2.8 (idea) | the gate-order trap — the lesson's whole point — is never *visualized*; the viz walks only the correct corridor | add one step showing the RE-ORDERED corridor grabbing 15 at the %3 gate: "Fizz ✓ — the %15 gate below is never consulted: dead code." Strongest possible use of the medium here |

---

## C. What is working exceptionally well (keep, and use as templates)

- **Promise-and-payoff threading** is the app's superpower: 3.2 plants "fresh slots… hold that thought" → 3.7 pays it off; 4.1/4.3 plant the const-mutation mystery → 4.6 resolves it; 6.1 ends on a cliffhanger → 6.2 opens on it. Learners feel the curriculum *remembering itself*. New lessons should keep doing this.
- **3.3's window-vs-chute** (return vs console.log) is the best single explanation in the app; 1.2/1.3 (three acts, evaluation bubble), 4.6 (two acts + reassign), 5.9 (answer-by-simulation), 6.2 (the machine), 6.6 (the shelf) are all model lessons.
- **The "build the tool yourself" exercises** in Phases 5–7 — a ten-line test runner (5.9), a selector engine (7.2), an event emitter (7.4), a localStorage model (7.7), classList.toggle (7.3) — are the strongest teach-to-understand devices in the curriculum. Consider retrofitting one or two earlier (e.g., Phase 2 could build a tiny `fizzbuzz(n)` function machine before 3.1 formalizes functions).
- **Career bridges** land in every phase without feeling forced ("expect() throws, runners catch"; storageState; auto-waiting motivated twice). The Playwright endgame is visible from Phase 0 — exactly the motivation-before-mechanism rule.
- **Fun facts** now consistently carry everyday hooks (hotel rooms, cloakrooms, housekeeping mark-and-sweep, photo-app map/filter/reduce). The two stale leftovers are only in model answers (A4).
- **Metaphor weaning** is respected: Phase 5–7 lead with real terms and bridge metaphors briefly (receipt, shelf, rope) exactly per the standing rule.

---

## D. Prioritized action list

**Batch 1 — text-only quick fixes (~1 session): ✅ APPLIED 2026-07-04 (all items below incl. 5b/5c/5d; `npm run build` green; 0.2 gained ask+answer steps with a small viz beat, 2.3 gained an answer step with shifted viz thresholds — spot-check those two in the browser first). Not yet committed.**
1. A1: rebuild 0.2's dead step into ask-then-answer steps (+ tiny viz beat).
2. A2: 2.3 + 2.6 answer-the-question fixes; 0.5 one sentence; caption-wording sweep over the remaining orphaned "Predict…" imperatives.
3. A4: delete the two stale model-answer fun-fact sentences (2.6, 2.7).
4. A5: fix `(4.2)`→`(4.3)` in 4.9, `(4.4 forever)`→`(4.6 forever)` in 4.8, `2.x`→`1.10` in 4.14.
5. B-table glosses (1.5, 1.6, 3.7×2, 5.6) + A6 iPad sentences.
5b. A10: reword 1.4's const fine print to the flag-don't-teach version; A11(b): the one metaphor-boundary sentence in 1.6's immutability paragraph.
5c. A5 round-2.1 phase numbers: 0.2 "Phase 10"→11, 1.5 "Phase 9"→10, 2.8 "Phase 9"→10, 3.11 "Phase 9"→10.
5d. A12: 1.7 gloss-before-symbols reword, 3.5 TDZ fun-fact reword (behavior, not mechanism), 2.2 funnel "value untouched" clause, optional 3.8 "points at" swap.

**Batch 2 — small code changes: ✅ APPLIED 2026-07-04 (build green). Note: 2.7's predict step got its question back — the viz now shows a neutral "pending" track (no printed labels, console: ?, "i === 3 → continue… then what?") and the next step reveals 1 2 4 5.**
6. A3: 2.7 neutral viz at the prediction step.
7. A9: 2.2 stagger the falsy chips.
8. A7: 7.1 tag-gloss caption + Phase-7 intro tag mini-glossary.
8b. A11(a): restyle 1.6's train cars as the same numbered-cell row used by the memory wall (0.4) and array shelf (4.1), so all three index pictures rhyme.

**Batch 3 — mechanical but broader: ✅ APPLIED 2026-07-04 (build green). Badges added to 12 frozen steps (1.8, 2.1, 2.2×2, 2.3×2, 2.4, 2.7, 3.10, 4.1×2, 4.4); 4.12 was verified NOT frozen (its per-step `note` field already changes every step) and was skipped. 2.8 gained the mis-ordered-corridor step: at step 5 the gates physically reorder (%3 first), 15 gets grabbed → "Fizz", and the %15 gate is labeled "never consulted: dead code, forever". Steps 8 ↔ WALK 8 verified.**
9. A8: backport `badge?` to the ~13 frozen steps in Phases 0–4.
10. B/2.8: the mis-ordered-corridor visualization step.

*(Also: once Phase 8+ is built, wire the same read-through against 7.9's closing pointers — it currently promises Phase 8 = tooling, Phase 9 = Node, Phase 10 = testing, Phase 11 = Playwright, which matches the registry.)*

---

## F. Round 2.2 — "watch it happen" completeness audit (user-requested: more slides, more explanation)

**Method:** scripted census of all 76 steppers (step count + words per caption; >55 words ≈ 2–3 bundled ideas) cross-checked against the full content read. The Phase 5–7 expansion (2026-07-04) set the working beginner bar: **7–12 steps, one fact per step.** Phases 0–4 never got that pass — and the data shows exactly where they fall short.

### The census verdict
- **Phases 5–7: healthy.** 8–12 steps everywhere, isolated long captions only (5.4's table rows are legitimately caption-heavy; checkpoints 5.9/7.9 are synthesis).
- **Phase 4 is the worst offender** — the depth-content lessons were written dense: 4.2 has SIX steps carrying five 55+-word captions (max 92 words in one step!); 4.6 (the phase hero) has six long captions in 8 steps; 4.11 five; 4.3/4.7/4.14 sit at 5 steps; 4.5/4.10 at 6 with long captions.
- **Phase 3's middle** bundles heavily: 3.3 (the return hero, max 64w), 3.4 (max 72w), 3.5 (3 long) — all at 6–7 steps; 3.6/3.8/3.11 at 6 steps.
- **Phase 1's foundation** is under-stepped rather than dense: 1.1, 1.3, 1.6, 1.7 at 6 steps; checkpoint 1.11 at just 4; 0.3 at 6.

### Expansion plan, per lesson (proposed new slides in step order)

**Tier 1 — Phase 4 (dense captions → split; ~needs 6→9–13 steps):**
- **4.2 (6→~10):** split `arithmetic` (92w) into ① the formula fires ② "an index IS a distance" ③ why 0-based falls out of it; split `o1` into ① same math at any size ② the O(1)/O(n) graph read slowly; split `bounds` into ① the bounds check → undefined ② the write-past-the-end aside.
- **4.6 (8→~13):** split `copy-arrow` into ① what = copies ② "count the objects: still ONE"; `aliasing` into ① the bug in daylight ② the const-mystery resolution; `call-by-value` into ① fresh slot gets a copy ② n changed, lives didn't; `call-by-sharing` into ① arrow copy arrives ② mutation reaches the caller; `reassign-param` into ① build+repoint local ② caller's arrow never moved.
- **4.11 (8→~12):** split `mirror` (stencil metaphor / keys-do-the-matching), `sugar` (the two commented lines / 4.6-rules-apply), `array-pattern` (position-matching / the hole), `options-object` (the problem: positional-arg memory test / the pattern), `spread` (direction rule / shallow warning).
- **4.3 (5→~8):** new step for pop/shift **return-value** contrast (currently squeezed into captions); split `shift` into ① remove+return ② watch everyone slide (the O(n) bill); give `unshift` its slide-right beat its own step.
- **4.10 (6→~9):** split `comparator` (74w) into ① the fix ② the sign contract ③ sort MUTATES → spread-copy trick; split `every` (assert framing separate).
- **4.5 (6→~9):** split `hash` (fast/deterministic as two beats), `bucket` (number→bucket / re-run on read), `collision` (what collides / why still O(1)).
- **4.7 (5→~8):** split `spread` into ① new top box ② === compares addresses → {} !== {}; split `betrayal` into ① shared inner write ② structuredClone rebuilds every layer.
- **4.4 (8→~10):** split `bracket-dynamic` (70w) into ① the runtime-key scenario ② the greetings[lang] walk; `create` (58w) optional split.
- **4.14 (5→7):** split `filter-failures` and `dashboard` (checkpoint, but captions carry new mechanics).
- 4.8 minor: split `entries`.

**Tier 2 — Phase 3 (~6→8–10 steps):**
- **3.3 (6→~10):** split `travel-back` (64w) into ① return fires: machine STOPS ② the value travels back ③ it REPLACES the call; split `use-it` into ① now it's just arithmetic ② calls compose anywhere a value goes; split `sealed` into ① the sealed chute ② window ≠ chute.
- **3.4 (6→~9):** split `expression` (72w) into ① RHS produces a MACHINE as a value ② stored under the label, no own name; give arrow auto-return its own beat; split `reveal-typeof` (certificate / permission slip).
- **3.5 (7→~10):** split `bubbles` (braces blow bubbles / vars live where declared), `lookup-inner` (fuel found local / ship one wall out), `lookup-far` (bubble POPPED / two-wall ray).
- **3.6 (6→8):** add a "return address written on the card" beat and a LIFO/plates beat (currently prose-only).
- **3.8 (6→8):** add the **cheer() crash case as a watched step** (currently only in UTH/quiz — it's the lesson's biggest gotcha); split `definitions` (socket promise / repeat's contract).
- 3.11 (6→7, optional): a stack-frames beat during the relay.

**Tier 3 — Phase 0–1 foundation (6→7–9 steps):**
- **1.6 (6→~9):** add an **immutability slide** — watch `toUpperCase()` build a brand-new train while "Ada" survives (currently UTH-only, and it's the lesson's most bug-saving fact); split `template` (backticks+slots / evaluate-first inside the slot).
- **1.7 (6→8):** add the **typeof-null gotcha as a watched step** (famous, currently UTH-only) and a side-by-side "two nothings" comparison beat.
- **1.1 (6→8):** add "the type decides what you're ALLOWED to do" beat (multiply numbers ✓ / multiply sentences ✗) and a "there are more pens coming" roundup beat.
- **1.3 (6→7):** split `weird-line` (= is an instruction / read it as "gets").
- **0.3 (6→7):** add a closing "this was your first two-way conversation" beat bridging to the TryConsole below.
- **1.11 (4→6):** checkpoint is unusually thin vs 2.8's 8 — add a per-slot template walk beat and the `"9000"+1` coercion-trap beat (currently quiz-only).
- 1.9 (7→8): split `minus-math` (63w — operand gloss deserves its own beat). 1.10 (8→9): split `precedence` (14-not-20 / parens redraw). 0.5: split the new answer+ritual caption. 2.4: split `taste`. 2.7: split `nested` (clock metaphor / grid walk).

**Phase 5–7 stragglers (optional polish):** 7.3 split `classlist` toolkit and `innerhtml-danger`; 7.5 split `delegation` (definition / matches+closest tools); 5.3 split `the-outer-link`.

### Recommended execution
Mirror the proven Phase 5–7 flow: **pilot 4.2 + 3.3** (worst density + a hero lesson), user verifies in browser, then roll out **Phase 4 → Phase 3 → Phase 1/0 → minor tier**, one phase per session, verifying `VIEWS.length === steps.length` + build per file. Every split must add a matching VIEWS/SCENES entry (or badge) so no step shows a frozen picture.

**✅ EXECUTED IN FULL, 2026-07-04 (user waived the pilot).** 27 lessons expanded per the plan above (see 05-PROGRESS.md for the per-lesson step counts); every split got its own view state; scripted verification passes for all lessons; build green. Bonus: the work surfaced and fixed four pre-existing silent bugs — 4.8 (8 steps/9 views), 4.12 (9 steps/8 views), and missing per-step `codeOverride` in 4.6 (`call-by-sharing`) and 4.11 (`rest`, `spread`) which had been showing the wrong code pane, since `codeOverride` does not persist across steps. Also in this round: the SVG text-overflow fix (`WrapTspans` + 66 codemodded sites + ~20 literals — see 05-PROGRESS.md). Not committed.
