import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 1.6 — Strings
 * Viz: StringTrain — characters as numbered train cars; gluing; template slots.
 */

const CODE = `let name = "Ada";
console.log(name.length);
console.log(name[0]);
console.log("Hi, " + name + "!");
console.log(\`Hi, \${name}!\`);`

function TrainCar({ x, y, char, index, seed, highlight }: { x: number; y: number; char: string; index?: number; seed: number; highlight?: boolean }) {
  return (
    <g>
      <RoughRect x={x} y={y} width={44} height={48} seed={seed} strokeWidth={1.6} fill={highlight ? 'var(--color-marker-yellow)' : undefined} />
      <text x={x + 22} y={y + 31} textAnchor="middle" fontFamily="var(--font-code)" fontSize={19} fontWeight={600} fill="var(--color-ink)">
        {char === ' ' ? '␣' : char}
      </text>
      {index !== undefined && (
        <text x={x + 22} y={y + 65} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={15} fill="var(--color-ink-soft)">
          {index}
        </text>
      )}
    </g>
  )
}

function StringTrain({ stepIndex }: { stepIndex: number }) {
  const highlightZero = stepIndex === 2 || stepIndex === 3
  const showImmutable = stepIndex === 4
  const showGlued = stepIndex >= 5
  const glued = 'Hi, Ada!'
  return (
    <svg viewBox="0 0 440 280" className="w-full">
      <text x={40} y={32} fontFamily="var(--font-hand)" fontSize={20} fill="var(--color-ink-soft)">
        "Ada" — a train of characters
      </text>
      {'Ada'.split('').map((char, i) => (
        <TrainCar key={i} x={60 + i * 50} y={48} char={char} index={i} seed={190 + i} highlight={highlightZero && i === 0} />
      ))}

      {/* the length badge */}
      <AnimatePresence>
        {stepIndex >= 1 && (
          <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: 'spring', damping: 14 }} style={{ transformOrigin: '300px 72px' }}>
            <RoughRect x={245} y={52} width={130} height={40} seed={196} fill="var(--color-marker-teal)" />
            <text x={310} y={78} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={19} fontWeight={700} fill="var(--color-ink)">
              .length → 3
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* position note */}
      <AnimatePresence>
        {highlightZero && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <text x={60} y={148} fontFamily="var(--font-hand)" fontSize={18} fill="var(--color-marker-coral)">
              positions start at 0 — car [0] is “A”
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* the immutable proof: a brand-new train */}
      <AnimatePresence>
        {showImmutable && (
          <motion.g initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ type: 'spring', damping: 16 }}>
            <text x={40} y={172} fontFamily="var(--font-hand)" fontSize={20} fill="var(--color-ink-soft)">
              name.toUpperCase() → a brand-NEW train
            </text>
            {'ADA'.split('').map((char, i) => (
              <TrainCar key={i} x={60 + i * 50} y={186} char={char} seed={230 + i} />
            ))}
            <text x={30} y={262} fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-marker-teal)">
              “Ada” itself survives untouched — changes build NEW trains
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* the glued train */}
      <AnimatePresence>
        {showGlued && (
          <motion.g initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ type: 'spring', damping: 16 }}>
            <text x={40} y={172} fontFamily="var(--font-hand)" fontSize={20} fill="var(--color-ink-soft)">
              {stepIndex >= 6 ? '`Hi, ${name}!` builds the same train' : '"Hi, " + name + "!" — three trains glued'}
            </text>
            {glued.split('').map((char, i) => (
              <TrainCar key={i} x={30 + i * 48} y={186} char={char} seed={200 + i} highlight={stepIndex >= 7 && i >= 4 && i <= 6} />
            ))}
            {stepIndex >= 7 && (
              <text x={30} y={262} fontFamily="var(--font-hand)" fontSize={16} fill="var(--color-marker-coral)">
                the ${'{name}'} slot was filled in with the variable’s value
              </text>
            )}
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  )
}

