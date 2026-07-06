// Route manifest derived from the lesson registry (regex extraction — same proven
// pattern as scripts/lint-uth.mjs). Used by the sitemap generator and the prerenderer.
import fs from 'node:fs'

export function getSiteUrl() {
  if (process.env.VITE_SITE_URL) return process.env.VITE_SITE_URL.replace(/\/$/, '')
  const env = fs.readFileSync('.env', 'utf8')
  const m = env.match(/^VITE_SITE_URL=(.+)$/m)
  if (!m) throw new Error('VITE_SITE_URL missing from .env')
  return m[1].trim().replace(/\/$/, '')
}

export function getRoutes() {
  const registry = fs.readFileSync('src/content/registry.ts', 'utf8')
  const lessonIds = [...registry.matchAll(/id: '(\d+\.\d+)'/g)].map((m) => m[1])
  const phaseNumbers = [...registry.matchAll(/\{ number: (\d+),/g)].map((m) => m[1])
  if (lessonIds.length < 100) throw new Error(`suspiciously few lessons extracted: ${lessonIds.length}`)
  if (phaseNumbers.length !== 12) throw new Error(`expected 12 phases, got ${phaseNumbers.length}`)
  return ['/', ...phaseNumbers.map((n) => `/phase/${n}`), ...lessonIds.map((id) => `/lesson/${id}`)]
}
