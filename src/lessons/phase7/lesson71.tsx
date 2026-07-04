import { AnimatePresence, motion } from 'motion/react'
import { HandArrow, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 7.1 — The DOM tree
 * HTML text is parsed into a LIVE tree of node objects; document is the
 * root handle; DevTools' Elements panel is a live view of that tree.
 * JS never edits the HTML text — it edits the tree.
 */

const CODE = `<!-- the HTML the server sent (just text!) -->
<body>
  <h1>My List</h1>
  <ul id="items">
    <li class="todo">buy milk</li>
    <li class="todo done">call mom</li>
  </ul>
</body>

// in JS: the tree grown from that text
document.querySelector("#items")
// → the <ul> ELEMENT OBJECT, live`

interface TreeNode {
  label: string
  x: number
  y: number
  hot?: boolean
  kind?: 'el' | 'text'
}
interface View {
  nodes: TreeNode[]
  edges: [number, number][]
  console: string[]
  note: string
  /** a small appearing annotation for steps that add insight without moving the highlight */
  badge?: string
}

const BASE_NODES: TreeNode[] = [
  { label: 'document', x: 220, y: 50 },
  { label: 'body', x: 220, y: 100 },
  { label: 'h1', x: 120, y: 150 },
  { label: 'ul#items', x: 300, y: 150 },
  { label: 'li.todo', x: 230, y: 205 },
  { label: 'li.todo.done', x: 370, y: 205 },
  { label: '"buy milk"', x: 230, y: 252, kind: 'text' },
]
const EDGES: [number, number][] = [[0, 1], [1, 2], [1, 3], [3, 4], [3, 5], [4, 6]]

const VIEWS: View[] = [
  { nodes: BASE_NODES, edges: EDGES, console: [], note: 'the parser reads the HTML text ONCE and grows this tree of objects' },
  {
    nodes: BASE_NODES.map((n, i) => (i === 3 || i === 4 || i === 5 ? { ...n, hot: true } : n)), edges: EDGES, console: [],
    note: 'each tag becomes an ELEMENT NODE: h1, ul, li — with attributes and children',
  },
  {
    nodes: BASE_NODES.map((n, i) => (i === 6 ? { ...n, hot: true } : n)), edges: EDGES, console: [],
    note: 'the actual words become TEXT NODES — leaf children living INSIDE their element ("buy milk" is a child of its li)',
  },
  { nodes: BASE_NODES.map((n, i) => (i === 0 ? { ...n, hot: true } : n)), edges: EDGES, console: [], note: 'document = your handle on the root — every DOM adventure starts here' },
  { nodes: BASE_NODES.map((n, i) => (i === 3 ? { ...n, hot: true } : n)), edges: EDGES, console: ['<ul id="items">…</ul>'], note: 'querySelector("#items") hands you the ELEMENT OBJECT itself' },
  {
    nodes: BASE_NODES.map((n, i) => (i === 3 ? { ...n, hot: true } : n)), edges: EDGES, console: ['<ul id="items">…</ul>'],
    note: 'not a copy, not text',
    badge: 'a real reference (4.6!) INTO the tree — mutate through it and the real page changes',
  },
  { nodes: BASE_NODES, edges: EDGES, console: ['<ul id="items">…</ul>'], note: 'F12 → Elements: that panel is not the HTML file — it’s THIS TREE, rendered live' },
  {
    nodes: BASE_NODES, edges: EDGES, console: ['<ul id="items">…</ul>'],
    note: 'edit a node there and the page repaints instantly',
    badge: 'that’s also why Elements differs from View Source: source = the original text, Elements = the tree NOW, after every JS edit',
  },
  {
    nodes: BASE_NODES, edges: EDGES, console: ['<ul id="items">…</ul>'],
    note: 'this tree is your hunting ground: everything Playwright automates is this tree being found, clicked, and asserted on',
  },
]

function DomTree({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 330" className="w-full">
      {view.edges.map(([a, b]) => (
        <HandArrow key={`${a}-${b}`} from={{ x: view.nodes[a].x, y: view.nodes[a].y + 12 }} to={{ x: view.nodes[b].x, y: view.nodes[b].y - 14 }} curve={0.04} seed={1101 + a * 7 + b} stroke="var(--color-ink-soft)" strokeWidth={1.6} headLength={6} />
      ))}
      {view.nodes.map((n) => (
        <motion.g key={n.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <RoughRect x={n.x - 52} y={n.y - 13} width={104} height={26} seed={1111 + n.x + n.y} strokeWidth={n.hot ? 2.4 : 1.5} stroke={n.hot ? 'var(--color-marker-teal)' : n.kind === 'text' ? 'var(--color-ink-soft)' : 'var(--color-ink)'} roughness={n.kind === 'text' ? 2.2 : 1.2} fill={n.hot ? 'color-mix(in srgb, var(--color-marker-teal) 12%, transparent)' : 'var(--color-paper-raised, #fff)'} fillStyle="solid" />
          <text x={n.x} y={n.y + 4} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10} fill="var(--color-ink)">{n.label}</text>
        </motion.g>
      ))}
      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={286} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12.5} fontWeight={700} fill="var(--color-marker-teal)">
          {view.note}
        </motion.text>
      </AnimatePresence>

      {/* badge — a small appearing annotation for elaboration steps */}
      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <RoughRect x={30} y={300} width={380} height={26} seed={1112} strokeWidth={1.6} stroke="var(--color-pencil-blue)" fill="color-mix(in srgb, var(--color-pencil-blue) 10%, transparent)" fillStyle="solid" />
            <text x={220} y={317} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fontWeight={700} fill="var(--color-pencil-blue)">
              {view.badge}
            </text>
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  )
}

