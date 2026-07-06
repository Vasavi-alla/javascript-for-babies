import { useEffect } from 'react'
import { absUrl } from '../content/site'

interface SeoProps {
  title: string
  description: string
  /** Route path used for the canonical URL, e.g. '/lesson/1.10'. */
  path: string
  jsonLd?: object
  noindex?: boolean
}

function upsert(selector: string, create: () => HTMLElement, set: (el: HTMLElement) => void) {
  let el = document.head.querySelector<HTMLElement>(selector)
  if (!el) {
    el = create()
    document.head.appendChild(el)
  }
  set(el)
}

const meta = (attr: 'name' | 'property', key: string, content: string) =>
  upsert(
    `meta[${attr}="${key}"]`,
    () => {
      const m = document.createElement('meta')
      m.setAttribute(attr, key)
      return m
    },
    (el) => el.setAttribute('content', content),
  )

/** Per-route head: title, description, canonical, OG/Twitter, JSON-LD (SEO spec 2026-07-06). */
export function useSeo({ title, description, path, jsonLd, noindex }: SeoProps) {
  useEffect(() => {
    document.title = title
    meta('name', 'description', description)
    meta('property', 'og:title', title)
    meta('property', 'og:description', description)
    meta('property', 'og:url', absUrl(path))
    meta('name', 'twitter:title', title)
    meta('name', 'twitter:description', description)
    upsert(
      'link[rel="canonical"]',
      () => {
        const l = document.createElement('link')
        l.setAttribute('rel', 'canonical')
        return l
      },
      (el) => el.setAttribute('href', absUrl(path)),
    )
    if (noindex) {
      meta('name', 'robots', 'noindex')
    } else {
      document.head.querySelector('meta[name="robots"]')?.remove()
    }
    const existing = document.getElementById('seo-jsonld')
    if (existing) existing.remove()
    if (jsonLd) {
      const s = document.createElement('script')
      s.type = 'application/ld+json'
      s.id = 'seo-jsonld'
      s.textContent = JSON.stringify(jsonLd)
      document.head.appendChild(s)
    }
  }, [title, description, path, jsonLd, noindex])
}
