import { AnimatePresence, motion } from 'motion/react'
import { HandArrow, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'

/**
 * 4.7 — Copying & equality
 * Viz: the heap diagram grows a second level. Spread builds a NEW top-level
 * object (own address), but any property that held an arrow copies the ARROW —
 * the inner object stays shared. The shared inner arrow is drawn in coral.
 * Pays off 4.6's "{} !== {}" tease.
 */

const CODE = `const base = { theme: "dark", flags: { beta: true } };

const copy = { ...base };
console.log(copy === base);

copy.theme = "light";
console.log(base.theme);

copy.flags.beta = false;
console.log(base.flags.beta);`

interface ObjBox {
  id: 'base' | 'copy' | 'inner'
  x: number
  y: number
  title: string
  lines: { text: string; hot?: boolean; arrowOut?: boolean }[]
  hot?: boolean
}
interface View {
  slots: { name: string; to: 'base' | 'copy'; hot?: boolean }[]
  objs: ObjBox[]
  /** ids of objects whose flags-arrow to inner is highlighted */
  sharedHot?: boolean
  console: string[]
  note?: { text: string; color: 'teal' | 'coral' }
}

const BASE_OBJ = (theme: string, hotTheme = false): ObjBox => ({
  id: 'base',
  x: 196,
  y: 54,
  title: 'base’s object',
  lines: [{ text: `theme: "${theme}"`, hot: hotTheme }, { text: 'flags: ➝', arrowOut: true }],
})
const COPY_OBJ = (theme: string, hotTheme = false): ObjBox => ({
  id: 'copy',
  x: 196,
  y: 150,
  title: 'copy’s object — NEW address',
  lines: [{ text: `theme: "${theme}"`, hot: hotTheme }, { text: 'flags: ➝', arrowOut: true }],
})
const INNER = (beta: string, hot = false): ObjBox => ({
  id: 'inner',
  x: 344,
  y: 100,
  title: 'the ONE flags object',
  lines: [{ text: `beta: ${beta}`, hot }],
})

const VIEWS: View[] = [
  {
    slots: [{ name: 'base', to: 'base' }],
    objs: [BASE_OBJ('dark'), INNER('true')],
    console: [],
    note: { text: 'two levels: base ➝ object, whose flags property ➝ another object', color: 'teal' },
  },
  {
    slots: [{ name: 'base', to: 'base' }, { name: 'copy', to: 'copy', hot: true }],
    objs: [BASE_OBJ('dark'), COPY_OBJ('dark'), INNER('true')],
    console: [],
    note: { text: 'spread built a genuinely NEW object — its own box, its own address', color: 'teal' },
  },
  {
    slots: [{ name: 'base', to: 'base' }, { name: 'copy', to: 'copy', hot: true }],
    objs: [BASE_OBJ('dark'), COPY_OBJ('dark'), INNER('true')],
    console: ['false'],
    note: { text: '=== compares ADDRESSES only — matching contents don’t matter', color: 'teal' },
  },
  {
    slots: [{ name: 'base', to: 'base' }, { name: 'copy', to: 'copy' }],
    objs: [BASE_OBJ('dark'), COPY_OBJ('light', true), INNER('true')],
    console: ['false', 'dark'],
    note: { text: 'top layer truly copied: copy changed, base didn’t feel it', color: 'teal' },
  },
  {
    slots: [{ name: 'base', to: 'base' }, { name: 'copy', to: 'copy' }],
    objs: [BASE_OBJ('dark'), COPY_OBJ('light'), INNER('true')],
    sharedHot: true,
    console: ['false', 'dark'],
    note: { text: 'but flags held an ARROW — and spread copies arrows. One inner object.', color: 'coral' },
  },
  {
    slots: [{ name: 'base', to: 'base' }, { name: 'copy', to: 'copy' }],
    objs: [BASE_OBJ('dark'), COPY_OBJ('light'), INNER('false', true)],
    sharedHot: true,
    console: ['false', 'dark', 'false'],
    note: { text: 'copy.flags.beta = false changed the shared object — base sees it too', color: 'coral' },
  },
  {
    slots: [{ name: 'base', to: 'base' }, { name: 'copy', to: 'copy' }],
    objs: [BASE_OBJ('dark'), COPY_OBJ('light'), INNER('false', true)],
    sharedHot: true,
    console: ['false', 'dark', 'false'],
    note: { text: 'the cure: structuredClone(base) rebuilds EVERY layer — nothing shared', color: 'teal' },
  },
]

function SpreadDiagram({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      <text x={24} y={36} fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">
        stack
      </text>
      {view.slots.map((slot, i) => {
        const y = 58 + i * 96
        return (
          <motion.g key={slot.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
            <RoughRect x={24} y={y} width={92} height={34} seed={551 + i} strokeWidth={slot.hot ? 2.4 : 1.8} stroke={slot.hot ? 'var(--color-marker-coral)' : 'var(--color-ink)'} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
            <text x={70} y={y + 22} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12.5} fontWeight={700} fill="var(--color-ink)">
              {slot.name}
            </text>
          </motion.g>
        )
      })}

      {/* slot → object arrows */}
      {view.slots.map((slot, i) => {
        const target = view.objs.find((o) => o.id === slot.to)
        if (!target) return null
        return (
          <HandArrow
            key={`sa-${slot.name}`}
            from={{ x: 118, y: 58 + i * 96 + 17 }}
            to={{ x: target.x - 4, y: target.y + 28 }}
            curve={0.08}
            seed={560 + i}
            stroke={slot.hot ? 'var(--color-marker-coral)' : 'var(--color-marker-teal)'}
            strokeWidth={2.2}
            headLength={9}
          />
        )
      })}

      {/* heap objects */}
      <AnimatePresence>
        {view.objs.map((o) => (
          <motion.g key={o.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <RoughRect x={o.x} y={o.y} width={o.id === 'inner' ? 88 : 132} height={22 + o.lines.length * 20} seed={570 + o.x + o.y} strokeWidth={2} fill="var(--color-sticky)" fillStyle="solid" />
            <text x={o.x + 4} y={o.y - 5} fontFamily="var(--font-hand)" fontSize={11.5} fill="var(--color-ink-soft)">
              {o.title}
            </text>
            {o.lines.map((line, j) => (
              <text key={line.text} x={o.x + 10} y={o.y + 20 + j * 20} fontFamily="var(--font-code)" fontSize={11} fontWeight={line.hot ? 700 : 400} fill={line.hot ? 'var(--color-marker-coral)' : 'var(--color-ink)'}>
                {line.text}
              </text>
            ))}
          </motion.g>
        ))}
      </AnimatePresence>

      {/* flags → inner arrows (the shared ones) */}
      {view.objs
        .filter((o) => o.id !== 'inner' && o.lines.some((l) => l.arrowOut))
        .map((o) => (
          <HandArrow
            key={`fa-${o.id}`}
            from={{ x: o.x + 128, y: o.y + 36 }}
            to={{ x: 340, y: 100 + 24 }}
            curve={0.06}
            seed={580 + o.y}
            stroke={view.sharedHot ? 'var(--color-marker-coral)' : 'var(--color-marker-teal)'}
            strokeWidth={view.sharedHot ? 2.6 : 2}
            headLength={9}
          />
        ))}

      {/* verdict */}
      <AnimatePresence mode="wait">
        {view.note && (
          <motion.text
            key={view.note.text}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            x={220}
            y={256}
            textAnchor="middle"
            fontFamily="var(--font-hand)"
            fontSize={15}
            fontWeight={700}
            fill={view.note.color === 'coral' ? 'var(--color-marker-coral)' : 'var(--color-marker-teal)'}
          ><WrapTspans text={view.note.text} x={220} maxPx={426} fontSize={15} /></motion.text>
        )}
      </AnimatePresence>

      {/* console */}
      <RoughRect x={40} y={272} width={360} height={40} seed={581} strokeWidth={1.5} />
      <text x={52} y={268} fontFamily="var(--font-hand)" fontSize={13.5} fill="var(--color-ink-soft)">
        console
      </text>
      {view.console.length === 0 ? (
        <text x={220} y={297} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13.5} fill="var(--color-ink-soft)">
          (nothing printed yet)
        </text>
      ) : (
        view.console.map((line, i) => (
          <motion.text key={`${line}-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} x={58 + i * 80} y={297} fontFamily="var(--font-code)" fontSize={12.5} fontWeight={600} fill="var(--color-ink)">
            {line}
          </motion.text>
        ))
      )}
    </svg>
  )
}

const SAFE_COPY_EXERCISE: CodeExerciseDef = {
  id: 'l45-safecopy',
  title: 'the copy that can keep a secret',
  task: 'A settings screen edits a DRAFT so cancel is possible — the original must survive anything the draft does. Prove where spread protects you, where it betrays you, and how to copy for real.',
  steps: [
    <>
      Create <code>profile</code>: <code>user</code> = <code>"vas"</code>, and <code>prefs</code>{' '}
      holding an object with <code>sound</code> = <code>true</code>.
    </>,
    <>
      Make a spread copy named <code>draft</code>. Change the draft's <code>user</code> to{' '}
      <code>"guest"</code>, then print <code>profile.user</code> — the top layer must be safe.
    </>,
    <>
      Now make a FULL copy named <code>clone</code> where <em>no layer</em> is shared (JavaScript
      has a built-in for this). Set the clone's <code>prefs.sound</code> to <code>false</code>,
      then print <code>profile.prefs.sound</code> — the original must be untouched.
    </>,
    <>
      Finish by printing <code>clone === profile</code>.
    </>,
  ],
  starter: '',
  expectedOutput: ['vas', 'true', 'false'],
  mustUse: [
    { test: /\{\s*\.\.\.profile\s*\}/, label: 'the draft is a spread copy: { ...profile }' },
    { test: /structuredClone\s*\(\s*profile\s*\)/, label: 'the full copy uses structuredClone(profile)' },
  ],
  mustNotUse: [
    { test: /JSON\.parse/, label: 'no JSON round-trip — structuredClone is the modern deep copy' },
  ],
  modelAnswer: `const profile = { user: "vas", prefs: { sound: true } };

const draft = { ...profile };
draft.user = "guest";
console.log(profile.user);

const clone = structuredClone(profile);
clone.prefs.sound = false;
console.log(profile.prefs.sound);

console.log(clone === profile);`,
}

export const lesson47: LessonDef = {
  id: '4.7',
  hook: (
    <>
      <p>
        Lesson 4.6 left a warning on the table: copying a variable copies the <em>arrow</em>, so
        “copies” of objects aren't copies at all. Today we make <em>real</em> copies — and
        immediately discover that the most popular copying tool,{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          spread (<code>...</code>)
        </HighlightMark>
        , only copies <strong>one layer deep</strong>. Everything nested keeps being shared, and
        knowing exactly where the sharing starts is the difference between a settings screen with a
        working “cancel” button and one that corrupts the original.
      </p>
      <p>
        Along the way, 4.6's other loose end gets tied: why <code>{'{} === {}'}</code> is{' '}
        <code>false</code>, and what <code>===</code> really asks when both sides are objects.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'two-levels',
      caption:
        'The setup is two levels deep: base’s slot points at an object — and that object’s flags property holds an ARROW of its own, pointing at a second, inner object. Real data looks like this everywhere: objects holding objects holding arrays.',
      highlightLines: [1],
    },
    {
      id: 'spread',
      caption:
        'const copy = { ...base } — spread builds a genuinely NEW object (look: its own box in the heap, its own address) and copies base’s properties into it, one by one.',
      highlightLines: [3],
    },
    {
      id: 'identity',
      caption:
        'That’s why copy === base prints false: === on objects compares ADDRESSES, nothing else. Two boxes, two addresses — even though the contents match perfectly. {} === {} is false for exactly the same reason.',
      highlightLines: [4],
    },
    {
      id: 'top-safe',
      caption:
        'The top layer is truly independent: copy.theme = "light" writes into copy’s own object, and base.theme still reads "dark". For flat objects — all primitives — spread is a perfect copy. The trouble only starts one level down…',
      highlightLines: [6, 7],
    },
    {
      id: 'shared-arrow',
      caption:
        '…because “copies base’s properties one by one” means copying WHAT EACH SLOT HELD. theme held a string — copied. flags held an ARROW — the arrow got copied. Look at the diagram: both objects’ flags now point at the SAME inner object. This is a SHALLOW copy: new top box, shared everything below.',
      highlightLines: [3],
    },
    {
      id: 'betrayal',
      caption:
        'copy.flags.beta = false follows copy’s flags arrow — into the one shared inner object. base.flags.beta reads false too. The cancel button just corrupted the original settings.',
      highlightLines: [9, 10],
    },
    {
      id: 'deep-copy',
      caption:
        'When you need every layer independent, you need a DEEP copy: structuredClone(base) rebuilds the whole tree — inner objects included, nothing shared at any depth.',
      highlightLines: [9, 10],
    },
  ],
  Viz: SpreadDiagram,
  underTheHood: (
    <>
      <p>
        <code>===</code> on objects answers one question: <em>same address?</em> It never looks
        inside. Two objects with identical contents are still <code>!==</code> — and there's no
        built-in “same contents” operator in the language.
      </p>
      <p>
        (Test libraries add one: <code>expect(a).toEqual(b)</code> unpacks structure — a Phase 10
        tool built entirely on today's idea.)
      </p>
      <p>
        Spread (<code>{'{ ...obj }'}</code>, <code>[...arr]</code>) and{' '}
        <code>Object.assign</code> all make <strong>shallow</strong> copies: one new top-level
        container, each property copied slot-by-slot — so nested objects and arrays come along as
        shared arrows. A shallow copy is exactly right when the object is flat, and exactly one
        layer short when it isn't.
      </p>
      <p>
        The real deep copy is <code>structuredClone(value)</code> — a modern built-in that rebuilds
        every layer.
      </p>
      <p>
        You'll still meet the old folk remedy <code>JSON.parse(JSON.stringify(x))</code> in older
        code: it mostly works, but it silently drops <code>undefined</code> and functions and
        mangles dates — knowing why takes exactly the JSON knowledge arriving in lesson 4.13.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Type exactly what this prints:',
      code: 'const a = { n: 1 };\nconst b = { n: 1 };\nconsole.log(a === b);',
      accept: ['false'],
      placeholder: 'type the console output…',
      why: 'Same shape, same contents — but two separate objects at two addresses. === compares addresses only. This is 4.6’s arrow picture doing all the work.',
    },
    {
      kind: 'type-output',
      question: 'Type exactly what this prints:',
      code: 'const p = { name: "Ida", tags: ["new"] };\nconst q = { ...p };\nq.tags.push("vip");\nconsole.log(p.tags.length);',
      accept: ['2'],
      placeholder: 'type the console output…',
      why: 'Spread copied one layer: q got its own top box, but tags held an arrow — both objects share ONE array. q’s push grew it, and p counts 2. Shallow means exactly this.',
    },
    {
      kind: 'type-output',
      question: 'Type exactly what this prints:',
      code: 'const x = { k: 1 };\nconst y = { ...x };\ny.k = 9;\nconsole.log(x.k);',
      accept: ['1'],
      placeholder: 'type the console output…',
      why: 'k held a primitive, and the top layer genuinely copied — y.k = 9 wrote into y’s own object. For flat objects, spread is a complete copy.',
    },
  ],
  PlayExtra: () => <CodeExercise def={SAFE_COPY_EXERCISE} />,
  teachBack: {
    prompt:
      'A friend spread-copied their settings object, edited the copy’s nested prefs, and corrupted the original anyway. Explain why the top level was safe but the nested part wasn’t — and what tool makes a copy with nothing shared.',
    modelAnswer:
      'Spread makes a shallow copy: it builds a new top-level object and copies each property slot by slot. Properties holding primitives copy as independent values — that’s why editing the copy’s top-level fields never touched the original. But their prefs property held a REFERENCE (an arrow) to a nested object, and spread copied the arrow — so both objects’ prefs pointed at ONE shared inner object, and editing it through the copy changed it for the original too. For a copy with nothing shared, use structuredClone(settings): it rebuilds every layer. And === wouldn’t have caught any of this — on objects it only compares addresses, which is why even {} === {} is false.',
  },
  recap: [
    '=== on objects compares ADDRESSES: identical contents are still !==, and {} === {} is false.',
    'Spread / Object.assign copy ONE layer — properties holding arrows copy the arrow, so nested data stays shared (shallow copy).',
    'structuredClone(value) copies every layer — the modern deep copy. (JSON round-trips are the old, lossy folk remedy.)',
  ],
}
