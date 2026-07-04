import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 0.4 — Memory: the wall of boxes
 * Viz: MemoryWall — a grid of slots with addresses; a program borrows some,
 * stores values, and everything is wiped when it ends.
 */

const COLS = 6
const ROWS = 4
const BORROWED = [8, 9, 10] // cell indices the program borrows
const VALUES = ['25', '"hi"', 'true']

function MemoryWall({ stepIndex }: { stepIndex: number }) {
  const showAddresses = stepIndex >= 1
  const showBorrowed = stepIndex >= 2 && stepIndex <= 4
  const showValues = stepIndex >= 3 && stepIndex <= 4
  const wiped = stepIndex >= 5

  return (
    <svg viewBox="0 0 480 300" className="w-full">
      <text x={35} y={32} fontFamily="var(--font-hand)" fontSize={22} fill="var(--color-ink-soft)">
        memory (RAM)
      </text>
      {Array.from({ length: COLS * ROWS }, (_, i) => {
        const col = i % COLS
        const row = Math.floor(i / COLS)
        const x = 35 + col * 70
        const y = 48 + row * 54
        const borrowedIndex = BORROWED.indexOf(i)
        const isBorrowed = borrowedIndex !== -1
        return (
          <g key={i}>
            <RoughRect
              x={x}
              y={y}
              width={60}
              height={44}
              seed={120 + i}
              strokeWidth={1.5}
              fill={showBorrowed && isBorrowed ? 'var(--color-marker-yellow)' : undefined}
            />
            {showAddresses && (
              <text x={x + 5} y={y + 13} fontFamily="var(--font-code)" fontSize={8} fill="var(--color-ink-soft)">
                #{i + 1}
              </text>
            )}
            <AnimatePresence>
              {showValues && isBorrowed && (
                <motion.text
                  initial={{ opacity: 0, y: -18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ type: 'spring', damping: 15, delay: borrowedIndex * 0.15 }}
                  x={x + 30}
                  y={y + 32}
                  textAnchor="middle"
                  fontFamily="var(--font-hand)"
                  fontSize={19}
                  fontWeight={700}
                  fill="var(--color-ink)"
                >
                  {VALUES[borrowedIndex]}
                </motion.text>
              )}
            </AnimatePresence>
          </g>
        )
      })}
      <text x={35} y={286} fontFamily="var(--font-hand)" fontSize={18} fill="var(--color-ink-soft)">
        {wiped
          ? 'wiped clean — ready for the next program'
          : '…and billions more boxes just like these'}
      </text>
    </svg>
  )
}

