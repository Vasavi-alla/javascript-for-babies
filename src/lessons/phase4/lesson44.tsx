import { AnimatePresence, motion } from 'motion/react'
import { RoughLine, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'

/**
 * 4.4 — Objects
 * Viz: ObjectLocker — the object as labeled compartments (key → value).
 * Dot access shines a lookup on a label; bracket access holds a paper note
 * (the variable's value) up against the labels; a nested object is a smaller
 * locker inside a compartment; assigning to a missing key creates one.
 */

const CODE = `const book = {
  title: "The Hobbit",
  pages: 310,
  author: { name: "Tolkien", born: 1892 },
};

console.log(book.title);
console.log(book.author.name);

console.log(book["pages"]);

book.rating = 5;
console.log(book.publisher);`

const GREET_CODE = `const greetings = {
  en: "Hello!",
  ta: "Vanakkam!",
  hi: "Namaste!",
};

// which language? decided while the app RUNS —
// the phone's settings, a dropdown, a login…
const lang = "ta";

console.log(greetings[lang]);
console.log(greetings.lang);`

interface Compartment {
  k: string
  v: string
  nested?: { k: string; v: string }[]
  state?: 'read' | 'new' | 'ghost'
}

interface View {
  comps: Compartment[]
  /** the variable name shown on the object's tag */
  name?: string
  /** the paper note used for bracket access */
  note: string | null
  outToken: string | null
  console: string[]
  /** small appearing annotation for elaboration-only steps */
  badge?: string
}

const BASE: Compartment[] = [
  { k: 'title', v: '"The Hobbit"' },
  { k: 'pages', v: '310' },
  { k: 'author', v: '', nested: [{ k: 'name', v: '"Tolkien"' }, { k: 'born', v: '1892' }] },
]

const GREET: Compartment[] = [
  { k: 'en', v: '"Hello!"' },
  { k: 'ta', v: '"Vanakkam!"' },
  { k: 'hi', v: '"Namaste!"' },
]

const VIEWS: View[] = [
  { comps: BASE, note: null, outToken: null, console: [] },
  {
    comps: [{ ...BASE[0], state: 'read' }, BASE[1], BASE[2]],
    note: null, outToken: '"The Hobbit"', console: ['The Hobbit'],
  },
  {
    comps: [BASE[0], BASE[1], { ...BASE[2], state: 'read' }],
    note: null, outToken: '"Tolkien"', console: ['The Hobbit', 'Tolkien'],
  },
  {
    comps: [BASE[0], { ...BASE[1], state: 'read' }, BASE[2]],
    note: '"pages" — written right there', outToken: '310', console: ['The Hobbit', 'Tolkien', '310'],
  },
  {
    comps: [GREET[0], GREET[1], GREET[2]],
    name: 'greetings',
    note: null, outToken: null, console: [],
  },
  {
    comps: [GREET[0], { ...GREET[1], state: 'read' }, GREET[2]],
    name: 'greetings',
    note: 'lang  →  "ta"', outToken: '"Vanakkam!"', console: ['Vanakkam!', 'undefined'],
  },
  {
    comps: [GREET[0], { ...GREET[1], state: 'read' }, GREET[2]],
    name: 'greetings',
    note: 'lang  →  "ta"', outToken: '"Vanakkam!"', console: ['Vanakkam!', 'undefined'],
    badge: 'brackets exist for RUNTIME keys: settings[toggle], config[environment]',
  },
  {
    comps: [...BASE, { k: 'rating', v: '5', state: 'new' }],
    note: null, outToken: null, console: ['The Hobbit', 'Tolkien', '310'],
  },
  {
    comps: [...BASE, { k: 'rating', v: '5' }, { k: 'publisher', v: '', state: 'ghost' }],
    note: null, outToken: 'undefined', console: ['The Hobbit', 'Tolkien', '310', 'undefined'],
  },
]

function ObjectLocker({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      <RoughRect x={20} y={18} width={92} height={26} seed={471} fill="var(--color-marker-yellow)" fillStyle="solid" strokeWidth={1.5} />
      <text x={66} y={36} textAnchor="middle" fontFamily="var(--font-code)" fontSize={13} fontWeight={700} fill="var(--color-ink)">
        {view.name ?? 'book'}
      </text>
      <text x={120} y={36} fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">
        — properties: key → value, fetched by NAME
      </text>

      {view.comps.map((c, i) => {
        const y = 56 + i * 46
        const ghost = c.state === 'ghost'
        return (
          <motion.g key={c.k} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}>
            {/* key label */}
            <RoughRect
              x={40}
              y={y}
              width={104}
              height={34}
              seed={480 + i}
              strokeWidth={c.state === 'read' ? 2.6 : 1.6}
              stroke={ghost ? 'var(--color-ink-soft)' : c.state === 'read' ? 'var(--color-marker-teal)' : c.state === 'new' ? 'var(--color-marker-coral)' : 'var(--color-ink)'}
              roughness={ghost ? 2.4 : 1.2}
              fill={c.state === 'new' ? 'color-mix(in srgb, var(--color-marker-coral) 20%, transparent)' : 'var(--color-sticky)'}
              fillStyle="solid"
            />
            <text x={92} y={y + 22} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12.5} fontWeight={700} fill={ghost ? 'var(--color-ink-soft)' : 'var(--color-ink)'}>
              {c.k}
            </text>
            <RoughLine x1={144} y1={y + 17} x2={172} y2={y + 17} seed={490 + i} strokeWidth={1.6} stroke={ghost ? 'var(--color-ink-soft)' : 'var(--color-ink)'} />

            {/* value side */}
            {c.nested ? (
              <g>
                <RoughRect x={176} y={y - 2} width={196} height={40} seed={500 + i} strokeWidth={1.6} stroke={c.state === 'read' ? 'var(--color-marker-teal)' : 'var(--color-ink)'} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
                <text x={186} y={y - 6} fontFamily="var(--font-hand)" fontSize={12} fill="var(--color-ink-soft)">
                  another object, living inside a property
                </text>
                {c.nested.map((n, j) => (
                  <text key={n.k} x={188 + j * 96} y={y + 22} fontFamily="var(--font-code)" fontSize={11} fill="var(--color-ink)">
                    <tspan fontWeight={700}>{n.k}</tspan>: {n.v}
                  </text>
                ))}
              </g>
            ) : ghost ? (
              <text x={186} y={y + 22} fontFamily="var(--font-hand)" fontSize={13.5} fill="var(--color-ink-soft)">
                no such property…
              </text>
            ) : (
              <text x={186} y={y + 22} fontFamily="var(--font-code)" fontSize={13} fill="var(--color-ink)">
                {c.v}
              </text>
            )}
          </motion.g>
        )
      })}

      {/* the bracket-access paper note */}
      <AnimatePresence>
        {view.note && (
          <motion.g initial={{ opacity: 0, rotate: -6, y: -10 }} animate={{ opacity: 1, rotate: -4, y: 0 }} exit={{ opacity: 0 }}>
            <RoughRect x={286} y={116} width={136} height={30} seed={511} fill="var(--color-sticky-pink, #fbd8dd)" fillStyle="solid" strokeWidth={1.5} />
            <text x={354} y={136} textAnchor="middle" fontFamily="var(--font-code)" fontSize={11.5} fontWeight={600} fill="var(--color-ink)"><WrapTspans text={view.note} x={354} maxPx={158} fontSize={11.5} code /></text>
            <text x={354} y={96} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
              brackets read the note,
            </text>
            <text x={354} y={110} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
              then find the label
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* value token */}
      <AnimatePresence>
        {view.outToken && (
          <motion.g
            key={view.outToken}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            <RoughRect
              x={300}
              y={20}
              width={116}
              height={26}
              seed={512}
              fill={view.outToken === 'undefined' ? 'color-mix(in srgb, var(--color-marker-coral) 35%, transparent)' : 'var(--color-marker-yellow)'}
              fillStyle="solid"
              strokeWidth={1.5}
            />
            <text x={358} y={38} textAnchor="middle" fontFamily="var(--font-code)" fontSize={11.5} fontWeight={700} fill="var(--color-ink)">
              {view.outToken}
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* elaboration badge */}
      <AnimatePresence>
        {view.badge && (
          <motion.text
            key={view.badge}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            x={220}
            y={250}
            textAnchor="middle"
            fontFamily="var(--font-hand)"
            fontSize={12.5}
            fontWeight={700}
            fill="var(--color-marker-coral)"
          ><WrapTspans text={view.badge} x={220} maxPx={330} fontSize={12.5} /></motion.text>
        )}
      </AnimatePresence>

      {/* console strip */}
      <RoughRect x={40} y={268} width={360} height={44} seed={513} strokeWidth={1.5} />
      <text x={52} y={264} fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">
        console
      </text>
      {view.console.length === 0 ? (
        <text x={220} y={294} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">
          (nothing printed yet)
        </text>
      ) : (
        <text x={58} y={294} fontFamily="var(--font-code)" fontSize={11.5} fill="var(--color-ink)">
          {view.console.slice(-1)[0] === 'undefined' ? (
            <tspan fill="var(--color-marker-coral)">undefined</tspan>
          ) : (
            view.console.slice(-1)[0]
          )}
          <tspan fill="var(--color-ink-soft)" fontFamily="var(--font-hand)" fontSize={12}>
            {'   '}(latest line)
          </tspan>
        </text>
      )}
    </svg>
  )
}

const PET_EXERCISE: CodeExerciseDef = {
  id: 'l43-pet',
  title: 'a record with a birthday',
  task: 'Model a pet as an object, celebrate its birthday by computing from what the object already knows, and attach a property whose key contains a space.',
  steps: [
    <>
      Create an object named <code>pet</code> with three properties, in this order:{' '}
      <code>name</code> = <code>"Biscuit"</code>, <code>kind</code> = <code>"hamster"</code>,{' '}
      <code>age</code> = <code>2</code>.
    </>,
    <>
      Birthday! Increase <code>pet.age</code> by 1 — computed <em>from its current value</em>, not
      typed as a fresh number.
    </>,
    <>
      Add a brand-new property whose key is <code>favorite toy</code> (yes, with the space) and
      value <code>"tiny wheel"</code>. Choose your accessor accordingly.
    </>,
    <>
      Print <code>pet.name</code>, then print the whole object.
    </>,
  ],
  starter: '',
  expectedOutput: ['Biscuit', '{"name":"Biscuit","kind":"hamster","age":3,"favorite toy":"tiny wheel"}'],
  mustUse: [
    { test: /pet\.age\s*(\+=\s*1|=\s*pet\.age\s*\+\s*1)|pet\[\s*["']age["']\s*\]\s*(\+=\s*1|=\s*pet\[\s*["']age["']\s*\]\s*\+\s*1)/, label: 'the new age is computed from the current age' },
    { test: /pet\s*\[\s*["']favorite toy["']\s*\]\s*=/, label: 'a key with a space can only be reached with brackets' },
  ],
  mustNotUse: [
    { test: /age\s*[:=]\s*3\b/, label: 'no hand-typed 3 — the object computes its own birthday' },
  ],
  modelAnswer: `const pet = {
  name: "Biscuit",
  kind: "hamster",
  age: 2,
};

pet.age = pet.age + 1;
pet["favorite toy"] = "tiny wheel";

console.log(pet.name);
console.log(pet);`,
}

export const lesson44: LessonDef = {
  id: '4.4',
  hook: (
    <>
      <p>
        Arrays answer “give me element number 2” — perfect when order is the point. But describe{' '}
        <em>one book</em> with an array and you get <code>["The Hobbit", 310, true]</code>… and a
        quiz: what did position 1 mean again? Pages? Rating? Data about <em>one thing</em> has
        parts with <strong>names</strong>, not positions.
      </p>
      <p>
        An{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          object
        </HighlightMark>{' '}
        stores <strong>properties</strong> — <code>key: value</code> pairs — under one name, and
        you fetch each value <em>by its key</em>: <code>book.title</code>, never “whatever sits
        third.” Arrays for many-of-the-same in order; objects for one-thing-with-named-parts.
      </p>
      <p>
        Nearly every piece of data your future tests receive is built from these two, nested into
        each other.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'create',
      caption:
        'Curly braces build the object. Each property is a key → value pair: title holds "The Hobbit", pages holds 310 — and author holds a whole OTHER OBJECT as its value. Values can be anything, including more objects; that’s how real-world data gets its shape.',
      highlightLines: [1, 2, 3, 4, 5],
    },
    {
      id: 'dot',
      caption:
        'book.title is dot access: “in book, fetch the property whose key is title.” No counting, no positions — the key IS the address. This is the everyday way to read a property when you know its name while writing the code.',
      highlightLines: [7],
    },
    {
      id: 'chain',
      caption:
        'book.author.name is two lookups, read left to right: first book.author fetches the inner object, then .name fetches from THAT. Chains like response.user.address.city are everyday JavaScript — each dot is one hop deeper.',
      highlightLines: [8],
    },
    {
      id: 'bracket-literal',
      caption:
        'The second way to read a property: brackets with a string — book["pages"] → 310. Notice: this is EXACTLY the same lookup as book.pages, character for character slower to type. If this were all brackets did, they’d be pointless decoration. So why do they exist? Because of what goes INSIDE them — next step, and it’s a power dot simply doesn’t have.',
      highlightLines: [10],
    },
    {
      id: 'bracket-runtime-problem',
      caption:
        'New scene: an app greeting its user. Which language? You CANNOT know while writing the code — it depends on whose phone opens the app. The answer arrives while the program RUNS, in a variable: lang holds "ta".',
      codeOverride: GREET_CODE,
      highlightLines: [7, 8, 9],
    },
    {
      id: 'bracket-dynamic',
      caption:
        'And here’s the bracket superpower: brackets EVALUATE what’s inside first. greetings[lang] → greetings["ta"] → "Vanakkam!". A dot can’t do this — greetings.lang hunts for a property literally named lang and finds undefined (see the console!).',
      codeOverride: GREET_CODE,
      highlightLines: [11, 12],
    },
    {
      id: 'bracket-dynamic-why',
      caption:
        'This is the real reason brackets exist: keys chosen while the program runs — the user’s language, settings[whicheverToggleWasClicked], config[environment] picking the right server in your future test suites.',
      codeOverride: GREET_CODE,
      highlightLines: [9, 11, 12],
    },
    {
      id: 'add',
      caption:
        'Back to the book. Assigning to a key that doesn’t exist CREATES the property: book.rating = 5 grew the object by one compartment. No declaration ceremony — objects grow the moment you write into them. (Same const-but-changed mystery as 4.1. Lesson 4.6 is coming for it.)',
      highlightLines: [12],
    },
    {
      id: 'missing',
      caption:
        'Reading a key that isn’t there — book.publisher — gives undefined, exactly like reading past an array’s end. No error, just “no such property.” Typos in property names fail SILENTLY this way, which makes book.titel one of the sneakiest bugs a beginner meets.',
      highlightLines: [13],
    },
  ],
  Viz: ObjectLocker,
  underTheHood: (
    <>
      <p>
        Property keys are strings under the hood — <code>{'{ title: … }'}</code> is shorthand
        for <code>{'{ "title": … }'}</code>. That is why any text can be a key, including{' '}
        <code>"favorite toy"</code> with a space (reachable only through brackets). Dot access is
        just bracket access with the string fixed at writing time: <code>book.title</code> and{' '}
        <code>book["title"]</code> are the same lookup.
      </p>
      <p>
        The two access styles split one job. <strong>Dot</strong>: you know the key while
        writing the code. <strong>Brackets</strong>: the key arrives at runtime — in a variable,
        from user input, built from other strings.
      </p>
      <p>
        Writing works through both, and writing to a missing key creates it; reading a missing key
        returns <code>undefined</code> without complaint.
      </p>
      <p>
        <strong>Fun fact:</strong> a paper dictionary works exactly like an object. Nobody asks for
        “the word on page 412” (position); you look up <em>pizza</em> (the key) and read its
        definition (the value). Other languages even name this structure a <em>dictionary</em> —
        JavaScript just says object.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Type exactly what this prints:',
      code: 'const user = { name: "Mia", age: 30 };\nconst k = "age";\nconsole.log(user[k]);',
      accept: ['30'],
      placeholder: 'type the console output…',
      why: 'Brackets evaluate what’s inside first: k holds "age", so user[k] is user["age"] → 30. With a dot, user.k would hunt for a property literally named k — and find undefined.',
    },
    {
      kind: 'type-output',
      question: 'Type exactly what this prints:',
      code: 'const user = { name: "Mia" };\nconsole.log(user.email);',
      accept: ['undefined'],
      placeholder: 'type the console output…',
      why: 'No email property exists, so the lookup answers undefined — no error. Misspelled keys fail the same silent way, which is why this one’s worth typing with your own hands.',
    },
    {
      kind: 'type-output',
      question: 'Type exactly what this prints:',
      code: 'const cfg = { theme: { dark: true } };\nconsole.log(cfg.theme.dark);',
      accept: ['true'],
      placeholder: 'type the console output…',
      why: 'Left to right, one hop per dot: cfg.theme fetches the inner object, then .dark fetches true from it. Nesting is just objects holding objects.',
    },
  ],
  PlayExtra: () => <CodeExercise def={PET_EXERCISE} />,
  teachBack: {
    prompt:
      'A friend asks: “when do I use book.title and when book[something]? Aren’t they the same?” Explain the real difference — and what happens when the property doesn’t exist.',
    modelAnswer:
      'They’re the same lookup underneath — every key is a string — but they get the key differently. Dot uses the exact name written in the code: book.title always means the "title" property. Brackets EVALUATE whatever is inside first: if key holds "pages", book[key] reads book["pages"] — so brackets are for keys that arrive at runtime (in variables, from input) or keys a dot can’t express, like "favorite toy" with a space. Reading a property that doesn’t exist returns undefined instead of erroring — handy, but it means a typo like book.titel fails silently. Writing is different: assigning to a missing key CREATES the property.',
  },
  recap: [
    'An object stores properties — key: value pairs — and you fetch values by KEY: one thing, named parts.',
    'Dot for keys known when you write the code; brackets evaluate an expression to get the key at runtime (and handle keys like "favorite toy").',
    'Reading a missing key → undefined (silent, typo-prone). Writing to a missing key → creates the property. Chains like a.b.c hop one property per dot.',
  ],
}
