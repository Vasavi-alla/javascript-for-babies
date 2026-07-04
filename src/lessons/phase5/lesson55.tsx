import { AnimatePresence, motion } from 'motion/react'
import { HandArrow, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 5.5 — Prototypes
 * The hidden link every object carries. Property lookup, upgraded to the
 * whole truth: miss locally → climb the [[Prototype]] chain, link by link,
 * ending at Object.prototype → null. Methods shared once, borrowed by many.
 * PrototypeChain viz: lockers roped upward, a lookup ray climbing.
 */

const CODE = `const animal = {
  eats: true,
  sleep() {
    return "zzz";
  },
};

const rabbit = Object.create(animal);
rabbit.hops = true;

console.log(rabbit.hops);
console.log(rabbit.eats);
console.log(rabbit.color);
console.log(rabbit.sleep());

console.log(Object.keys(rabbit));`

interface ChainBox {
  title: string
  lines: string[]
  hot?: boolean
}
interface View {
  boxes: ChainBox[]
  /** where the lookup ray is: index into boxes, or null */
  seek?: { name: string; at: number; found: boolean }
  showEnd?: boolean
  console: string[]
  note: string
  /** a small appearing annotation for steps that add insight without moving the lookup */
  badge?: string
}

const RABBIT: ChainBox = { title: 'rabbit', lines: ['hops: true'] }
const ANIMAL: ChainBox = { title: 'animal (rabbit’s prototype)', lines: ['eats: true', 'sleep: ƒ'] }
const OBJPROTO: ChainBox = { title: 'Object.prototype', lines: ['toString: ƒ, …'] }

const VIEWS: View[] = [
  {
    boxes: [RABBIT, ANIMAL],
    console: [],
    note: 'Object.create(animal) → a new object whose hidden LINK points at animal — nothing was copied',
  },
  {
    boxes: [{ ...RABBIT, hot: true }, ANIMAL],
    seek: { name: 'hops', at: 0, found: true },
    console: ['true'],
    note: 'rabbit.hops — found on rabbit itself (an OWN property). No climbing needed',
  },
  {
    boxes: [RABBIT, { ...ANIMAL, hot: true }],
    seek: { name: 'eats', at: 1, found: true },
    console: ['true', 'true'],
    note: 'rabbit.eats — miss on rabbit → CLIMB the link → found on animal. rabbit “has” eats without owning it',
  },
  {
    boxes: [RABBIT, { ...ANIMAL, hot: true }],
    seek: { name: 'color', at: 1, found: false },
    console: ['true', 'true', 'undefined'],
    note: 'rabbit.color — miss on rabbit, climb, miss on animal too. The chain is exhausted → undefined, only NOW',
  },
  {
    boxes: [RABBIT, { ...ANIMAL, hot: true }],
    seek: { name: 'sleep', at: 1, found: true },
    console: ['true', 'true', 'undefined', 'zzz'],
    note: 'rabbit.sleep() — same climb, and it finds a FUNCTION on animal',
  },
  {
    boxes: [RABBIT, { ...ANIMAL, hot: true }],
    seek: { name: 'sleep', at: 1, found: true },
    console: ['true', 'true', 'undefined', 'zzz'],
    note: 'sleep lives ONCE on animal — a thousand rabbits could all borrow this one function',
    badge: 'called as rabbit.sleep() — the 5.4 dot rule still sets this = rabbit, even for a borrowed method',
  },
  {
    boxes: [{ ...RABBIT, hot: true }, ANIMAL],
    console: ['true', 'true', 'undefined', 'zzz', '["hops"]'],
    note: 'Object.keys lists OWN properties only — inherited ones don’t show: ["hops"]',
  },
  {
    boxes: [RABBIT, ANIMAL, OBJPROTO],
    showEnd: true,
    console: ['true', 'true', 'undefined', 'zzz', '["hops"]'],
    note: 'the full chain: rabbit → animal → Object.prototype → null. This is the answer to lesson 0’s mysteries',
  },
  {
    boxes: [RABBIT, ANIMAL, OBJPROTO],
    showEnd: true,
    console: ['true', 'true', 'undefined', 'zzz', '["hops"]'],
    note: 'arrays climb their own chain the same way: array → Array.prototype (push, map live there!) → Object.prototype → null',
    badge: 'you have been living on prototype chains since your very first console.log',
  },
]

function PrototypeChain({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 350" className="w-full">
      {view.boxes.map((b, i) => {
        const y = 190 - i * 72
        return (
          <motion.g key={b.title} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            <RoughRect x={60} y={y} width={230} height={54} seed={881 + i} strokeWidth={b.hot ? 2.6 : 1.8} stroke={b.hot ? 'var(--color-marker-teal)' : 'var(--color-ink)'} fill={b.hot ? 'color-mix(in srgb, var(--color-marker-teal) 10%, transparent)' : 'var(--color-paper-raised, #fff)'} fillStyle="solid" />
            <text x={68} y={y - 5} fontFamily="var(--font-hand)" fontSize={12} fill="var(--color-ink-soft)">{b.title}</text>
            {b.lines.map((line, j) => (
              <text key={line} x={74} y={y + 22 + j * 18} fontFamily="var(--font-code)" fontSize={11} fill="var(--color-ink)">{line}</text>
            ))}
            {i < view.boxes.length - 1 && (
              <HandArrow from={{ x: 175, y: y - 4 }} to={{ x: 175, y: y - 16 }} curve={0} seed={891 + i} stroke="var(--color-pencil-blue)" strokeWidth={2.4} headLength={9} />
            )}
          </motion.g>
        )
      })}
      <text x={300} y={150} fontFamily="var(--font-hand)" fontSize={12} fill="var(--color-pencil-blue)">
        hidden links
      </text>
      <text x={300} y={166} fontFamily="var(--font-hand)" fontSize={12} fill="var(--color-pencil-blue)">
        [[Prototype]]
      </text>

      {view.showEnd && (
        <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }} x={175} y={36} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12.5} fontWeight={700} fill="var(--color-marker-coral)">
          ↑ null — the chain ends here
        </motion.text>
      )}

      <AnimatePresence mode="wait">
        {view.seek && (
          <motion.g key={view.seek.name} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <RoughRect x={310} y={190 - view.seek.at * 72} width={110} height={40} seed={895} strokeWidth={1.8} stroke={view.seek.found ? 'var(--color-ink)' : 'var(--color-marker-coral)'} fill={view.seek.found ? 'var(--color-marker-yellow)' : 'color-mix(in srgb, var(--color-marker-coral) 15%, transparent)'} fillStyle="solid" />
            <text x={365} y={207 - view.seek.at * 72} textAnchor="middle" fontFamily="var(--font-code)" fontSize={11.5} fontWeight={700} fill="var(--color-ink)">
              seeking: {view.seek.name}
            </text>
            <text x={365} y={223 - view.seek.at * 72} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11} fill={view.seek.found ? 'var(--color-marker-teal)' : 'var(--color-marker-coral)'}>
              {view.seek.found ? '✓ found here' : '✗ miss — chain exhausted'}
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* badge — a small appearing annotation for elaboration steps */}
      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <RoughRect x={44} y={252} width={352} height={26} seed={897} strokeWidth={1.6} stroke="var(--color-pencil-blue)" fill="color-mix(in srgb, var(--color-pencil-blue) 10%, transparent)" fillStyle="solid" />
            <text x={220} y={269} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10} fontWeight={700} fill="var(--color-pencil-blue)">
              {view.badge}
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={298} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12.5} fontWeight={700} fill="var(--color-marker-teal)">
          {view.note}
        </motion.text>
      </AnimatePresence>

      <RoughRect x={40} y={310} width={360} height={28} seed={896} strokeWidth={1.5} />
      <text x={58} y={329} fontFamily="var(--font-code)" fontSize={11} fill="var(--color-ink)">
        {view.console.length === 0 ? '(console: nothing yet)' : view.console.join('  ·  ')}
      </text>
    </svg>
  )
}

