// Emits dist/sitemap.xml for every route. Run AFTER `vite build`, BEFORE prerender.
import fs from 'node:fs'
import { getRoutes, getSiteUrl } from './site-routes.mjs'

const site = getSiteUrl()
const today = new Date().toISOString().slice(0, 10)
const urls = getRoutes()
  .map(
    (r) =>
      `  <url><loc>${site}${r === '/' ? '/' : r}</loc><lastmod>${today}</lastmod>${r === '/' ? '<priority>1.0</priority>' : ''}</url>`,
  )
  .join('\n')
fs.writeFileSync(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
)
console.log(`sitemap: ${getRoutes().length} URLs → dist/sitemap.xml`)