export const lesson04: LessonDef = {
  id: '0.4',
  hook: (
    <>
      <p>
        The machine executes millions of instructions per second — but here’s the catch: by itself,
        each instruction is instantly forgotten. For a program to do anything useful, it needs
        somewhere to <em>keep things</em> while it works: the score so far, the name you typed, the
        page you’re on.
      </p>
      <p>
        That somewhere is <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">memory</HighlightMark>{' '}
        — and the picture you’re about to see, a giant wall of tiny boxes, will come back in{' '}
        <em>every</em> phase of this journey. It’s the single most reused drawing in the whole app.
      </p>
    </>
  ),
  steps: [
    {
      id: 'wall',
      caption:
        'This is memory — RAM. Think of it as the machine’s workbench: a huge wall of tiny boxes, each able to hold one small piece of information. A real machine has billions of them; here are 24.',
    },
    {
      id: 'addresses',
      caption:
        'Every box has a number — its address — like houses on a street. The machine never searches for a box; it goes straight to “box #14,940,233” instantly. That instant jump is what makes RAM so fast.',
    },
    {
      id: 'borrowed',
      caption:
        'When a program starts, it borrows some boxes for itself. Your browser tab is borrowing millions of them right now, just to show you this page.',
    },
    {
      id: 'values',
      caption:
        'And into those boxes go the program’s values — a number, some text, a yes/no. This is what “the machine remembers something” physically means: a value, sitting in a numbered box.',
    },
    {
      id: 'predict-wipe',
      caption: 'Now the program finishes — say, you close the tab. What happens to the values it stored in its boxes?',
      prediction: {
        question: 'The program ends (you close the tab). What happens to the values it stored in memory?',
        options: [
          'They stay in the boxes forever',
          'The boxes are wiped clean and lent to other programs',
          'The values are automatically saved to a file first',
        ],
        correctIndex: 1,
        why: 'RAM is short-term working memory: when a program ends (or the power goes off), its boxes are wiped and handed to whoever needs them next. Nothing is saved automatically — anything worth keeping must be deliberately written to storage (your disk). That is exactly why apps have a Save button.',
      },
    },
    {
      id: 'wiped',
      caption:
        'Wiped and re-lent. Short-term by design — and blazing fast because of it.',
    },
    {
      id: 'disk',
      caption:
        'Where do things live permanently, then? On the disk: slower, but it survives power-off. Workbench versus cupboard; you’ll use both pictures forever.',
    },
  ],
  Viz: MemoryWall,
  underTheHood: (
    <>
      <p>
        What’s actually inside a box? A tiny number — that’s all memory can physically hold. One
        box (a <strong>byte</strong>) stores a number from 0 to 255.
      </p>
      <p>
        Everything else is built from those numbers by agreement: the letter <code>A</code> is
        stored as 65, colors as three numbers (red, green, blue), sound as thousands of numbers
        per second. Text, photos, games — <em>all of it is numbers in boxes</em>. That’s honestly
        the entire secret of computers.
      </p>
      <p>
        The two-tier system has real names: <strong>RAM</strong> (the workbench — fast, small-ish,
        wiped when power stops; your laptop has maybe 8–16 GB, billions of boxes) and{' '}
        <strong>storage/disk</strong> (the cupboard — much bigger, much slower, permanent; where
        files live).
      </p>
      <p>
        A program constantly pulls things from the cupboard onto the workbench, works on them
        there, and must deliberately put results back if it wants to keep them.
      </p>
      <p>
        Now the good news for you specifically: in JavaScript, <strong>you will never juggle box
        addresses yourself</strong>. The engine picks the boxes and tracks them for you.
      </p>
      <p>
        It even sweeps up the ones you no longer need — a janitor called the{' '}
        <strong>garbage collector</strong> (you’ll properly meet it in Phase 5). What YOU get to
        do is attach <em>names</em> to boxes — and that, exactly that, is what a variable is.
        Which is the very next phase.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'While a program is running, it keeps its working values on the fast, temporary workbench. Type its three-letter name.',
      accept: ['RAM', 'ram', 'Ram'],
      placeholder: 'three letters…',
      why: 'RAM — where access is nearly instant. The disk is the permanent cupboard, for keeping things across power-off — far too slow for every-instruction work.',
    },
    {
      question: 'Why do apps have a Save button at all?',
      options: [
        'Tradition — everything is saved automatically anyway',
        'Because work-in-progress lives in RAM, which is wiped when the program ends; saving deliberately copies it to disk',
        'To compress the file and make it smaller',
      ],
      correctIndex: 1,
      why: 'Unsaved work exists only on the workbench (RAM). Close the program — or lose power — and the workbench is cleared. Save = “copy this to the cupboard (disk) where it survives.”',
    },
    {
      kind: 'type-output',
      question: 'A photo of your dog, the text of this page, a song — in memory they are ALL stored as ___. Type the one word.',
      accept: ['numbers', 'Numbers'],
      placeholder: 'one word…',
      why: 'Numbers — boxes can only hold small numbers. A photo is a long run of them (color values for every pixel) plus an agreement about how to read them. Text, sound, video — same story. It’s numbers all the way down.',
    },
  ],
  teachBack: {
    prompt:
      'Explain to a friend, using the workbench-and-cupboard picture (or your own): what is RAM, what is disk storage, and why does unsaved work disappear when a program crashes?',
    modelAnswer:
      'A computer has two kinds of memory. RAM is like a workbench: while a program runs, it keeps everything it’s working on there, in billions of tiny numbered boxes, because grabbing things from the workbench is instant. The disk is like a cupboard: much bigger and permanent, but slower. The workbench gets cleared every time a program ends or the power goes — that’s why unsaved work vanishes in a crash. Saving means deliberately copying your work from the workbench into the cupboard, where it survives.',
  },
  recap: [
    'RAM = the workbench: billions of numbered boxes, instant to reach, wiped when the program ends.',
    'Disk = the cupboard: big, permanent, slower. Save = copy from workbench to cupboard.',
    'Everything in memory is numbers — text, photos, sound — by agreed-upon encodings. And in JS, the engine manages the boxes; you just attach names (next phase!).',
  ],
}
