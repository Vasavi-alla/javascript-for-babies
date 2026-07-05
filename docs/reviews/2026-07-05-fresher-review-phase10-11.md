# Fresher review — Phase 10 & 11 (2026-07-05)

Method: the established ritual (rounds 1–3). All 25 new lessons (10.1–10.7, 11.1–11.18) read as a
learner who has completed Phases 0–9 and nothing else; captions cross-checked against per-step
viz states, quizzes typed as a fresher would, exercises solved the natural way. Scripted sweeps:
caption density, SVG overflow, steps↔views counts, exercise execution, and first-use greps for
every technical term.

**Verdict: the strongest phases yet.** Pacing 9–12 steps everywhere, every concept mechanically
explained, callbacks landing constantly (4.6→toBe, 5.3→spies, 7.7→session bottles, 9.2's exit
code closing the loop in 11.16). Zero SVG overflows. All 25 exercises execute to their exact
expected output. The fresher hit **one true wall and a handful of small snags** — all found and
**ALL FIXED in this same session** (build green, counts re-verified).

## A. Findings → fixes applied

- **A1 HIGH — "pull request", "merge", "branch protection" were never taught.** The git gloss
  (8.2, added in the last round) covers commit/repo but not GitHub's change-proposal ritual —
  and 11.16 builds its climax on it. *Fixed:* pull request glossed at first use (11.16 triggers
  step: "a proposed change, submitted for teammates' review before it may join main"), merging
  glossed inside the branch-protection sentence (the-verdict step).
- **A2 MED — 11.15's final caption bundled TWO ideas at 79 words** (the triage method + the
  zero-flake policy) — the only density violation in 25 lessons. *Fixed:* split into
  `the-triage` and `zero-flake-policy` steps with a matching new view (11 ↔ 11 verified).
- **A3 MED-LOW — "glob" used in 11.3 before 11.10 defines it.** *Fixed:* inline gloss at 11.3's
  testDir step ("a filename pattern with wildcards like *.spec.ts").
- **A4 LOW batch — unglossed micro-jargon:** "P1" (11.15 — now "priority one: before new work"),
  "your PM" (11.16 → "your manager"), "hot-reload" (11.12 → "your edit-and-see loop"),
  "ARIA" (11.17 — now "extra HTML attributes that add accessibility meaning"). All fixed.
- **A5 LOW — 11.1 ran hot (four 55+ captions).** The two heaviest (every-await, the-familiar)
  trimmed to ≤55 words without losing content.
- **A6 LOW — viz margin:** 11.15's serial-lane caption measured ~425px in a 440 viewBox (7px
  margins). Shortened.
- **A7 LOW — quiz accept:** 11.16 Q1 now accepts the plain "exact versions" phrasing.
- **Also fixed during the build itself** (self-caught, logged for the record): 11.11 had a
  step/view mismatch (credentials step showed the expiry picture — view inserted); 11.15's
  retry-debate step showed the clinic picture (view inserted + clinic highlight logic paired);
  11.8 had a quote-nesting syntax error in a note; 11.9 had a stray comma in a JSX prop; the
  phase11 `lesson111` export collided with phase1's 1.11 (aliased in the index); 11.18's badge
  claimed 121 lessons (real count: 115).

## B. What read WELL as a fresher (keep, and keep doing)
- 11.4's redesign-survival demo — the CSS locators dying while getByRole survives is the single
  most convincing moment of the phase.
- 11.6 finally paying 7.8's two-phase-old promise, with sleep() defeated by construction (fails
  both directions) rather than by decree.
- 11.16 as the third "detective file" — by now the fresher *expects* to decode config files, and
  the fresh-box step retroactively justifying every reproducibility lesson lands like a plot twist.
- 10.4's twin trap with the scale literally weighing heap-address tags — 4.6 paying off seven
  phases later.
- The capstone's flake rite ("a test WILL flake — good") converts the scariest moment of the job
  into a graduation ritual.
- Every exercise being a build-the-tool exercise (the runner, the spy, the matchers, the polling
  assertion, the customs booth, grep, the pipeline) — nothing in the toolchain is magic by the end.

## C. Status
All findings fixed in-session; build green; steps↔views verified for all 25 (including the 11.15
split); all 25 exercise model answers re-executed and pass. The course is complete and reviewed:
**115 lessons, Phases 0–11, every one built, verified, and fresher-read.**
