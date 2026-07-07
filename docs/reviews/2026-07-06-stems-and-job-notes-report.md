# Quiz-Stem Clarity + "On the job" Section — Before/After Report

Tracks every quiz-stem reword (Quiz-Stem Contract) and every 💼 job-note migration (Note
Migration Procedure) from `docs/superpowers/plans/2026-07-06-quiz-stems-and-on-the-job-section.md`.

| lesson | surface | before | after |
|---|---|---|---|
| 2.1 | onTheJob (was UTH 💼 note) | `<strong>💼 On the job —</strong> test code is <em>full</em> of forks: "if the element is visible, click it; else fail with a screenshot." More importantly, <strong>every bug report you will ever write is a story about a branch</strong>. You expected the true road; the program took the false one. Pointing at the exact fork — and the exact boolean that misfired — separates "it's broken" from a bug report developers love.` | New `onTheJob` section: `ChatBubble` bug report ("The login button does nothing on iPad. I expected the success flow (the happy path, where everything works)…") + developer reply + `Takeaway`: "Every bug report you will ever write is **a story about a branch**. Name the fork. Name the boolean." |
| 2.2 | onTheJob (was UTH 💼 note) | `<strong>💼 On the job —</strong> truthy/falsy bugs are <em>silent</em>. A form that checks if (quantity) treats a legitimate quantity of 0 as "missing"...` | New `onTheJob` section: `AppMoment` (quantity field = 0, wrong "please enter a quantity" warning) + `ReviewCard` (`if (quantity) { addToCart(); }` annotated "0 is falsy") + `Takeaway`: "No error. No crash… **That is the falsy list. You own it now.**" |
| 2.3 | onTheJob (was UTH 💼 note) | `<strong>💼 On the job —</strong> chains of else-if handling <em>ranges</em> (like our grades) appear constantly in test logic. "Status 2xx → pass, 4xx → client error, 5xx → server error" is a textbook chain...` | New `onTheJob` section: `ReviewCard` (grades.js, dead gate annotated) + reviewer `ChatBubble` ("Every score above 40 stops at gate one…") + `Takeaway`: "Reviewers catch dead gates fast. **Phase 10 makes reviewing part of your job.**" |
| 2.3 | quiz Q1 stem | `For how many values of n can bigPrize() ever run? Type the number.` | `n can be any number. How many of them make bigPrize() run? Type the count — 0 if none.` (placeholder `a number…` → `how many…`) |
| 2.3 | quiz Q2 stem | `x is "a" — and notice the first case has NO break. How many numbers print? Type it.` | `x is "a". How many numbers print? Type the count.` |
| 2.6 | onTheJob (was UTH 💼 note) | `<strong>💼 On the job —</strong> for loops drive data-driven tests: "for each of these 50 usernames, run the login test". One body, fifty laps. And the counter tells you exactly which lap failed.` | New `onTheJob` section: `TestRunCard` (50 usernames, ✗ at user 24) + caption "the counter names the failing lap: i = 24" + `Takeaway`: "One body, fifty laps. **The counter tells you exactly which lap failed.** Phase 11 gives this pattern its real name: data-driven testing." |
| 2.4 | onTheJob (was UTH job-flavored aside, unbadged) | `In test code you'll constantly read patterns like config.timeout ?? 30000 ("use the configured timeout, defaulting to 30 seconds") and element && element.click() — and now they read like sentences.` | New `onTheJob` section: `ReviewCard` (`login.spec.js`, two lines: `config.timeout ?? 30000` and `element && element.click()`) + `Takeaway`: "Real test code reads like **short sentences once you know ?? and &&**." |
| 3.1 | onTheJob (was UTH job-flavored closing sentence, unbadged, split from a mechanism paragraph) | Full paragraph: `Inside there's no real belt, of course. What actually happens: the engine saves the body's lines in memory... A call makes the engine jump to the saved lines, run them top to bottom, and jump back to where the call was. That's the entire trick — and every Playwright line you'll write someday, page.click(), expect(), is pressing GO on a machine someone else built.` | UTH keeps the mechanism sentences (engine saves body in memory, jump/run/jump back) — genuine Under-the-Hood depth, not job content. New `onTheJob` section takes only the closing sentence: `ReviewCard` (`login.spec.js`, `page.click()` / `expect()` calls annotated "a call: press GO on saved code") + `Takeaway`: "You did not write page.click() or expect(). You called them. Every line like this is **pressing GO on a machine someone else built**." |
| 3.3 | onTheJob (was UTH job-flavored paragraph, unbadged) | `This idea is the heart of your future job. A test line like expect(getTotal()).toBe(42) means "run getTotal, take what it hands back, check it's 42" — which only works if getTotal returns its answer. A function that only prints its answer can't be tested this way: the text went to the screen, and no program can read the screen.` | New `onTheJob` section: `ReviewCard` (`cart.spec.js`, `expect(getTotal()).toBe(42);`) + `Takeaway`: "This works only if **getTotal returns its answer**. A function that only prints its answer cannot be tested this way. The text went to the screen. No program can read the screen." |