const FULLNAME_EXERCISE: CodeExerciseDef = {
  id: 'd1b-fullname',
  title: 'glue a full name',
  task: 'Two halves of a name live in two variables. Produce the full name — without ever typing it yourself.',
  steps: [
    <>
      <code>firstName</code> holds <code>"Ada"</code>; <code>lastName</code> holds{' '}
      <code>"Lovelace"</code>.
    </>,
    <>
      Exactly ONE <code>console.log</code>, and the full name must be <em>built from the two
      variables</em> — the text <code>"Ada Lovelace"</code> may not appear in your code.
    </>,
    <>Check the expected output closely: there’s a space between the names. It has to come from somewhere.</>,
  ],
  starter: '',
  expectedOutput: ['Ada Lovelace'],
  mustUse: [
    { test: /firstName\s*\+/, label: 'the sentence is glued from the firstName variable' },
    { test: /["']\s["']/, label: 'the space is supplied as its own piece' },
  ],
  mustNotUse: [{ test: /["']Ada Lovelace["']/, label: 'the finished name may not be typed by hand' }],
  modelAnswer: `const firstName = "Ada";
const lastName = "Lovelace";

console.log(firstName + " " + lastName);`,
}

export const lesson16: LessonDef = {
  id: '1.6',
  hook: (
    <>
      <p>
        Strings are the type your users actually see: names, messages, button labels, error texts.
        And here’s the picture that unlocks everything about them: a string isn’t a blob — it’s a{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          train of characters, each with a numbered seat
        </HighlightMark>
        . Once you see the train, lengths, positions and cutting pieces out all become obvious.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'train',
      caption:
        '"Ada" looks like one thing, but the machine stores it as three cars: A, d, a — coupled in order, each with a seat number underneath. Even the quotes aren’t stored; they were just the wrapper.',
      highlightLines: [1],
    },
    {
      id: 'length',
      caption:
        'Every string knows its own size: name.length counts the cars — 3. (Note the dot: just like console.log, the dot means “look inside” — strings come with built-in tools attached.)',
      highlightLines: [2],
    },
    {
      id: 'predict-index',
      caption: 'Line 3 asks for name[0] — the car at position 0. Which letter comes out?',
      highlightLines: [3],
      prediction: {
        question: 'name is "Ada". What does name[0] give?',
        options: ['A — the machine counts positions from 0', 'd — position 0 means “skip none”… so the 2nd?', 'An error — there is no position 0'],
        correctIndex: 0,
        why: 'Computers count positions from 0, not 1. Position 0 = the first car, position 1 = the second, and the last car of a 3-car train sits at position 2 (length minus one!). This feels wrong for about a week, then becomes second nature — and it works identically for arrays in Phase 4.',
      },
    },
    {
      id: 'index',
      caption:
        'Position 0 lights up: “A”. Burn in the consequence: the LAST character of any string is at position length − 1. Off-by-one mistakes around this are one of programming’s most classic bug families — you’ll catch them in others’ code someday.',
      highlightLines: [3],
    },
    {
      id: 'immutable',
      caption:
        'One secret before gluing: strings are IMMUTABLE — no car can ever be swapped in place. name.toUpperCase() doesn’t change "Ada"; it manufactures a brand-NEW train, "ADA", and hands it back. Every string “change” works this way.',
      highlightLines: [1],
    },
    {
      id: 'concat',
      caption:
        'Line 4 glues trains together with +. Yes — the SAME + you used for math! With strings on board, + means “couple these trains,” not “add.” (What happens when a number and a string meet at the + …? Lesson 1.9. It’s wild.)',
      highlightLines: [4],
    },
    {
      id: 'template',
      caption:
        'Line 5 builds the identical train the modern way: backticks ` instead of quotes, with ${…} slots. Read it aloud and notice how much more it looks like the final result.',
      highlightLines: [5],
    },
    {
      id: 'slots-evaluated',
      caption:
        'Each ${…} slot is EVALUATED first — the work-it-out-first rule from 0.3 — and the result is spliced into the train. This is how professionals build text: test messages, selectors, failure reports.',
      highlightLines: [5],
    },
  ],
  Viz: StringTrain,
  underTheHood: (
    <>
      <p>
        A fact that will save you a debugging session someday: strings are{' '}
        <strong>immutable</strong> — the train can never be modified in place. (And here the train
        picture reaches its limit: real train cars are famously uncoupled and swapped around — a
        string never allows it.) You can’t swap car 0
        of "Ada" to make "Bda"; every string operation (uppercasing, trimming, gluing) builds a{' '}
        <em>brand-new train</em> and leaves the original untouched. So{' '}
        <code>name.toUpperCase()</code> hands you "ADA" as a new string — <code>name</code> itself
        still points at "Ada" until you reassign it.
      </p>
      <p>
        Strings come with a rich toolbox attached, all reachable with the dot — recognize the
        pattern <em>string, dot, tool</em>, no need to memorize the list today.
      </p>
      <p>
        <code>.toUpperCase()</code> and <code>.toLowerCase()</code> build a new train with every
        letter recased.
      </p>
      <p>
        <code>.trim()</code> strips spaces from the ends — form input’s best friend, since users
        love adding stray spaces.
      </p>
      <p>
        <code>.includes("da")</code> asks “is this bit aboard, anywhere in the train?” — true or
        false.
      </p>
      <p>
        <code>.slice(0, 2)</code> copies out cars 0 up to but not including 2, giving you "Ad".
      </p>
      <p>
        Why three kinds of quotes? <code>"double"</code> and <code>'single'</code> are identical —
        pick one, stay consistent.
      </p>
      <p>
        Backticks <code>`…`</code> are the upgrade: they allow <code>${'{expression}'}</code> slots.
        Anything inside is <em>evaluated</em> first — the rule from lesson 0.3 — so{' '}
        <code>`Total: ${'{2 + 3}'}`</code> becomes "Total: 5".
      </p>
      <p>
        Backtick strings can also span multiple lines with a real line break inside them — no{' '}
        <code>+</code> gluing needed:
      </p>
      <p>
        <code>{'`Line one\nLine two`'}</code> is one single string containing an actual newline.
      </p>
      <p>
        For a future automation tester this is daily bread:{' '}
        <code>`Expected ${'{expected}'} but got ${'{actual}'}`</code> is the shape of every good
        failure message you’ll ever write.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Type exactly what prints:',
      code: 'let word = "QA";\nconsole.log(word[1]);',
      accept: ['A'],
      why: 'Positions from 0: word[0] is "Q", word[1] is "A". A 2-car train’s last seat is number 1 (length − 1).',
    },
    {
      kind: 'type-output',
      question: 'Type exactly what the console shows for console.log("5" + "5"):',
      accept: ['55'],
      why: 'Both values are strings, so + couples the trains: "55" (the console shows it without quotes). No math happened — these are characters, not numbers. Keep this one warm; lesson 1.9 asks what happens when "5" + 5 mixes the types…',
    },
    {
      kind: 'type-output',
      question: 'Type the exact string that `Score: ${10 * 2}` produces — every character:',
      accept: ['Score: 20'],
      placeholder: 'the whole text…',
      why: 'Inside ${…} the machine EVALUATES (work-it-out-first, lesson 0.3), then splices the result into the train: "Score: 20". Ordinary quotes would have printed the slot literally — backticks are what switch the slots on.',
    },
  ],
  PlayExtra: () => <CodeExercise def={FULLNAME_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain to a friend: what is a string really (use the train picture), why does counting start at 0, and what makes backtick strings special?',
    modelAnswer:
      'A string is text stored as a train of characters, each car numbered — but the numbering starts at 0, so the first character is at position 0 and the last is at length minus 1. That’s just how computers count positions: “how many cars to skip from the start.” You can ask a string its .length, grab a car with [position], and glue trains with +. Backtick strings (`…`) are the modern upgrade: they contain ${…} slots where the machine evaluates whatever’s inside and splices the result into the text — so `Hi, ${name}!` builds "Hi, Ada!" automatically. Much easier to read than gluing pieces with +.',
  },
  recap: [
    'A string = a train of characters with numbered seats — starting at 0. Last car = length − 1.',
    'Strings are immutable: every operation builds a NEW string. name.toUpperCase() doesn’t change name.',
    'Backticks + ${…} slots = template literals: the slot is evaluated and filled in. The professional way to build text.',
  ],
}