const TREECOUNT_EXERCISE: CodeExerciseDef = {
  id: 'l71-treecount',
  title: 'walk a tree like the browser does',
  task: 'The sandbox has no page — so model a DOM as plain nested objects and walk it RECURSIVELY (3.9, welcome back): the exact shape of every DOM traversal you’ll ever write.',
  steps: [
    <>
      Model this page as nested objects, each node shaped{' '}
      <code>{'{ tag, children: [] }'}</code>: a <code>body</code> containing an <code>h1</code>{' '}
      (no children) and a <code>ul</code> containing two <code>li</code> nodes.
    </>,
    <>
      Write <code>countNodes(node)</code>: 1 for the node itself plus the counts of all its
      children — computed recursively, no manual adding.
    </>,
    <>
      Print <code>countNodes(body)</code>, then print the tag of the ul's SECOND child.
    </>,
  ],
  starter: '',
  expectedOutput: ['5', 'li'],
  mustUse: [
    { test: /children\s*:/, label: 'nodes carry a children array — the tree shape' },
    { test: /countNodes\s*\(\s*\w+\s*\)[\s\S]*countNodes\s*\(/, label: 'countNodes calls ITSELF on children — recursion' },
    { test: /\.children\s*\[\s*1\s*\]/, label: 'the second child is reached by index through the tree' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*5\s*\)/, label: 'no hand-counted 5 — the walk must count' },
  ],
  modelAnswer: `const body = {
  tag: "body",
  children: [
    { tag: "h1", children: [] },
    {
      tag: "ul",
      children: [
        { tag: "li", children: [] },
        { tag: "li", children: [] },
      ],
    },
  ],
};

function countNodes(node) {
  let total = 1;
  for (const child of node.children) {
    total = total + countNodes(child);
  }
  return total;
}

console.log(countNodes(body));
console.log(body.children[1].children[1].tag);`,
}