## Scope note: unbadged job-flavored asides

2.4's UTH held a job-flavored aside that was never marked with the `💼` badge, so the plan's
grep-built inventory (exactly 59 badged paragraphs) never counted it. User decision
(2026-07-07): migrate it now, and treat the plan's "59" as a floor rather than an exact
count — during Tasks 6–11, watch each phase's UTH for similar unbadged job-style prose (not
just the badged notes) and migrate any found, logging them here. Task 12's final "59" grep
check will need to report the actual total instead of asserting exactly 59.

3.1 added a variant of this pattern: a single UTH paragraph mixing genuine mechanism
explanation (how a function call actually works in memory) with a job-flavored closing
sentence. Rather than moving the whole paragraph, only the job-flavored sentence migrated;
the mechanism sentences stay in Under the Hood untouched, since they are depth content, not
job content. Watch for more mixed paragraphs like this in later batches — split, don't
relocate whole paragraphs when only part is job-flavored.

## Verification (Task 5)

- `node scripts/lint-uth.mjs` → `UTH lint: clean`
- `npm run build` → `✓ built in …` (green)

## Task 6 — Phases 0–2 stem audit + Phase 0–1 note migrations

### Stem audit (phases 0, 1, 2)

Every quiz question in phases 0–2 (~52 questions beyond 2.3's already-fixed two) was checked
against the Quiz-Stem Contract, cross-referencing each stem's accompanying `code` field (not
just the question text, since many typed checks lean on a visible concrete-value code block
for their situation). Result: **zero new failures.** All other stems in phases 0–2 use
concrete literal values in their code (unlike 2.3's parametric `n`), so "type what X
prints/evaluates to" phrasing is already self-contained, and none contain a trick-pointer
("notice…", "hint:"). No rewords needed in this batch.

### Note migrations (0.5, 1.6, 1.7, 1.8, 1.9, 1.10)

| lesson | surface | before | after |
|---|---|---|---|
| 0.5 | onTheJob (was UTH 💼 note) | `<strong>💼 On the job —</strong> your work includes making software fail on purpose and reading what it says. A tester who reads error messages calmly and precisely is rare and valuable.` (preceded by "keep this framing forever: errors are evidence, not verdicts.", same paragraph) | New `onTheJob` section: `AppMoment` showing `ReferenceError: userName is not defined.` (the lesson's own example) + `Takeaway`: "Your job includes making software fail on purpose, then reading what it says. Do it calmly and precisely: that skill is rare and valuable. **Errors are evidence, not verdicts.**" |
| 1.6 | onTheJob (was UTH 💼 note) | ``<strong>💼 On the job —</strong> for an automation tester this is everyday work: `Expected ${expected} but got ${actual}` is the shape of every good failure message.`` | New `onTheJob` section: `TestRunCard` (a failed login test printing `Expected "Welcome" but got "Error"`) + `Takeaway`: "Template strings build that exact sentence: `` `Expected ${expected} but got ${actual}` ``. **That is the shape of every good failure message.**" |
| 1.7 | onTheJob (was UTH 💼 note, **vocabulary rebuild**) | `<strong>💼 On the job —</strong> API responses are full of nulls. "middleName": null means the field exists and is deliberately empty. undefined usually means the field is missing entirely. "Empty on purpose" and "forgot to include it" are different bugs, with different fixes. Your future assertions will distinguish the two constantly.` | New `onTheJob` section, rebuilt without "API" (untaught until 4.13/6.7) and "assertions" (untaught until Phase 10): `AppMoment` showing `middleName = null` / `nickname = undefined` (plain "saved profile data", no JSON syntax) + `Takeaway`: "null means the person left middleName empty on purpose. undefined means nickname was never even created. **"Empty on purpose" and "forgot to include it" are different bugs.** Your future checks will tell them apart constantly." (checks replaces assertions) |
| 1.8 | onTheJob (was UTH 💼 note) | `<strong>💼 On the job —</strong> why should a tester care about dynamic typing? Because it is a bug factory. Nothing stops a variable that held a number from silently becoming a string... Entire categories of production bugs boil down to "this value was not the type everyone assumed." Many of your future test cases target exactly that.` | New `onTheJob` section (dropped "production", kept the fact plainly): `ReviewCard` (`cart.js`, `let total = "10"; console.log(total + 1);` annotated "prints \"101\", not 11") + `Takeaway`: "Nothing stops a variable that held a number from silently becoming a string. **Many of your future test cases exist to catch exactly this.**" |
| 1.9 | onTheJob (was UTH 💼 note) | ``<strong>💼 On the job —</strong> this one will bite you as an automation tester: everything typed into a form arrives as a string. So age + 1, where age came from an input field, is "25" + 1 → "251" — a birthday bug, silently.`` | New `onTheJob` section: `AppMoment` (age field holding `"25"`, annotated `age + 1 → "251", not 26`) + `Takeaway`: "Everything typed into a form arrives as a string. **"25" + 1 glues into "251" instead of adding to 26.** A birthday bug, silently." |
| 1.10 | onTheJob (was UTH 💼 note, **vocabulary rebuild**) | `<strong>💼 On the job —</strong> a test assertion IS a boolean expression... "Status is 200 AND the reply includes the id AND it took under 2 seconds" — that is three comparisons and two &&s. Today's grammar is the daily language of test automation.` | New `onTheJob` section, rebuilt without "assertion" and the status-code/API example (both untaught at this lesson's position): `ReviewCard` (`signup.spec.js`, `age >= 18 && hasConsent && !isBlocked` — built entirely from Phase-1 vocabulary) + `Takeaway`: "A test check is just a boolean expression. **Three comparisons and two &&s, evaluating to one true or false.** That is the grammar you just learned." (status-code example relocated — see Relocations log) |

### Verification (Task 6)

- `node scripts/lint-uth.mjs` → one finding (`0.5 (on the job): job: long sentence (29w)` — the
  Scene's trailing colon let the sentence-splitter merge it with the AppMoment text and the
  first Takeaway sentence). Fixed by ending the AppMoment error text with a period so sentence
  boundaries are unambiguous. Re-ran → `UTH lint: clean`.
- `npm run build` → `✓ built in …` (green)

## Task 7 — Phases 3–4 stem audit + notes 3.7, 3.11, 4.11

### Stem audit (phases 3, 4)

All quiz `code` fields in phases 3–4 checked directly (~65 questions). Every one uses concrete
literal values (function calls with fixed arguments, arrays/objects with fixed contents) — no
2.3-style hidden parametric facts, no trick-pointer phrasing ("notice…"/"hint:"). "Careful —"
appears twice (4.3 Q2, 4.9 Q3) as an existing app-wide idiom (a mild attention flag, not a
reveal of the answer or mechanism), left unchanged. **Zero new failures.**

### Note migrations (3.7, 3.11, 4.11)

| lesson | surface | before | after |
|---|---|---|---|
| 3.7 | onTheJob (was UTH 💼 note) | ``<strong>💼 On the job —</strong> this is why a Playwright helper like `makeLogin(page)` can hand back a function that still knows its page, wherever the call happens. Backpacks everywhere.`` | New `onTheJob` section: `ReviewCard` (`login-helper.js`, a `makeLogin(page)` closure returning a function that still calls `page.click(...)`) + `Takeaway`: "The returned function still knows page, wherever it gets called. **Closures are why a Playwright helper can carry its page around in its backpack.**" |
| 3.11 | onTheJob (was UTH 💼 note) | ``<strong>💼 On the job —</strong> your career quietly begins here: pure, composed functions are exactly what unit tests are written against. expect(tipAmount(1200, 10)).toBe(120) — one line, no setup, no browser, no server. In Phase 10 you write exactly that with Vitest. The functions you wrote today would pass unchanged. You didn't just finish functions; you built your first testable unit.`` | New `onTheJob` section: `ReviewCard` (`tip.test.js`, `expect(tipAmount(1200, 10)).toBe(120);` annotated "no setup, no browser, no server") + `Takeaway`: "Pure, composed functions are exactly what unit tests are written against. The functions you wrote today would pass this test unchanged. **You just built your first testable unit.** Phase 10 teaches this with Vitest." |
| 4.11 | onTheJob (was UTH 💼 note) | ``<strong>💼 On the job —</strong> the options-object pattern is the one to internalize: it's why page.goto(url, { waitUntil: "load" }) and test.use({ viewport: … }) look the way they do. Named fields survive redesigns — adding a new option never breaks old callers, because extra and missing fields are handled gracefully.`` | New `onTheJob` section: `ReviewCard` (`checkout.spec.js`, `page.goto(url, { waitUntil: "load" });` + `test.use({ viewport: { width: 1280, height: 720 } });`) + `Takeaway`: "Both calls destructure an options object. **Named fields survive redesigns: a new option never breaks old callers.** Missing fields are handled gracefully too." |

### Verification (Task 7)

- `node scripts/lint-uth.mjs` → `UTH lint: clean`
- `npm run build` → `✓ built in …` (green)
- `grep -rn "💼" src/lessons/phase3 src/lessons/phase4` → no matches

## Task 8 — Phases 5–6 stem audit + notes 5.2, 5.4, 5.9, 6.2, 6.8 (+ relocation into 6.7)

### Stem audit (phases 5, 6)

All quiz `code`/situation fields checked directly (~48 questions). One fix:

| lesson | surface | before | after |
|---|---|---|---|
| 6.9 Q3 | quiz stem | `Test suites fake network responses instead of calling real APIs mainly for ___ — type the word (hint: the opposite of flaky).` | `Real network calls are unpredictable: sometimes slow, sometimes down. Test suites fake the response instead, so every run gives the same result. Type the one word for that quality.` (removed the explicit `hint:` trick-pointer per rule 3; widened `accept` to add `consistency`, `Consistency`, `repeatability` since the reworded stem now more directly evokes those synonyms) |

All other stems self-contained via concrete code/situations. No other `hint:`/`notice…` pointers
found in quiz stems (three "Notice…" hits found by grep are all in step `caption`s or exercise
task text, out of the audit's scope — quiz array only).

### Note migrations (5.2, 5.4, 5.9, 6.2, 6.8) + one relocation (6.7)

| lesson | surface | before | after |
|---|---|---|---|
| 5.2 | onTheJob (was UTH 💼 note) | `<strong>💼 On the job —</strong> interviewers phrase this a dozen ways — "is let hoisted?" is the trap. The precise answer: yes, all declarations are registered in pass 1 — but let/const are registered uninitialized, so unlike var they throw instead of reading undefined. That sentence separates memorizers from understanders.` | New `onTheJob` section: interview exchange, two `ChatBubble`s ("Is let hoisted?" / "Yes. All declarations are registered in pass one. But let and const are registered uninitialized, so they throw instead of reading undefined.") + `Takeaway`: "**That one sentence separates memorizers from understanders.**" |
| 5.4 | onTheJob (was UTH 💼 note) | `<strong>💼 On the job —</strong> Playwright test code uses arrows almost everywhere precisely to avoid this entire topic. But Page Object classes (11.9) use this.page constantly, via the implicit and new rules. You'll use all four rules weekly; you'll debug rule 2 (lost this) at least once in your career.` | New `onTheJob` section: `ReviewCard` (two lines contrasting an arrow-based test with a Page Object class method using `this.page`) + `Takeaway`: "Test code hides behind arrows to avoid this entirely. **Page Object classes use this constantly, and you will debug a lost this at least once.**" |
| 5.9 | onTheJob (was UTH 💼 note) | `<strong>💼 On the job —</strong> why interviewers ask these: not to see if you memorized outcomes, but to hear which model you reason with. "undefined because hoisting" is a memorizer's answer. "Pass one registered the name with undefined; the assignment is pass-two work" is an understander's answer. Same output, different career.` | New `onTheJob` section: interview exchange, `ChatBubble` "a memorizer" ("undefined, because hoisting.") vs `ChatBubble` "you, after this lesson" ("Pass one registered the name with undefined. The assignment is pass-two work.") + `Takeaway`: "Same output, **different career**. Interviewers listen for which model you reason with, not just the right word." |
| 6.2 | onTheJob (was UTH 💼 note) | `<strong>💼 On the job —</strong> the event loop is not part of the JavaScript engine. V8 has the stack and heap; the loop, timers and queue live in the environment — the browser here; Node's version arrives in 9.6.` | New `onTheJob` section: interview exchange ("Is the event loop part of the JavaScript engine?" / "No. The engine only has the stack and the heap. The loop, timers, and queue live in the browser. Node has its own version, coming in lesson 9.6.") + `Takeaway`: "**The event loop is not part of the JavaScript engine.** It lives in the environment around it." |
| 6.8 | onTheJob (was UTH 💼 note) | ``<strong>💼 On the job —</strong> Playwright code awaits sequentially when steps depend (click → then assert). Promise.all is for genuinely simultaneous things. The classic: await Promise.all([page.waitForNavigation(), page.click("a")]) — start listening BEFORE the click that triggers it.`` | New `onTheJob` section: `ReviewCard` (`nav.spec.js`, `await Promise.all([page.waitForNavigation(), page.click("a")]);` annotated "start listening before the click") + `Takeaway`: "Steps that depend on each other await one at a time. **Promise.all is for genuinely simultaneous things, started before they are triggered.** That order is a professional reflex." |
| 6.7 | onTheJob (**new — relocated from 1.10**) | (6.7 had no badged 💼 note) | New `onTheJob` section carrying 1.10's displaced example, rebuilt with 6.7's now-taught status-code vocabulary and this lesson's own Pokémon example: `ReviewCard` (`pokemon.spec.js`, `res.status === 200 && data.id === 25 && ms < 2000`) + `Takeaway`: "Three comparisons and two &&s, evaluating to one true or false. **Remember 1.10's boolean grammar? This is the same tree, now with real status codes and data.**" (explicit callback to 1.10, as the plan's Task 10 note anticipated) |

### Verification (Task 8)

- `node scripts/lint-uth.mjs` → `UTH lint: clean`
- `npm run build` → `✓ built in …` (green)
- `grep -rn "💼" src/lessons/phase5 src/lessons/phase6` → no matches

## Task 9 — Phases 7–8 stem audit + notes 7.2, 7.5, 7.6, 7.7, 7.8, 8.1, 8.3, 8.4, 8.6

### Stem audit (phases 7, 8)

All quiz questions checked (~48 across both phases). One fix — a genuine variable-name
mismatch, not a wording issue:

| lesson | surface | before | after |
|---|---|---|---|
| 7.6 Q3 | quiz stem | `checkbox.checked is true. Type exactly what console.log(subscribe.checked) prints:` (situation names `checkbox`, code asks about `subscribe` — the lesson's actual variable is `subscribe`, so this was internally inconsistent) | `subscribe.checked is true. Type exactly what console.log(subscribe.checked) prints:` |

All other stems self-contained and complete. No `hint:`/`notice…` pointers found in any quiz
stem. Phase 7's "write the selector" questions (7.2 Q1/Q2) and phase 8's true/false and
either/or questions all state their full situation and answer shape already.

### Note migrations (7.2, 7.5, 7.6, 7.7, 7.8, 8.1, 8.3, 8.4, 8.6)

Per the plan's Task 9 note, these lessons' Playwright/CI references are approved forward-flags
already glossed in the surrounding UTH (established since 2.1/3.1) — kept plain, not stripped.

| lesson | surface | before | after |
|---|---|---|---|
| 7.2 | onTheJob (was UTH 💼 note) | `<strong>💼 On the job —</strong> DevTools Console understands $('sel') and $$('sel') as shorthand for querySelector/All. It's the fastest way to TEST a selector on a live page before it goes in a script. You'll do this daily; start today — F12 on any site.` | New `onTheJob` section: `ReviewCard` (`DevTools console`, `$('.card.active')` / `$$('button')`) + `Takeaway`: "**Testing a selector on the live page before it goes in a script** is something you will do daily. Press F12 on any site and try it today." |
| 7.5 | onTheJob (was UTH 💼 note) | `<strong>💼 On the job —</strong> Playwright's .click() fires a real, trusted click event. It bubbles exactly as a human's click would. That's why delegated listeners in the app you're testing keep firing correctly under automation, with zero special handling.` | New `onTheJob` section: `ReviewCard` (`todo.spec.js`, `await page.click("li .delete");` annotated "fires a real, trusted click") + `Takeaway`: "The click bubbles exactly like a human's click. **Delegated listeners in the app you are testing keep firing correctly under automation, with zero special handling.**" |
| 7.6 | onTheJob (was UTH 💼 note) | `<strong>💼 On the job —</strong> every Playwright form action (fill, check, uncheck, selectOption) does two things. It sets the property and fires the event you read today. Nothing more exotic sits underneath. That's why this lesson transfers directly.` | New `onTheJob` section: `ReviewCard` (`signup.spec.js`, `page.fill(...)` + `page.check(...)`) + `Takeaway`: "Every Playwright form action sets the property and fires the event you read today. **Nothing more exotic sits underneath.** That is why this lesson transfers directly." |
| 7.7 | onTheJob (was UTH 💼 note) | `<strong>💼 On the job —</strong> browserContext.storageState() captures localStorage and cookies to a file in one call. Loading it before a test skips the slow login flow. One of the biggest, cheapest speed wins in a real test suite — built on today's two topics.` | New `onTheJob` section: `ReviewCard` (`auth.setup.js`, `context.storageState({ path: "state.json" });`) + `Takeaway`: "One call captures localStorage and cookies to a file. Loading it before a test skips the slow login flow. **One of the biggest, cheapest speed wins in a real test suite.**" |
| 7.8 | onTheJob (was UTH 💼 note) | `<strong>💼 On the job —</strong> this lesson is the "why" behind auto-waiting, the single feature that makes Playwright tests far less flaky than hand-written ones. Phase 11 teaches the API; today you own the reason it must exist.` | New `onTheJob` section: `ReviewCard` (`checkout.spec.js`, `page.click("#pay");` annotated "waits for the render tree first.") + `Takeaway`: "**This is the “why” behind auto-waiting.** It is the single feature that makes Playwright tests far less flaky than hand-written ones. Phase 11 teaches the API." |
| 8.1 | onTheJob (was UTH 💼 note) | ``<strong>💼 On the job —</strong> every Playwright test file you'll ever write starts with import { test, expect } from "@playwright/test". That's a named import from an installed package, not a ./file path. Installing packages is exactly the next lesson.`` | New `onTheJob` section: `ReviewCard` (`login.spec.js`, `import { test, expect } from "@playwright/test";`) + `Takeaway`: "A named import from an installed package, not a ./file path. **Installing packages is exactly the next lesson.**" |
| 8.3 | onTheJob (was UTH 💼 note) | `<strong>💼 On the job —</strong> Playwright ships this exact experience for tests. npx playwright test --debug opens an inspector where you step through your test actions the same way: pause, inspect, step. Same buttons, same tower, Phase 11 territory.` | New `onTheJob` section: `TestRunCard` (`$ npx playwright test --debug` / "paused. step. inspect. same buttons, same tower.") + `Takeaway`: "Playwright ships this exact debugging experience for tests. **Pause, inspect, step: the same call-stack tower, for real.**" |
| 8.4 | onTheJob (was UTH 💼 note, "assertions" → "checks") | `<strong>💼 On the job —</strong> document.querySelector answers null when nothing matches (7.2), so el?.textContent is daily DOM grammar. And in API testing, response fields are optional by nature — body.user?.address?.city ?? "unknown" is the shape of half the assertions you'll write.` | New `onTheJob` section: `ReviewCard` (`user.spec.js`, `body.user?.address?.city ?? "unknown"`) + `Takeaway`: "document.querySelector answers null when nothing matches, so el?.textContent is daily DOM grammar. **Optional fields are the shape of half the checks you will write.**" ("assertions" replaced with "checks" — untaught until Phase 10, same policy as 1.7/1.10) |
| 8.6 | onTheJob (was UTH 💼 note) | `<strong>💼 On the job —</strong> in interviews, "walk me through this package.json" is a real screening question for QA-automation roles. It tests what you just did: semver literacy, dev-vs-prod judgment, and what each script implies about the workflow.` | New `onTheJob` section: interview exchange, `ChatBubble` "Walk me through this package.json." / "dependencies ship to production. devDependencies are for testing and tooling only. The caret in a version number allows minor updates, never major ones." + `Takeaway`: "**This tests your semver literacy and dev-vs-prod judgment.** A real screening question for QA-automation roles." |

### Verification (Task 9)

- `node scripts/lint-uth.mjs` → two findings on first pass: 7.8 had a sentence-boundary merge
  (Scene's colon + the array-stripped artifact + Takeaway's first sentence combined into a
  37-word "sentence"; fixed by splitting the Takeaway's first sentence so it terminates before
  the merge point) and 8.3 had an em dash inside a `<Key>` phrase (fixed by rewording with a
  colon). Re-ran → `UTH lint: clean`.
- `npm run build` → `✓ built in …` (green)
- `grep -rn "💼" src/lessons/phase7 src/lessons/phase8` → no matches

## Task 10 — Phases 9–10 stem audit + all 15 notes (9.1–9.8, 10.1–10.7)

### Stem audit (phases 9, 10)

All ~45 questions checked. **Zero fixes needed** this batch — every stem is self-contained via
its situation/code, and all `notice…`/`hint:` hits found by grep are in step `caption`s or
`why` fields (out of the audit's scope, quiz array only).

### Note migrations (all 15) + one relocation (into 9.7)

Interview-flavored notes (9.8, 10.1, 10.2, 10.3, 10.6, 10.7) use the two-`ChatBubble` interview
template for the first time at this scale; 10.5 introduces `PipelineRow` for the "walk me
through npm test" systems answer.

| lesson | surface | before | after |
|---|---|---|---|
| 9.1 | onTheJob (was UTH 💼 note) | `<strong>💼 On the job —</strong> on CI, Playwright usually drives "headless" browsers... Remember: "my code lives in Node, the page lives in the browser". That one idea explains a dozen Phase-11 mysteries — why you can't touch document from a test.` | New `onTheJob` section: `ReviewCard` (`ci.yml`, `playwright test --headless` annotated "no visible window, Node steers the browser") + `Takeaway`: "My code lives in Node. The page lives in the browser. **That is why you cannot touch document from a test.**" |
| 9.2 | onTheJob (was UTH 💼 note) | `<strong>💼 On the job —</strong> when a Playwright test fails in CI, you get today's artifact. A terminal log with stack traces; a red pipeline driven by the exit code. Reading traces calmly, innermost frame first, is a real debugging skill. Interviewers test it with "walk me through this failure."` | New `onTheJob` section: `TestRunCard` (`at makeReport (report.js:4:15)` / `exit code: 1`) + `Takeaway`: "Reading traces calmly, innermost frame first, is a real debugging skill. **Interviewers test it with "walk me through this failure."**" |
| 9.3 | onTheJob (was UTH 💼 note) | `<strong>💼 On the job —</strong> TypeScript adds a Phase-11 twist. Your playwright.config.ts is written with import/export, and the compiler outputs whichever system the project's settings ask for. You write the standard; tooling handles the conversion.` | New `onTheJob` section: `ReviewCard` (`playwright.config.ts`, `import { defineConfig } from "@playwright/test";`) + `Takeaway`: "You write the standard: import and export. **The compiler outputs whichever system the project's settings ask for.**" |
| 9.4 | onTheJob (was UTH 💼 note) | `<strong>💼 On the job —</strong> virtually every CI provider sets CI=true by convention. Real Playwright configs read it to switch behavior... One env var, two worlds correctly served.` | New `onTheJob` section: `ReviewCard` (`playwright.config.ts`, `retries: process.env.CI ? 2 : 0,`) + `Takeaway`: "Virtually every CI provider sets CI=true by convention. **One env var serves two worlds correctly: your machine, and CI.**" |
| 9.5 | onTheJob (was UTH 💼 note) | `<strong>💼 On the job —</strong> "where did my screenshot go?" is a daily question. The answer is always some path.join of an output folder, resolved against cwd. That's why CI configs run suites from the repo root, every time, on purpose.` | New `onTheJob` section: team-chat, `ChatBubble` "Where did my screenshot go?" / "Some path.join of an output folder, resolved against cwd." + `Takeaway`: "**That is why CI configs run suites from the repo root, every time, on purpose.**" |
| 9.6 | onTheJob (was UTH 💼 note) | `<strong>💼 On the job —</strong> this is why one Playwright process can drive several browser contexts in parallel without threads. Every await is a parked job, and the loop interleaves them.` | New `onTheJob` section: `ReviewCard` (`playwright.config.ts`, `workers: 4,` annotated "four parallel contexts, one process") + `Takeaway`: "Every await is a parked job, and the loop interleaves them. **One process can drive several browser contexts in parallel without threads.**" |
| 9.7 | onTheJob (was UTH 💼 note **+ relocated 1.10-era 2.3 callback**) | `<strong>💼 On the job —</strong> API tests make superb setup for browser tests too. Create the user via the API in one second, then browser-test only the login screen... often the difference between a 40-second test and a 4-second one.` | New `onTheJob` section: `TestRunCard` (API setup 1s / browser-only login 3s / old click-through way 40s) + `Takeaway`: "API tests make superb setup for browser tests. **Often the difference between a 40-second test and a 4-second one.** Phase 11 uses this trick constantly. And remember 2.3's dead gate? Real status-code chains fall into that same mis-ordered trap." — **this resolves the 2.3 relocation logged back in Task 5/6** |
| 9.8 | onTheJob (was UTH 💼 note) | `<strong>💼 On the job —</strong> "set up a project from scratch" (from an empty folder) is a real interview task for automation roles. You just rehearsed it end to end.` | New `onTheJob` section: interview exchange, `ChatBubble` "Set up a test project from an empty folder." / "You just rehearsed this end to end." + `Takeaway`: "**Phase 11's npm init playwright@latest does a fancier version of the same steps.** You will know what it sets up and why." |
| 10.1 | onTheJob (was UTH 💼 note) | `<strong>💼 On the job —</strong> when interviewers ask "why do we test?", weak answers say "to find bugs." You now have the strong one: to make change safe...` | New `onTheJob` section: interview exchange, `ChatBubble` "Why do we test?" / "To make change safe. Catching regressions in seconds, not in production. Desk prices, not 2am prices." + `Takeaway`: "**That answer signals a professional.** A specification that defends itself." |
| 10.2 | onTheJob (was UTH 💼 note) | `<strong>💼 On the job —</strong> "where would you test this?" is a beloved interview question. The winning answer has the shape from the last step...` | New `onTheJob` section: interview exchange, `ChatBubble` "Where would you test this?" / "Name the layer. Justify it by cost, and by what a failure there would tell you." + `Takeaway`: "**You just practiced that answer three times.**" |
| 10.3 | onTheJob (was UTH 💼 note) | `<strong>💼 On the job —</strong> interviewers love handing you a function and saying "test this." The professional move you now own: enumerate behaviors first...` | New `onTheJob` section: interview exchange, `ChatBubble` "Test this." / "First, enumerate the behaviors: happy path, zero, negative, wrong type. Then one AAA test per behavior, with a sentence name." + `Takeaway`: "**That enumeration step, done before any code, separates testers from typists.**" |
| 10.4 | onTheJob (was UTH 💼 note) | `<strong>💼 On the job —</strong> failure messages are the product you ship to your future self. A precise matcher turns 2am debugging into reading...` | New `onTheJob` section: `TestRunCard` (`expect(items).toHaveLength(3)` / `✗ expected length 3, received 5`) + `Takeaway`: "Failure messages are the product you ship to your future self. **Choosing precise matchers IS writing documentation for the night something breaks.**" |
| 10.5 | onTheJob (was UTH 💼 note) | `<strong>💼 On the job —</strong> in interviews, "walk me through what happens when you run npm test" is a systems question in disguise... Thirteen lessons in one answer.` | New `onTheJob` section: `ChatBubble` "Walk me through what happens when you run npm test." + `PipelineRow` (npm resolves → Node launches → finds .test. files → runs each it → prints ✓/✗ + exit code) + `Takeaway`: "**Thirteen lessons in one answer.** CI reads that exit code to turn the pipeline green or red." (first use of `PipelineRow`) |
| 10.6 | onTheJob (was UTH 💼 note) | `<strong>💼 On the job —</strong> Playwright's route.fulfill() (11.10) is a STUB... And "explain stub vs mock vs spy" is a standard interview question — you now hold the answer most candidates miss.` | New `onTheJob` section: interview exchange, `ChatBubble` "Explain stub vs mock vs spy." / "A stub feeds canned answers in. A spy records how it was called. Playwright's route.fulfill() is a stub at the network boundary..." + `Takeaway`: "**Most candidates miss this answer.** Same family, biggest stage." |
| 10.7 | onTheJob (was UTH 💼 note) | `<strong>💼 On the job —</strong> this checkpoint is a full interview story. "Tell me about a time tests caught a bug" is better answered with the sabotage ritual than with luck...` | New `onTheJob` section: interview exchange, `ChatBubble` "Tell me about a time tests caught a bug." / "I write the suite. I break the code deliberately to verify the net. The cascade pattern tells me exactly where to look." + `Takeaway`: "**That sentence sounds like five years of experience.** You earned it in one lesson." |

### Bug found and fixed during migration (Task 10)

The first `Edit` deletion for 9.8's old 💼 paragraph matched starting from `<strong>💼 On the
job` rather than the preceding `<p>` opening tag, leaving an **orphaned `<p>` tag** behind
(build broke with `TS1381`/`TS1005` errors). The same match pattern had been used for all 8
phase-9 files migrated just before this was caught, so all 8 carried the identical bug —
found and fixed in every one (`grep`-verified `<p>`/`</p>` balance across every phase-9/10
file afterward). Phase-10 edits were done with the full paragraph including the opening `<p>`
tag in the match, avoiding the recurrence.

### Verification (Task 10)

- `node scripts/lint-uth.mjs` → `UTH lint: clean`
- `npm run build` → failed after the phase-9 batch (`TS1381`/`TS1005` in lesson98.tsx and,
  once checked, the same issue in 7 more phase-9 files) → fixed → `✓ built in …` (green)
- `grep -rn "💼" src/lessons/phase9 src/lessons/phase10` → no matches
- `<p>`/`</p>` balance check across every phase-9/10 file → all balanced

## Relocations log

- **2.3's status-code example** ("Status 2xx → pass, 4xx → client error, 5xx → server error")
  from the old 💼 note is not carried into the new Task-5 onTheJob section (that content is
  fixed verbatim by the plan). **RESOLVED in Task 10.** Landed in lesson 9.7 (API testing,
  already being migrated for its own note) as an appended callback line: "And remember 2.3's
  dead gate? Real status-code chains fall into that same mis-ordered trap." All other facts
  from the four migrated Phase-2 notes (dead-code silence, falsy edge values, data-driven test
  counters) are fully re-expressed in their new sections above.
- **1.10's status-code assertion example** ("Status is 200 AND the reply includes the id AND
  it took under 2 seconds") — **RESOLVED in Task 8.** Landed in lesson 6.7 "fetch & APIs" as a
  new `onTheJob` section (6.7 had no badged note), rebuilt with 6.7's now-taught status-code
  vocabulary and an explicit callback line ("Remember 1.10's boolean grammar?").
