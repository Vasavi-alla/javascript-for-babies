import type { ReactNode } from 'react'

/*
 * The "🎤 in an interview" card (spec: 2026-07-07-in-an-interview-section).
 * Bands: the question, the crisp answer, the deeper follow-up, and the trap to
 * avoid. Sketchbook skin consistent with JobScene.tsx.
 */

const INK = 'var(--color-ink, #2B2A26)'
const ROUGH = '255px 15px 225px 15px / 15px 225px 15px 255px'

function Band({ label, color, children }: { label: string; color: string; children: ReactNode }) {
  return (
    <div>
      <div className="font-mono text-[11px] uppercase tracking-wide" style={{ color }}>
        {label}
      </div>
      <div className="mt-1 text-[15px]">{children}</div>
    </div>
  )
}

export function InterviewCard({
  question,
  say,
  example,
  deeper,
  dontSay,
}: {
  question: string
  say: ReactNode
  example?: { code: string; note?: string }
  deeper?: ReactNode
  dontSay?: { wrong: string; why: string }
}) {
  return (
    <div className="flex flex-col gap-4">
      <div
        className="bg-white px-4 py-2.5 text-[15px] font-semibold"
        style={{ border: `2px solid ${INK}`, borderRadius: ROUGH, transform: 'rotate(-0.5deg)' }}
      >
        <span className="mr-1.5">🎤</span>
        “{question}”
      </div>

      <Band label="Say this" color="var(--color-marker-teal, #2A9D8F)">
        {say}
      </Band>

      {example && (
        <Band label="Show this on paper" color="var(--color-ink-soft, #6B6862)">
          <pre
            className="overflow-x-auto whitespace-pre px-3 py-2.5 font-mono text-[12.5px] leading-6"
            style={{ background: 'var(--color-paper-shade, #F1E9D8)', border: `2px solid ${INK}`, borderRadius: ROUGH }}
          >
            {example.code}
          </pre>
          {example.note && <div className="text-ink-soft mt-1.5 text-[13px] italic">{example.note}</div>}
        </Band>
      )}

      {deeper && (
        <Band label="If they dig deeper" color="var(--color-pencil-blue, #3A6EA5)">
          {deeper}
        </Band>
      )}

      {dontSay && (
        <Band label="⚠ Don’t say" color="var(--color-marker-coral, #E8604C)">
          <span className="line-through opacity-70">“{dontSay.wrong}”</span>
          <div className="mt-1 opacity-100">{dontSay.why}</div>
        </Band>
      )}
    </div>
  )
}
