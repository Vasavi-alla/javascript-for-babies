// Validates the recall question bank without booting the app.
// Checks: unique ids, referenced lessonId exists in the registry and is phase >= 1,
// coding questions have code, every question has a non-empty answer, no em dashes,
// valid type/difficulty values.
import { readFileSync } from 'node:fs'

const bankSrc = readFileSync('src/content/interview-questions.ts', 'utf8')
const regSrc = readFileSync('src/content/registry.ts', 'utf8')

const lessonIds = new Set([...regSrc.matchAll(/id:\s*'(\d+\.\d+)'/g)].map((m) => m[1]))
const phaseOf = {}
for (const m of regSrc.matchAll(/id:\s*'(\d+\.\d+)'[^}]*?phase:\s*(\d+)/g)) phaseOf[m[1]] = Number(m[2])

// crude object split good enough for a lint gate
const blocks = bankSrc.split(/\{\s*\n\s*id:/).slice(1)
const ids = new Set()
let errors = 0
const fail = (msg) => {
  console.error('FAIL:', msg)
  errors++
}

for (const b of blocks) {
  const id = (b.match(/^\s*'([^']+)'/) || [])[1]
  const lessonId = (b.match(/lessonId:\s*'([^']+)'/) || [])[1]
  const type = (b.match(/type:\s*'([^']+)'/) || [])[1]
  const difficulty = (b.match(/difficulty:\s*'([^']+)'/) || [])[1]
  if (!id) {
    fail('a question is missing an id')
    continue
  }
  if (ids.has(id)) fail(`duplicate id ${id}`)
  ids.add(id)
  if (!lessonId || !lessonIds.has(lessonId)) fail(`${id}: lessonId ${lessonId} not in registry`)
  else if ((phaseOf[lessonId] ?? 0) < 1) fail(`${id}: lessonId ${lessonId} is phase < 1`)
  if (type !== 'oral' && type !== 'coding') fail(`${id}: bad type ${type}`)
  if (difficulty !== 'straightforward' && difficulty !== 'tricky') fail(`${id}: bad difficulty ${difficulty}`)
  if (type === 'coding' && !/code:\s*'/.test(b)) fail(`${id}: coding question has no code`)
  if (!/answer:\s*\n?\s*'/.test(b)) fail(`${id}: missing answer`)
  const strings = [...b.matchAll(/'((?:[^'\\]|\\.)*)'/g)].map((m) => m[1]).join(' ')
  if (strings.includes('—')) fail(`${id}: contains an em dash`)
}

console.log(`checked ${ids.size} questions`)
if (errors) {
  console.error(`${errors} error(s)`)
  process.exit(1)
}
console.log('interview bank OK')
