import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { StickyNote } from '../../design/StickyNote'
import { InkButton } from '../../design/InkButton'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 0.3 — Your first conversation with the machine
 * Viz: a console window filling with output, line by line.
 * PlayExtra: TryConsole — a tiny real console the learner can type into.
 */

const CODE = `console.log("Hello!");
console.log("I am your computer");
console.log(2 + 3);
console.log("2 + 3");`

const OUTPUT = ['Hello!', 'I am your computer', '5', '2 + 3']
// how many output lines are visible at each step
const VISIBLE = [0, 1, 2, 2, 3, 4, 4]

function ConsoleViz({ stepIndex }: { stepIndex: number }) {
  const count = VISIBLE[stepIndex] ?? 0
  return (
    <svg viewBox="0 0 420 290" className="w-full">
      <text x={40} y={34} fontFamily="var(--font-hand)" fontSize={22} fill="var(--color-ink-soft)">
        the console
      </text>
      <RoughRect x={35} y={45} width={350} height={225} seed={100} />
      {count === 0 && (
        <text x={210} y={165} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={19} fill="var(--color-ink-soft)">
          (silence…)
        </text>
      )}
      <AnimatePresence>
        {OUTPUT.slice(0, count).map((line, i) => (
          <motion.g
            key={i}
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', damping: 16 }}
          >
            <RoughRect
              x={55}
              y={62 + i * 50}
              width={250}
              height={36}
              seed={104 + i}
              fill="var(--color-sticky)"
              fillStyle="solid"
              strokeWidth={1.5}
            />
            <text x={70} y={85 + i * 50} fontFamily="var(--font-code)" fontSize={14} fill="var(--color-ink)">
              {line}
            </text>
          </motion.g>
        ))}
      </AnimatePresence>
    </svg>
  )
}

