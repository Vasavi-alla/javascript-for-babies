import { HandArrow, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 2.7 — break, continue & nested loops
 * Viz: a station track with an ejector seat (break) and a skip ramp
 * (continue); then a nested loop drawing a grid cell by cell.
 */

const BREAK_CODE = `for (let i = 1; i <= 6; i++) {
  if (i === 4) {
    break;
  }
  console.log(i);
}`

const CONTINUE_CODE = `for (let i = 1; i <= 5; i++) {
  if (i === 3) {
    continue;
  }
  console.log(i);
}`

const NESTED_CODE = `for (let row = 1; row <= 3; row++) {
  for (let col = 1; col <= 4; col++) {
    console.log(row + "," + col);
  }
}`

function StationTrack({ mode }: { mode: 'break' | 'continue' }) {
  const stations = mode === 'break' ? [1, 2, 3, 4, 5, 6] : [1, 2, 3, 4, 5]
  const special = mode === 'break' ? 4 : 3
  return (
    <svg viewBox="0 0 440 280" className="w-full">
      <text x={40} y={30} fontFamily="var(--font-hand)" fontSize={19} fill="var(--color-ink-soft)">
        {mode === 'break' ? 'break — the ejector seat' : 'continue — the skip ramp'}
      </text>
      {stations.map((n, idx) => {
        const x = 40 + idx * 64
        const visited = mode === 'break' ? n < special : n !== special
        const isSpecial = n === special
        return (
          <g key={n} opacity={mode === 'break' && n > special ? 0.3 : 1}>
            <RoughRect
              x={x}
              y={110}
              width={48}
              height={48}
              seed={480 + idx}
              fill={isSpecial ? 'var(--color-marker-coral)' : visited ? 'var(--color-marker-teal)' : undefined}
            />
            <text x={x + 24} y={140} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={21} fontWeight={700} fill="var(--color-ink)">
              {n}
            </text>
            {visited && !isSpecial && (
              <text x={x + 24} y={185} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-marker-teal)">
                printed
              </text>
            )}
          </g>
        )
      })}
      {mode === 'break' ? (
        <>
          <HandArrow from={{ x: 256, y: 105 }} to={{ x: 330, y: 45 }} seed={490} stroke="var(--color-marker-coral)" curve={-0.25} />
          <text x={300} y={35} fontFamily="var(--font-hand)" fontSize={16} fontWeight={700} fill="var(--color-marker-coral)">
            EJECT — loop over, stations 5–6 never visited
          </text>
        </>
      ) : (
        <>
          <HandArrow from={{ x: 175, y: 100 }} to={{ x: 240, y: 100 }} seed={491} stroke="var(--color-marker-coral)" curve={-0.6} />
          <text x={130} y={60} fontFamily="var(--font-hand)" fontSize={16} fontWeight={700} fill="var(--color-marker-coral)">
            skip THIS lap only — the loop rolls on
          </text>
        </>
      )}
      <text x={40} y={240} fontFamily="var(--font-code)" fontSize={13} fill="var(--color-ink)">
        console: {mode === 'break' ? '1  2  3' : '1  2  4  5'}
      </text>
    </svg>
  )
}

function GridDraw({ cells }: { cells: number }) {
  return (
    <svg viewBox="0 0 440 280" className="w-full">
      <text x={40} y={30} fontFamily="var(--font-hand)" fontSize={19} fill="var(--color-ink-soft)">
        nested loops draw a grid — inner spins fast, outer clicks slow
      </text>
      {Array.from({ length: 12 }, (_, k) => {
        const row = Math.floor(k / 4)
        const col = k % 4
        const on = k < cells
        return (
          <g key={k} opacity={on ? 1 : 0.18}>
            <RoughRect x={70 + col * 78} y={55 + row * 62} width={66} height={50} seed={500 + k} fill={on ? 'var(--color-marker-yellow)' : undefined} />
            <text x={103 + col * 78} y={85 + row * 62} textAnchor="middle" fontFamily="var(--font-code)" fontSize={13} fontWeight={600} fill="var(--color-ink)">
              {row + 1},{col + 1}
            </text>
          </g>
        )
      })}
      <text x={70} y={262} fontFamily="var(--font-hand)" fontSize={16} fill="var(--color-ink-soft)">
        outer lap {Math.min(3, Math.floor((cells - 1) / 4) + 1)} · total prints: {cells} of 12
      </text>
    </svg>
  )
}