export const lesson71: LessonDef = {
  id: '7.1',
  hook: (
    <>
      <p>
        Six phases of JavaScript — and not one pixel changed on a page. That ends now. The bridge
        between your code and what the human sees is the{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          DOM — the Document Object Model
        </HighlightMark>
        : when the browser reads an HTML file, it doesn't keep it as text. It <em>parses</em> it
        into a living <strong>tree of objects</strong> — one node per tag, per piece of text — and
        hands your JavaScript the root: <code>document</code>.
      </p>
      <p>
        Everything a page ever does — a menu opening, a like counter ticking, a todo appearing —
        is JavaScript editing this tree. And everything Playwright ever automates is this tree
        being found, clicked, and asserted on. This phase is literally titled your{' '}
        <em>hunting ground</em>; today you learn the terrain.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'parse',
      caption:
        'The server sends TEXT — angle brackets, just characters (4.13 taught you: wires carry text). The browser’s parser reads it once and GROWS the tree. The text is scaffolding; the tree is the building.',
      highlightLines: [1, 2, 3, 4, 5, 6, 7, 8],
    },
    {
      id: 'element-nodes',
      caption:
        'Each tag becomes an ELEMENT NODE object — and the tag names are plain abbreviations: h1 = the biggest heading, ul = an Unordered (bulleted) List, li = one List Item inside it, body = everything visible on the page. Nesting becomes parent-child links, and attributes like id="items" and class="todo done" ride on their element node.',
      highlightLines: [4, 5, 6],
    },
    {
      id: 'text-nodes',
      caption:
        'And the actual words become TEXT NODES — leaf children living INSIDE elements. "buy milk" is a child of its li, not the li itself. Two node kinds, that’s the whole tree.',
      highlightLines: [4, 5, 6],
    },
    {
      id: 'document',
      caption:
        'document is a global object every page’s JS receives — your handle on the tree’s root. Every lookup and every edit starts by walking or searching from here. (In the tree: document → body → branches.)',
      highlightLines: [10, 11],
    },
    {
      id: 'live-reference',
      caption:
        'document.querySelector("#items") searches the tree and returns… look closely at what: the ELEMENT OBJECT itself.',
      highlightLines: [10, 11, 12],
    },
    {
      id: 'live-reference-not-copy',
      caption:
        'A live 4.6 reference INTO the tree, not a copy, not HTML text. Hold it in a variable, change it later, and the real page changes. (The full selector language is next lesson — it’s the single most valuable syntax of your future job.)',
      highlightLines: [10, 11, 12],
    },
    {
      id: 'devtools',
      caption:
        'Press F12 → Elements: that panel is not the HTML file — it’s THIS TREE, rendered live.',
      highlightLines: [10],
    },
    {
      id: 'devtools-vs-source',
      caption:
        'Edit a node there and the page repaints instantly; that’s also why Elements often differs from “View Source” (source = the original text; Elements = the tree as it is NOW, after every JS edit). As a tester, Elements becomes your microscope — you’ll live in it.',
      highlightLines: [10],
    },
    {
      id: 'hunting-ground',
      caption:
        'Everything a page ever does — a menu opening, a like counter ticking, a todo appearing — is JavaScript editing this tree. And everything Playwright ever automates is this exact tree, being found, clicked, and asserted on. Today you learned the terrain.',
      highlightLines: [10],
    },
  ],
  Viz: DomTree,
  underTheHood: (
    <>
      <p>
        The DOM is not part of JavaScript — it's a browser API handed to JS (the spec calls the
        world of <code>document</code>, <code>fetch</code> and friends "Web APIs" — the same
        environment side of the 6.2 machine). That's why Node.js (Phase 9) has no{' '}
        <code>document</code>: no page, no tree. One language, different toolbelts per
        environment.
      </p>
      <p>
        Every node object comes packed with navigation (<code>parentElement</code>,{' '}
        <code>children</code>, <code>nextElementSibling</code>) and data (<code>tagName</code>,{' '}
        <code>id</code>, <code>classList</code>, <code>textContent</code>).
      </p>
      <p>
        Under the hood they're prototype chains (5.5 in the wild): an <code>li</code> is an
        HTMLLIElement → HTMLElement → Element → Node — shared methods living once, high on the
        chain.
      </p>
      <p>
        And your exercise models the tree as plain <code>{'{ tag, children }'}</code> objects on
        purpose: tree-walking logic is identical either way, and serialized node trees are exactly
        what Playwright passes around when it snapshots a page. Learn the walk on paper; drive it
        on the real tree from 7.3 on.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'The browser parses HTML text into a tree of ___. Type the word.',
      accept: ['objects', 'nodes', 'node objects', 'Objects', 'Nodes'],
      placeholder: 'one word…',
      why: 'Objects (nodes) — elements and text nodes linked parent-to-child. HTML is the recipe; the DOM tree is the dish. JS edits the dish, never the recipe.',
    },
    {
      kind: 'type-output',
      question: 'querySelector returns the HTML text of the element, or a live reference to the element object? Type: text or reference.',
      accept: ['reference', 'a reference', 'Reference', 'live reference'],
      placeholder: 'text / reference…',
      why: 'A live reference (4.6’s arrows, pointing into the tree). Mutate through it and the actual page changes — no copies involved.',
    },
    {
      kind: 'type-output',
      question: 'In <li>buy milk</li> — the words "buy milk" live in the tree as a ___ node, child of the li. Type the kind.',
      accept: ['text', 'Text', 'text node', 'TEXT'],
      placeholder: 'one word…',
      why: 'A text node — the leaf kind. Elements hold structure; text nodes hold the words. (That split is why textContent and innerHTML behave differently — lesson 7.3.)',
    },
  ],
  PlayExtra: () => <CodeExercise def={TREECOUNT_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain to a friend what the DOM actually is — what the browser does with HTML text, what document gives you, what querySelector hands back, and why the DevTools Elements panel isn’t the same as “View Source.”',
    modelAnswer:
      'HTML arrives as plain text; the browser parses it once and grows the DOM — a live tree of objects: an element node per tag (holding attributes and children) and text nodes for the words inside. JavaScript never edits the HTML text — it edits this tree, through the global document object, which is the handle on the root. document.querySelector(…) searches the tree and returns a live REFERENCE to an element object — not a copy, not markup — so mutating through it changes the actual page. DevTools’ Elements panel is a live view of the tree as it is NOW, after every JS edit, while View Source shows the original text the server sent — that’s why they can differ. Everything a page visibly does is tree edits, and everything an automation tool like Playwright does is finding and acting on this same tree.',
  },
  recap: [
    'HTML = text; the browser parses it ONCE into the DOM: a live tree of element nodes (tags) and text nodes (words).',
    'document = the root handle; querySelector returns a LIVE REFERENCE into the tree (4.6 arrows) — edits show on screen.',
    'DevTools Elements = the tree NOW (post-JS); View Source = the original text. The tree is your hunting ground.',
  ],
}
