import { motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 1.1 — What is a value?
 * Viz: ValueZoo — loose values get sorted into typed pens.
 */

interface Token {
  label: string
  type: 'number' | 'string' | 'boolean'
  /** floating position before being sorted */
  free: { x: number; y: number }
  /** position inside its pen */
  penned: { x: number; y: number }
  /** step at which it gets sorted */
  sortAt: number
}

const TOKENS: Token[] = [
  { label: '25', type: 'number', free: { x: 90, y: 60 }, penned: { x: 75, y: 150 }, sortAt: 1 },
  { label: '3.14', type: 'number', free: { x: 200, y: 40 }, penned: { x: 135, y: 150 }, sortAt: 1 },
  { label: '"hello"', type: 'string', free: { x: 320, y: 65 }, penned: { x: 215, y: 150 }, sortAt: 2 },
  { label: 'true', type: 'boolean', free: { x: 150, y: 95 }, penned: { x: 355, y: 150 }, sortAt: 3 },
  { label: 'false', type: 'boolean', free: { x: 390, y: 45 }, penned: { x: 415, y: 150 }, sortAt: 3 },
  { label: '"42"', type: 'string', free: { x: 280, y: 100 }, penned: { x: 275, y: 150 }, sortAt: 6 },
]

const PENS = [
  { name: 'number', x: 45, width: 130 },
  { name: 'string', x: 185, width: 130 },
  { name: 'boolean', x: 325, width: 130 },
]

function ValueZoo({ stepIndex }: { stepIndex: number }) {
  const pensVisible = stepIndex >= 1
  return (
    <svg viewBox="0 0 500 260" className="w-full">
      <text x={45} y={28} fontFamily="var(--font-hand)" fontSize={20} fill="var(--color-ink-soft)">
        {pensVisible ? 'every value belongs to exactly one type' : 'some values, floating around'}
      </text>
      {pensVisible &&
        PENS.map((pen, i) => (
          <g key={pen.name}>
            <RoughRect x={pen.x} y={125} width={pen.width} height={80} seed={160 + i} strokeWidth={1.5} />
            <text x={pen.x + pen.width / 2} y={228} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={19} fontWeight={700} fill="var(--color-ink)">
              {pen.name}
            </text>
          </g>
        ))}
      {TOKENS.map((token, i) => {
        const sorted = stepIndex >= token.sortAt
        const pos = sorted ? token.penned : token.free
        const color =
          token.type === 'number' ? 'var(--color-marker-yellow)' : token.type === 'string' ? 'var(--color-marker-teal)' : 'var(--color-marker-coral)'
        return (
          <motion.g key={i} animate={{ x: pos.x, y: pos.y }} transition={{ type: 'spring', damping: 15 }}>
            <ellipse cx={0} cy={0} rx={30} ry={19} fill={sorted ? color : 'var(--color-paper-raised)'} opacity={0.55} />
            <ellipse cx={0} cy={0} rx={30} ry={19} fill="none" stroke="var(--color-ink)" strokeWidth={1.6} />
            <text x={0} y={5} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12.5} fontWeight={600} fill="var(--color-ink)">
              {token.label}
            </text>
          </motion.g>
        )
      })}
    </svg>
  )
}