function EscapeViz({ stepIndex }: { stepIndex: number }) {
  if (stepIndex <= 1) return <StationTrack mode="break" />
  if (stepIndex <= 3) return <StationTrack mode="continue" />
  const cells = stepIndex === 4 ? 5 : 12
  return <GridDraw cells={cells} />
}

export const lesson27: LessonDef = {
  id: '2.7',
  hook: (
    <>
      <p>
        Loops so far run their full course. Real loops often shouldn’t: you found the item you were
        searching for — why keep looking? This row of data is corrupt — skip it and carry on. Two
        escape hatches:{' '}
        <HighlightMark type="underline" color="var(--color-marker-coral)">break</HighlightMark>{' '}
        (eject from the whole loop) and{' '}
        <HighlightMark type="underline" color="var(--color-marker-coral)">continue</HighlightMark>{' '}
        (abandon this lap only). And then the multiplier: loops <em>inside</em> loops, which is how
        programs sweep grids, tables… and test matrices.
      </p>
    </>
  ),
  code: BREAK_CODE,
  steps: [
    {
      id: 'break',
      caption:
        'The track has 6 stations, but watch: laps 1–3 print normally, then at i === 4 the if fires and break EJECTS — the loop is over, instantly. Stations 4, 5, 6? Never visited. The console shows 1 2 3 and life continues after the loop.',
      highlightLines: [2, 3],
    },
    {
      id: 'break-why',
      caption:
        'Why eject early? Efficiency and honesty. Searching 10,000 records for one username: found it at #12 → break. Without it you’d pointlessly check 9,988 more. break says “my work here is done” — it’s the polite version of what you’ll later know as an early return.',
      highlightLines: [3],
    },
    {
      id: 'predict-continue',
      caption: 'Now the other hatch. Same track, but at i === 3 we say continue instead. Predict the console.',
      codeOverride: CONTINUE_CODE,
      highlightLines: [2, 3],
      prediction: {
        question: 'With continue when i === 3, what does this loop print?',
        options: [
          '1  2 — continue stops the loop like break',
          '1  2  4  5 — lap 3 is abandoned, but the loop rolls on',
          '1  2  3  4  5 — continue does nothing here',
        ],
        correctIndex: 1,
        why: 'continue abandons the REST of the current lap (the console.log below it never runs) and jumps straight to the update-then-check. The loop itself survives: laps 4 and 5 happen normally. break kills the loop; continue only skips a lap — that’s the whole difference.',
      },
    },
    {
      id: 'continue',
      caption:
        'Station 3 gets bypassed on the skip ramp; everything else prints: 1 2 4 5. Typical use: “if this entry is invalid, skip it” — filtering without stopping. One caution: in a while loop, make sure your counter updates BEFORE the continue, or you’ve built lesson 2.5’s infinite loop with extra steps.',
      codeOverride: CONTINUE_CODE,
      highlightLines: [3, 5],
    },
    {
      id: 'nested',
      caption:
        'Now the multiplier: a loop INSIDE a loop. Read it inside-out: for each single lap of the OUTER loop (one row), the INNER loop runs completely (all four columns). Watch the grid paint: row 1 fills cell by cell before row 2 even starts. Like a clock — the minute hand (inner) spins all the way around for each click of the hour hand (outer).',
      codeOverride: NESTED_CODE,
      highlightLines: [1, 2],
    },
    {
      id: 'grid-done',
      caption:
        '3 outer laps × 4 inner laps = 12 prints — nested loops MULTIPLY. (That’s also the warning: nest a 1,000-lap loop inside another and you’ve ordered a million iterations.) And a subtle rule: break/continue only affect the loop they sit in — the INNERMOST one. Escaping an inner loop lands you in the outer lap, not outside everything.',
      codeOverride: NESTED_CODE,
      highlightLines: [2, 3],
    },
  ],
  Viz: EscapeViz,
  underTheHood: (
    <>
      <p>
        The nested-loop multiplication table is worth internalizing: outer <em>m</em> laps × inner{' '}
        <em>n</em> laps = <em>m·n</em> executions of the inner body. It’s the shape of everything
        grid-like: pixels (rows × columns), calendars (weeks × days), comparing every item against
        every other item. In your automation career it appears as the <strong>test matrix</strong>:
        3 browsers × 20 test cases = 60 runs; add 2 screen sizes and you’re at 120. When a CI
        pipeline takes hours, somewhere inside is a nested loop someone forgot was multiplying.
      </p>
      <p>
        About that “innermost only” rule: JavaScript does have an escape for it — you can label a
        loop (<code>outer: for (…)</code>) and write <code>break outer;</code> to eject from both
        levels at once. It’s legal, rare, and worth recognizing more than writing; if you find
        yourself needing labels often, the code is usually asking to be reorganized into a
        function (Phase 3 gives you that tool — <code>return</code> is the cleanest escape hatch
        of all).
      </p>
      <p>
        <strong style={{ color: 'var(--color-marker-coral)' }}>Fun fact:</strong> break and
        continue are the tamed descendants of a notorious ancestor: <code>goto</code>, the command
        that let old programs jump ANYWHERE, producing what programmers called spaghetti code. In
        1968, Edsger Dijkstra published one of the most famous letters in computing history — “Go
        To Statement Considered Harmful” — and the ensuing revolution (structured programming) gave
        us the disciplined jumps you learned today: loops with single entrances, and only
        well-behaved exits like break, continue and return. Even the letter’s title became a meme:
        half a century later, tech articles are still titled “X Considered Harmful.”
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Which keyword abandons only the CURRENT lap and keeps looping? Type it.',
      accept: ['continue'],
      placeholder: 'a keyword…',
      why: 'continue = skip ramp (this lap is abandoned, the next check happens normally). break = ejector seat (loop over, done). Mixing them up inverts your loop’s logic while looking perfectly plausible — a classic code-review catch.',
    },
    {
      kind: 'type-output',
      question: 'found() first says true at i = 2. How many laps run? Type the number.',
      code: 'for (let i = 0; i < 100; i++) {\n  if (found(i)) { break; }\n}',
      accept: ['3', 'three'],
      placeholder: 'a number…',
      why: 'Three — laps for i=0 (no), i=1 (no), i=2 (yes → break mid-lap). The remaining 97 laps never happen. This early-exit search is one of the most common loop patterns in existence.',
    },
    {
      kind: 'type-output',
      question: 'Your test suite runs 25 test cases across 4 browsers using nested loops. The inner body runs how many times in total? Type the number.',
      accept: ['100'],
      placeholder: 'a number…',
      why: '4 × 25 = 100 — nested loops multiply; that’s the test-matrix shape. And remember: a break in the inner loop exits ONLY the inner loop — you land in the outer lap, moving to the next browser. To abandon everything you’d need a labeled break — or better, a function with return (Phase 3).',
    },
  ],
  teachBack: {
    prompt:
      'Explain to a friend: break vs continue (ejector seat vs skip ramp), how nested loops multiply, and which loop a break inside a nested loop actually escapes.',
    modelAnswer:
      'break and continue are a loop’s two escape hatches. break is the ejector seat: the whole loop ends instantly, remaining laps never happen — perfect when you’ve found what you were searching for. continue is the skip ramp: it abandons just the rest of the current lap and jumps to the next check, so the loop rolls on — perfect for skipping invalid entries. Nested loops are loops inside loops, and they MULTIPLY: 3 outer laps × 4 inner laps = 12 runs of the inner body, like a clock’s minute hand doing a full circle per click of the hour hand. And a break (or continue) only affects the innermost loop it sits in — escaping the inner loop just lands you in the outer loop’s next lap. Fun fact: these disciplined jumps replaced the chaotic goto after Dijkstra’s famous 1968 letter “Go To Statement Considered Harmful.”',
  },
  recap: [
    'break = ejector seat (whole loop ends now). continue = skip ramp (abandon this lap, keep looping).',
    'Nested loops multiply: m × n runs — the exact shape of a browser × test-case matrix. Respect the multiplication.',
    'break/continue touch only the INNERMOST loop. Labeled breaks exist; functions with return (Phase 3) are usually cleaner.',
  ],
}