const KITCHEN_EXERCISE: CodeExerciseDef = {
  id: 'l55-kitchen',
  title: 'one recipe, many kitchens',
  task: 'Prove sharing with your own chain: one describe method living on a base object, borrowed by two different objects through their prototype links — with this doing its 5.4 job.',
  steps: [
    <>
      A base object <code>kitchen</code> with ONE method: <code>describe()</code>, returning{' '}
      <code>this.dish + " ready"</code>.
    </>,
    <>
      Two objects created WITH <code>kitchen</code> as their prototype: <code>pasta</code> (own
      property <code>dish</code> = <code>"pasta"</code>) and <code>soup</code> (<code>dish</code> ={' '}
      <code>"soup"</code>). Print each one's <code>describe()</code>.
    </>,
    <>
      Prove the link: print whether <code>soup</code>'s prototype <em>is</em> <code>kitchen</code>{' '}
      (there's a built-in that answers this).
    </>,
  ],
  starter: '',
  expectedOutput: ['pasta ready', 'soup ready', 'true'],
  mustUse: [
    { test: /Object\.create\s*\(\s*kitchen\s*\)/, label: 'the objects are created with Object.create(kitchen)' },
    { test: /this\.dish/, label: 'describe reads this.dish — one method serving every kitchen' },
    { test: /Object\.getPrototypeOf\s*\(\s*soup\s*\)\s*===\s*kitchen/, label: 'the link is proven: Object.getPrototypeOf(soup) === kitchen' },
  ],
  mustNotUse: [
    { test: /describe\s*\([\s\S]*describe\s*\(\s*\)\s*\{/, label: 'describe must exist ONCE, on kitchen — that’s the sharing' },
  ],
  modelAnswer: `const kitchen = {
  describe() {
    return this.dish + " ready";
  },
};

const pasta = Object.create(kitchen);
pasta.dish = "pasta";

const soup = Object.create(kitchen);
soup.dish = "soup";

console.log(pasta.describe());
console.log(soup.describe());
console.log(Object.getPrototypeOf(soup) === kitchen);`,
}

export const lesson55: LessonDef = {
  id: '5.5',
  hook: (
    <>
      <p>
        A confession: lesson 4.4's property-lookup story was incomplete. "Reading a missing key
        gives <code>undefined</code>" — mostly true, but then how does <code>rabbit.toString()</code>{' '}
        work when you never wrote a <code>toString</code>? How does every array know{' '}
        <code>.push</code>? You've been using inherited properties since lesson 0.3 without the
        machinery ever being named.
      </p>
      <p>
        The machinery:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          every object carries one hidden link to another object — its prototype
        </HighlightMark>
        . The REAL lookup rule: check the object; on a miss, <em>climb the link</em> and check
        there; repeat until found or the chain ends. It's 5.3's rope-walk, but for object
        properties — and it's how JavaScript shares one method among a million objects without
        copying it once.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'create-link',
      caption:
        'Object.create(animal) builds a NEW, empty object whose hidden link — written [[Prototype]] in the spec — points at animal. Note what did NOT happen: nothing was copied. rabbit owns nothing yet except what we add next (hops). One arrow in the diagram, that’s the entire setup.',
      highlightLines: [8, 9],
    },
    {
      id: 'own-hit',
      caption:
        'rabbit.hops — the lookup checks rabbit’s own properties first. hops is there (we wrote it onto rabbit): found, true, done. Properties directly on the object are called OWN properties, and they always win (that’s shadowing, third appearance: 3.5 scopes, 5.3 chain, now prototypes).',
      highlightLines: [11],
    },
    {
      id: 'climb',
      caption:
        'rabbit.eats — miss on rabbit… and HERE is the upgraded rule: instead of answering undefined, the lookup CLIMBS the link to animal and checks there. Found: true. rabbit “has” eats without owning it — it borrows through the chain.',
      highlightLines: [12],
    },
    {
      id: 'total-miss',
      caption:
        'rabbit.color — miss on rabbit, climb to animal… miss there too. Only NOW, with the whole chain checked and nothing found, do you get 4.4’s undefined. The lookup doesn’t give up early — it climbs every link that exists first.',
      highlightLines: [13],
    },
    {
      id: 'shared-method',
      caption:
        'rabbit.sleep() — same climb, and it finds a FUNCTION on animal. This is the entire point of the system: sleep exists ONCE, on animal, and every object linking to animal borrows that single function. A thousand rabbits: one sleep in memory, not a thousand copies.',
      highlightLines: [3, 4, 5, 14],
    },
    {
      id: 'shared-method-this',
      caption:
        'One more precise detail: called as rabbit.sleep(), the dot rule of 5.4 still sets this = rabbit — inherited methods get the CALLER’s this, not the object they’re borrowed from.',
      highlightLines: [3, 4, 5, 14],
    },
    {
      id: 'own-vs-inherited',
      caption:
        'Object.keys(rabbit) → ["hops"]. Own properties only — the borrowed ones don’t appear, because they aren’t IN rabbit; they’re up the chain. Most inspection tools (keys, values, entries, JSON.stringify) see own properties; the dot lookup is the one that climbs.',
      highlightLines: [16],
    },
    {
      id: 'the-full-chain',
      caption:
        'Zoom out: animal has a link too — to Object.prototype, the shared home of toString and friends. That’s the answer to the hook: EVERY plain object’s chain ends at Object.prototype, then null. Chain over — that’s exactly why an exhausted search finally becomes undefined.',
      highlightLines: [1, 8],
    },
    {
      id: 'arrays-too',
      caption:
        'Arrays climb their own chain the same way: array → Array.prototype (home of push and 4.9’s map!) → Object.prototype → null. You have been living on prototype chains since your very first console.log.',
      highlightLines: [1, 8],
    },
  ],
  Viz: PrototypeChain,
  underTheHood: (
    <>
      <p>
        Naming, precisely — interviewers probe this: the hidden link on every object is{' '}
        <strong>[[Prototype]]</strong>, readable with <code>Object.getPrototypeOf(obj)</code>{' '}
        (you'll also meet <code>__proto__</code>, a legacy accessor for the same link — fine in
        DevTools, avoided in code). Confusingly, <em>functions</em> also have a normal property
        literally named <code>prototype</code> — that's a different thing: it's the object that{' '}
        <code>new</code> will install as [[Prototype]] on instances. Next lesson makes that click.
      </p>
      <p>
        Writing never climbs: <code>rabbit.eats = false</code> creates an OWN <code>eats</code> on
        rabbit that shadows animal's — animal is untouched, and other objects linked to animal
        still see <code>true</code>. Read-climbs, write-local is why one shared prototype is safe
        for a million instances.
      </p>
      <p>
        And the memory math that motivates everything: methods on the instance = one function
        object <em>per instance</em> (a thousand rabbits, a thousand sleeps). Methods on the
        prototype = one function, ever. That's the entire reason this system exists — and exactly
        what <code>class</code> automates next lesson.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Type exactly what this prints:',
      code: 'const base = { kind: "tool" };\nconst hammer = Object.create(base);\nhammer.weight = 2;\nconsole.log(hammer.kind);',
      accept: ['tool'],
      placeholder: 'type the console output…',
      why: 'kind isn’t an own property of hammer — the lookup misses, climbs the [[Prototype]] link to base, and finds it. Borrowed, not copied.',
    },
    {
      kind: 'type-output',
      question: 'Same setup — type exactly what THIS prints:',
      code: 'const base = { kind: "tool" };\nconst hammer = Object.create(base);\nhammer.weight = 2;\nconsole.log(Object.keys(hammer).length);',
      accept: ['1'],
      placeholder: 'type the console output…',
      why: 'Object.keys sees OWN properties only — just weight. The inherited kind lives up the chain, not in hammer. Dot-lookup climbs; inspection tools don’t.',
    },
    {
      kind: 'type-output',
      question: 'Every plain object’s chain ends at Object.prototype, whose own link points to ___. Type it.',
      accept: ['null', 'Null', 'NULL'],
      placeholder: 'one word…',
      why: 'null — the end of every chain. Only when the climb reaches null does a property read finally give undefined. (And Object.prototype is where toString has been coming from since your first lesson.)',
    },
  ],
  PlayExtra: () => <CodeExercise def={KITCHEN_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain to a friend how rabbit.sleep() can work when rabbit has no sleep — the hidden link, the full lookup rule, where every chain ends, and why sharing methods this way saves memory.',
    modelAnswer:
      'Every object carries one hidden link — its [[Prototype]] — pointing at another object. The true property-lookup rule: check the object’s own properties; on a miss, climb the link and check there; keep climbing until you find the name or reach the end of the chain (Object.prototype, whose link is null) — only then do you get undefined. rabbit was created with Object.create(animal), so its link points at animal: rabbit.sleep misses locally, climbs, and finds the one sleep function on animal — borrowed, not copied. That’s the memory win: one method on the prototype serves a million linked objects, instead of a million copies. Writes don’t climb — assigning rabbit.eats = false creates an own property that shadows animal’s without touching it. And this explains lesson-0 magic like toString: every plain object’s chain ends at Object.prototype, where those built-ins live.',
  },
  recap: [
    'Every object has ONE hidden link — [[Prototype]] (read it with Object.getPrototypeOf). The real lookup: own properties → climb → climb → … → Object.prototype → null → undefined.',
    'Methods live ONCE on the prototype and are borrowed by every linked object; called via dot, this is still the caller (5.4). Writes never climb — they create own, shadowing properties.',
    'Object.keys & friends list OWN properties only. Arrays climb Array.prototype (push, map live there) — you’ve used this chain since day one.',
  ],
}
