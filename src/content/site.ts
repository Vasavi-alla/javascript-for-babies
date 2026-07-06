/** Single source of truth for the brand and canonical origin (SEO spec 2026-07-06). */
export const SITE_NAME = 'JS Sketchbook'
export const SITE_TAGLINE =
  'JavaScript for absolute beginners — drawn, animated, and hands-on, all the way to Playwright automation testing.'
/** No trailing slash. Set in .env; falls back for local dev. */
export const SITE_URL: string = (import.meta.env.VITE_SITE_URL ?? 'https://jssketchbook.com').replace(/\/$/, '')
export const AUTHOR = { name: 'Vasavi', linkedIn: 'https://www.linkedin.com/in/vasavi-alla/' }

export function absUrl(path: string): string {
  return SITE_URL + (path.startsWith('/') ? path : '/' + path)
}
