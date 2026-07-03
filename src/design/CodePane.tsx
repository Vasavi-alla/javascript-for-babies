import { useEffect, useState } from 'react'
import { codeToHtml } from 'shiki'

/**
 * Shiki-highlighted code on paper. `highlightLines` (1-based) get the
 * marker-yellow "highlighter swipe" via the .line-hot class in index.css.
 */
export function CodePane({
  code,
  lang = 'javascript',
  highlightLines = [],
  className,
}: {
  code: string
  lang?: string
  highlightLines?: number[]
  className?: string
}) {
  const [html, setHtml] = useState<string | null>(null)
  const linesKey = highlightLines.join(',')

  useEffect(() => {
    let alive = true
    codeToHtml(code, {
      lang,
      theme: 'vitesse-light',
      transformers: [
        {
          line(node, line) {
            if (highlightLines.includes(line)) {
              const existing = node.properties.class
              node.properties.class = [existing, 'line-hot'].filter(Boolean).join(' ')
            }
          },
        },
      ],
    }).then((result) => {
      if (alive) setHtml(result)
    })
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, lang, linesKey])

  if (html === null) {
    return (
      <pre className={`codepane bg-paper-shade rounded-md px-5 py-4 text-[15px] leading-[1.8] ${className ?? ''}`}>
        {code}
      </pre>
    )
  }

  return <div className={`codepane ${className ?? ''}`} dangerouslySetInnerHTML={{ __html: html }} />
}
