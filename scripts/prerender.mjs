// Snapshot every route of the built SPA to static HTML (SEO spec 2026-07-06).
// Doubles as a smoke test: a route that fails to render fails the build.
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { chromium } from 'playwright'
import { getRoutes } from './site-routes.mjs'

const DIST = 'dist'
const PORT = 4519
const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.json': 'application/json', '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.txt': 'text/plain', '.xml': 'application/xml',
}

// Static server with SPA fallback — mirrors Vercel's filesystem-then-rewrite behavior.
const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  let file = path.join(DIST, urlPath)
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(DIST, 'index.html')
  res.setHeader('content-type', MIME[path.extname(file)] ?? 'application/octet-stream')
  fs.createReadStream(file).pipe(res)
})

const routes = getRoutes()
await new Promise((r) => server.listen(PORT, r))
const browser = await chromium.launch()
const context = await browser.newContext()
const page = await context.newPage()
let failures = 0

for (const route of routes) {
  try {
    await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'load' })
    // Rendered = <main> has children AND useSeo set a canonical for this route.
    await page.waitForFunction(
      (r) => {
        const main = document.querySelector('main')
        const canonical = document.querySelector('link[rel="canonical"]')
        return main && main.children.length > 0 && canonical && canonical.href.endsWith(r === '/' ? '/' : r)
      },
      route,
      { timeout: 20000 },
    )
    const text = await page.evaluate(() => document.querySelector('main').innerText.length)
    if (route.startsWith('/lesson/') && text < 200) throw new Error(`thin content (${text} chars)`)
    const html = '<!doctype html>\n' + (await page.evaluate(() => document.documentElement.outerHTML))
    const outDir = route === '/' ? DIST : path.join(DIST, route)
    fs.mkdirSync(outDir, { recursive: true })
    fs.writeFileSync(path.join(outDir, 'index.html'), html)
  } catch (err) {
    failures++
    console.error(`FAIL ${route}: ${err.message.split('\n')[0]}`)
  }
}

await browser.close()
server.close()
console.log(`prerendered ${routes.length - failures}/${routes.length} routes`)
process.exit(failures === 0 ? 0 : 1)