/** A tiny REAL console: supports console.log("text") and console.log(simple math). */
function TryConsole() {
  const [entries, setEntries] = useState<Array<{ text: string; isError: boolean }>>([])
  const [input, setInput] = useState('')

  const run = () => {
    const src = input.trim()
    if (!src) return
    const stringMatch = src.match(/^console\.log\(\s*(["'])(.*)\1\s*\)\s*;?$/)
    const mathMatch = src.match(/^console\.log\(\s*([0-9+\-*/(). ]+?)\s*\)\s*;?$/)
    let entry: { text: string; isError: boolean }
    if (stringMatch) {
      entry = { text: stringMatch[2], isError: false }
    } else if (mathMatch) {
      try {
        const value: unknown = Function(`"use strict"; return (${mathMatch[1]});`)()
        entry = { text: String(value), isError: false }
      } catch {
        entry = { text: 'SyntaxError: the machine couldn’t read that math', isError: true }
      }
    } else {
      entry = {
        text: 'SyntaxError: the machine didn’t understand. Try exactly: console.log("your text")  or  console.log(2 + 3)',
        isError: true,
      }
    }
    setEntries((prev) => [...prev, entry])
    setInput('')
  }

  return (
    <StickyNote id="try-console" className="w-full max-w-xl">
      <p className="font-hand text-2xl font-semibold">🖥️ Try the real thing</p>
      <p className="mt-1 text-[15px]">
        This little console is live. Type a real instruction and press run — for example{' '}
        <code className="text-[13px]">console.log("I did it!")</code> or{' '}
        <code className="text-[13px]">console.log(7 * 6)</code>. Misspell it on purpose, too — see
        what the machine says.
      </p>
      <div className="mt-3 flex flex-col gap-1.5">
        {entries.map((entry, i) => (
          <div
            key={i}
            className="rounded px-2 py-1 font-code text-[13px]"
            style={{
              background: entry.isError
                ? 'color-mix(in srgb, var(--color-marker-coral) 22%, transparent)'
                : 'color-mix(in srgb, var(--color-paper-raised) 85%, transparent)',
              color: 'var(--color-ink)',
            }}
          >
            {entry.isError ? '✗ ' : '› '}
            {entry.text}
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && run()}
          placeholder='console.log("…")'
          className="border-ink-soft/50 bg-paper-raised font-code w-full rounded border border-dashed px-2 py-1.5 text-[13px] outline-none focus:border-ink"
        />
        <InkButton id="try-console-run" variant="primary" onClick={run}>
          run
        </InkButton>
      </div>
    </StickyNote>
  )
}

const FIRST_CODE_EXERCISE: CodeExerciseDef = {
  id: 'l03-first-code',
  title: 'your first real program',
  task: 'Two lines of real JavaScript, written by you, actually executed. You command; the machine computes — with math the lesson never showed you.',
  steps: [
    <>
      First line: print exactly <code>Hello!</code>
    </>,
    <>
      Second line: make the console show <code>42</code> — but you may not type 42 anywhere. Make
      the <em>machine</em> compute it: six times seven, using the <code>*</code> symbol (that’s
      how keyboards multiply).
    </>,
  ],
  starter: '',
  expectedOutput: ['Hello!', '42'],
  mustUse: [
    { test: /console\.log\s*\(\s*["']Hello!["']\s*\)/, label: 'prints Hello! with console.log' },
    { test: /6\s*\*\s*7|7\s*\*\s*6/, label: 'the 42 is computed by the machine (6 * 7)' },
  ],
  mustNotUse: [{ test: /42/, label: 'no ready-made 42 — the machine does the math' }],
  modelAnswer: `console.log("Hello!");\nconsole.log(6 * 7);`,
}

export const lesson03: LessonDef = {
  id: '0.3',
  hook: (
    <>
      <p>
        Enough watching — time to actually talk to the machine. Your first real instruction is{' '}
        <code>console.log</code>, which means:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          “machine, print this in the console.”
        </HighlightMark>
      </p>
      <p>
        The console is a little window where the machine can answer you back. Users never see it —
        it’s a workbench for people like you. Programmers use it constantly; testers practically
        live in it.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'silent',
      caption:
        'On the right: the console, currently silent. On the left: a four-line program. Let’s run it and watch the conversation start.',
    },
    {
      id: 'line-1',
      caption:
        'Line 1 executes. Whatever sits between the quotes gets printed — exactly, character for character. The quotes themselves are not printed; they’re just the wrapper that says “this is text.”',
      highlightLines: [1],
    },
    {
      id: 'line-2',
      caption: 'Line 2 — because after finishing a line, the machine always moves to the next one down. You knew that already.',
      highlightLines: [2],
    },
    {
      id: 'predict-math',
      caption: 'Now look closely at line 3. No quotes this time: console.log(2 + 3). What will the console show — the math worked out, or the characters as written?',
      highlightLines: [3],
      prediction: {
        question: 'Line 3 is console.log(2 + 3) — with no quotes. What appears in the console?',
        options: [
          '2 + 3, exactly as written',
          '5 — the machine works out the math first, then prints the answer',
          'An error — console.log only accepts text in quotes',
        ],
        correctIndex: 1,
        why: 'Without quotes, 2 + 3 is treated as a calculation. The machine ALWAYS works out what’s inside the parentheses first, and hands the finished result — 5 — to console.log. This “work it out first” habit is one of JavaScript’s deepest rules; you’ll meet it everywhere.',
      },
    },
    {
      id: 'line-3',
      caption: 'There it is: 5. The machine calculated first, printed second.',
      highlightLines: [3],
    },
    {
      id: 'line-4',
      caption:
        'And line 4 is the twin experiment: the same characters, but wrapped in quotes. Quotes mean “don’t touch — this is literal text.” So the machine prints 2 + 3 without doing any math. One pair of quotes, completely different behavior.',
      highlightLines: [4],
    },
    {
      id: 'conversation',
      caption:
        'Four instructions, four answers back. That’s what the console is FOR: your first two-way conversation with the machine. Scroll down — there’s a live console below, waiting for you to talk to it yourself.',
    },
  ],
  Viz: ConsoleViz,
  underTheHood: (
    <>
      <p>
        Let’s name the parts of <code>console.log("Hello!");</code> properly.{' '}
        <code>console</code> is a built-in toolbox the browser hands to every program, and{' '}
        <code>log</code> is one specific tool inside it — the “print this” tool. The dot between
        them means “look inside.”
      </p>
      <p>
        The parentheses <code>( )</code> mean “here’s what I’m handing you,” and the semicolon{' '}
        <code>;</code> ends the instruction, like a full stop ends a sentence.
      </p>
      <p>
        Text in quotes is called a <strong>string</strong> (a string of characters — you’ll
        formally meet it in Phase 1).
      </p>
      <p>
        Something the machine must work out, like <code>2 + 3</code>, is called an{' '}
        <strong>expression</strong>, and working it out is called <strong>evaluating</strong>.
        Rule worth underlining: <em>expressions are always evaluated before they’re used.</em>{' '}
        That’s why <code>console.log(2 + 3)</code> receives a finished 5, never the recipe for it.
      </p>
      <p>
        And here’s the empowering part: <strong>you already own this tool.</strong> On a computer,
        press <strong>F12</strong> in your real browser right now (or right-click → Inspect) and
        open the <strong>Console</strong> tab. Type{' '}
        <code>console.log("I’m talking to a machine")</code> and press Enter. (On an iPad there’s
        no F12 — use the live console below instead; it’s the same conversation.) That console is
        one of the developer tools — DevTools — and as an automation tester you’ll open it
        hundreds of times a week.
      </p>
    </>
  ),
  quiz: [
    {
      question: 'What does console.log("Good morning") do?',
      options: [
        'Shows a Good morning popup to the user of the website',
        'Prints Good morning in the console — the developers-only window',
        'Saves Good morning into the machine’s memory',
      ],
      correctIndex: 1,
      why: 'console.log speaks to the console, and only developers (and testers!) who open DevTools ever see it. Users of the site see nothing. It’s a workbench tool, not a user feature.',
    },
    {
      kind: 'type-output',
      question: 'Type exactly what console.log(10 - 4) prints:',
      accept: ['6'],
      why: 'No quotes → it’s an expression → the machine evaluates it to 6 first, then prints the result. Quotes would have made it literal text.',
    },
    {
      kind: 'type-output',
      question: 'Now the twin with quotes: type EXACTLY what console.log("10 - 4") prints — every character.',
      accept: ['10 - 4'],
      placeholder: 'exact characters…',
      why: 'The quotes mean “literal text, don’t evaluate” — so the machine copies the characters 1, 0, space, minus, space, 4 to the console. Without quotes (the previous question!) it computed 6. This tiny pair is one of the most important pictures in early programming — you’ve now beaten it on day one.',
    },
  ],
  teachBack: {
    prompt:
      'Explain to a friend: what does console.log do, who sees it — and why do console.log(2 + 3) and console.log("2 + 3") print different things?',
    modelAnswer:
      'console.log is an instruction that tells the machine to print something in the console — a hidden window only developers open (F12 in the browser); normal users never see it. Whatever you put inside the parentheses gets printed, but with a rule: if it’s in quotes, it’s literal text and prints exactly as written; if it has no quotes, the machine treats it as something to work out first. So console.log(2 + 3) prints 5 (it does the math), while console.log("2 + 3") prints 2 + 3 (it copies the text).',
  },
  recap: [
    'console.log("…") = “machine, print this in the console.” Only developers and testers see it — F12 opens it.',
    'Quotes mean literal text, copied exactly. No quotes means an expression, worked out first.',
    'The machine always evaluates what’s inside parentheses BEFORE handing it over — a rule you’ll meet everywhere.',
  ],
  PlayExtra: () => (
    <>
      <TryConsole />
      <CodeExercise def={FIRST_CODE_EXERCISE} />
    </>
  ),
}