export const lesson11: LessonDef = {
  id: '1.1',
  hook: (
    <>
      <p>
        Before variables can make sense, meet the thing they hold:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          values
        </HighlightMark>
        . A value is one piece of data — the number 25, the text "hello", the answer true. Every
        program you’ll ever write is, at heart, values being remembered, changed and compared.
      </p>
      <p>
        And every value comes with a <em>type</em> — what kind of thing it is — which decides what
        you’re allowed to do with it. You can multiply two numbers; you can’t sensibly multiply two
        sentences.
      </p>
    </>
  ),
  steps: [
    {
      id: 'floating',
      caption:
        'Here are six values a program might work with. Right now they look like a jumble — but the machine never sees them that way. To the machine, every value belongs to exactly one category.',
    },
    {
      id: 'numbers',
      caption:
        'First pen: number. Whole numbers, decimals, negatives — in JavaScript they’re all one type. Numbers are for math: add them, compare them, count with them.',
    },
    {
      id: 'strings',
      caption:
        'Second pen: string — any text, wrapped in quotes. The name means “a string of characters.” Strings are for humans to read: names, messages, button labels.',
    },
    {
      id: 'booleans',
      caption:
        'Third pen: boolean — a type with only two values in the entire universe: true and false. It exists to answer yes/no questions, and in Phase 2 it will power every decision a program makes.',
    },
    {
      id: 'rules',
      caption:
        'And the pen decides the RULES. Numbers can be added and compared. Strings can be glued and measured. Booleans can steer decisions. What a value is allowed to DO is set entirely by its type — that’s the whole point of sorting them.',
    },
    {
      id: 'predict-42',
      caption: 'One value is still floating: "42". Digits… but wearing quotes. Where does it belong?',
      prediction: {
        question: 'The value "42" — written WITH quotes. Which pen does it go into?',
        options: [
          'number — it’s clearly a number',
          'string — the quotes make it text, even though the characters are digits',
          'Both pens at once',
        ],
        correctIndex: 1,
        why: 'Quotes decide. "42" is a two-character piece of TEXT — the machine won’t do math with it the way it would with 42. This distinction causes real bugs constantly (form inputs arrive as text!), and lesson 1.9 is dedicated to the strange things that happen when the two meet.',
      },
    },
    {
      id: 'sorted',
      caption:
        'Into the string pen it goes. That’s the whole idea: every value has exactly one type, and the type sets the rules. There are a few more types to meet later (you’ll love null and undefined) — but number, string and boolean carry most of programming.',
    },
  ],
  Viz: ValueZoo,
  underTheHood: (
    <>
      <p>
        JavaScript has <strong>seven primitive types</strong> in total. You now know the big
        three: <code>number</code>, <code>string</code>, <code>boolean</code>.
      </p>
      <p>
        Coming soon: <code>undefined</code> and <code>null</code> (two flavors of “nothing”,
        lesson 1.7), plus two rare ones (<code>bigint</code> for astronomically large numbers,{' '}
        <code>symbol</code> for special labels) that you can safely ignore for months.
      </p>
      <p>
        “Primitive” means a single, simple value — as opposed to collections like arrays and
        objects, which arrive in Phase 4.
      </p>
      <p>
        Why do types exist at all? Because the machine stores everything as numbers-in-boxes
        (lesson 0.4), it needs to know how to <em>interpret</em> a box: the same stored bits mean
        one thing read as a number and something else read as text. The type is that
        reading-instruction. And it decides behavior: <code>25 + 25</code> is 50, but{' '}
        <code>"25" + "25"</code> glues text together into "2525". Same characters, different type,
        completely different result — remember this one, it’s a famous interview moment.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'true (no quotes) is a boolean. So what type is "true" — WITH the quotes? Type the type name.',
      accept: ['string', 'a string', 'String'],
      placeholder: 'type your answer…',
      why: 'Quotes make it a string that merely spells the word true — and 1 would be a number. Three lookalikes, three different types: the wrapper decides, not the looks.',
    },
    {
      kind: 'type-output',
      question: 'What type is 3.5? Type the exact word.',
      accept: ['number', 'Number'],
      placeholder: 'type your answer…',
      why: 'JavaScript has ONE number type covering whole numbers and decimals alike — there is no separate “decimal” or “integer” type. (Many languages split them; JS keeps it simple.)',
    },
    {
      kind: 'type-output',
      question: 'A user types 100 into a form on a web page. Type the exact value the program receives — include quotes if they belong there.',
      accept: ['"100"', "'100'"],
      placeholder: 'the value, quoted or not…',
      why: 'The string "100"! Form inputs deliver TEXT — everything typed into a text box arrives as a string, even digits. Forgetting this is one of the most common real-world bugs, and as a tester you’ll write cases that catch exactly it.',
    },
  ],
  teachBack: {
    prompt:
      'Explain to a friend: what is a value, what is a type, and why are 42 and "42" two completely different things to a computer?',
    modelAnswer:
      'A value is one piece of data a program works with — like 25, "hello", or true. Every value has a type: number, string (text in quotes), or boolean (only true/false). The type is like a category tag that tells the machine what the value IS and what can be done with it — you can do math with numbers, but text just gets glued together. So 42 is a number the machine can calculate with, while "42" — because of the quotes — is just two characters of text. Same symbols, different type, totally different behavior.',
  },
  recap: [
    'A value = one piece of data. Every value has exactly one type, and the type sets the rules.',
    'The big three: number (all math), string (text in quotes), boolean (only true or false).',
    'Quotes decide: 42 is a number, "42" is text. Form inputs always arrive as text — a classic bug source.',
  ],
}
