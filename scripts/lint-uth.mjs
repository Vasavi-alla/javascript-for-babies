// Lint underTheHood prose against the style contract (docs/plan/04-LESSON-BLUEPRINT.md).
// Usage:
//   node scripts/lint-uth.mjs [phase0 phase1 …]   lint (default: all phases)
//   node scripts/lint-uth.mjs --baseline           record current word counts
import fs from 'node:fs'
import path from 'node:path'

const ROOT = 'src/lessons'
const BASELINE_PATH = 'scripts/uth-baseline.json'
const MAX_SENTENCE_WORDS = 28

// Rule 7 seed list — grows as offenders are found during the sweep.
const IDIOMS = [
  'pecking order', 'load-bearing', 'earning its keep', 'earn its keep', 'earns its keep',
  'pays rent', 'paying rent', 'pays its rent', 'cried wolf', 'cries wolf', 'junk drawer',
  'in costume', 'wearing a costume', 'sledgehammer', 'tester gold', 'goldmine',
  'the whole nine', 'walks past everyone', 'best in the trade', 'in the trenches',
  'day-one bug', 'arbitrage',
]
// Rule 3 seed list — untaught tech names; flagged unless a gloss "(" opens within the
// same sentence after the term.
const JARGON = ['React', 'layout thrash', 'structural typing', 'memoize', 'Annex B', 'monorepo']

const args = process.argv.slice(2)
const baselineMode = args.includes('--baseline')
const phases = args.filter((a) => a.startsWith('phase'))

function extractUth(source) {
  const m = source.match(/underTheHood: \(([\s\S]*?)\n  \),/)
  if (!m) return null
  return m[1]
    .replace(/<code>[\s\S]*?<\/code>/g, ' CODE ') // code spans are exempt from prose rules
    .replace(/<[^>]+>/g, ' ')
    .replace(/\{'\s*'\}/g, ' ')
    .replace(/\{["']([^"']*)["']\}/g, '$1')
    .replace(/&\w+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const results = []
const baseline = fs.existsSync(BASELINE_PATH) ? JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8')) : {}
const newBaseline = {}

for (const dir of fs.readdirSync(ROOT).sort()) {
  if (!dir.startsWith('phase')) continue
  if (phases.length && !phases.includes(dir)) continue
  for (const file of fs.readdirSync(path.join(ROOT, dir)).sort()) {
    if (!file.endsWith('.tsx')) continue
    const source = fs.readFileSync(path.join(ROOT, dir, file), 'utf8')
    const id = (source.match(/id: '(\d+\.\d+)'/) || [])[1] || file
    const text = extractUth(source)
    if (!text) continue
    const words = text.split(' ').filter(Boolean).length
    newBaseline[id] = words
    const findings = []

    // Rule 1: sentence density
    for (const sentence of text.split(/(?<=[.!?])\s+/)) {
      const w = sentence.split(' ').filter(Boolean).length
      if (w > MAX_SENTENCE_WORDS) findings.push(`long sentence (${w}w): "${sentence.slice(0, 70)}…"`)
    }
    // Rule 7: idioms
    for (const idiom of IDIOMS) {
      if (text.toLowerCase().includes(idiom.toLowerCase())) findings.push(`idiom: "${idiom}"`)
    }
    // Rule 3: untaught jargon without a nearby gloss
    for (const term of JARGON) {
      const idx = text.indexOf(term)
      if (idx !== -1 && !text.slice(idx, idx + 120).includes('(')) findings.push(`unglossed jargon: "${term}"`)
    }
    // Rule 6: growth vs baseline
    if (!baselineMode && baseline[id] && words > baseline[id]) {
      findings.push(`grew: ${baseline[id]} → ${words} words`)
    }
    if (findings.length) results.push({ id, findings })
  }
}

if (baselineMode) {
  fs.writeFileSync(BASELINE_PATH, JSON.stringify(newBaseline, null, 2))
  console.log(`baseline recorded for ${Object.keys(newBaseline).length} lessons → ${BASELINE_PATH}`)
  process.exit(0)
}

for (const r of results) {
  console.log(`\n${r.id}`)
  for (const f of r.findings) console.log(`  - ${f}`)
}
console.log(results.length === 0 ? '\nUTH lint: clean' : `\nUTH lint: findings in ${results.length} lessons`)
process.exit(results.length === 0 ? 0 : 1)
