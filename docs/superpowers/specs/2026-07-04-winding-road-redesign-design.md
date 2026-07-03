# The winding road — home-page trail redesign

**Date:** 2026-07-04 · **Approved by:** Vasavi ("perfect")

## Problem
The "road — zero to automation tester" section is a straight dashed centerline
with alternating cards and number seals — reads as a generic corporate timeline,
not a road. User verdict: odd-looking.

## Design
1. **The road**: one continuous S-curve (SVG cubic path through 11 hand-tuned
   bend points in a `100 × ~1700` viewBox, `preserveAspectRatio="none"`, strokes
   `vector-effect: non-scaling-stroke`). Drawn twice: full length in faint pencil
   dashes; walked stretch overlaid in solid teal that draws itself in on load
   (motion `pathLength`). Progress = cleared phases (+ partial for the current
   phase's done lessons).
2. **Stations**: phases sit at the bends — existing `Seal` number circle on the
   road, HTML card beside it (title, question, lesson status, "step inside →"),
   side chosen by which way the bend opens. Pencil phases stay faded; 0–1 keep
   "the foundation" tag. No left/right alternating grid.
3. **Travelers (signature)**: current phase marked by the learner's round avatar
   standing on the road (gentle bob) with a small hand-written "you are here";
   tiny pawprints dot the teal stretch behind her. Finish stays the checkered
   flag: "job-ready: automation tester."
4. **LinkedIn**: hand-written sign-off footer — "drawn by Vasavi · say hi on
   LinkedIn ↗" → https://www.linkedin.com/in/vasavi-alla/ (new tab) — and the
   hero portrait links there too.

## Scope
`src/app/CurriculumMap.tsx` only (road section + footer + portrait link).
No store, registry, or engine changes. Everything else on the page untouched.
