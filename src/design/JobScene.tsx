import type { ReactNode } from 'react'

/*
 * The "💼 on the job" artifact family (spec: 2026-07-06-quiz-stems-and-on-the-job-section).
 * Hand-drawn skin via wobbly border radii; ink color falls back if the token is absent.
 * Section anatomy: <JobScene><Scene>…</Scene> <artifact/> <Takeaway>…</Takeaway></JobScene>
 */

const INK = 'var(--color-ink, #2B2A26)'
const ROUGH_A = '255px 15px 225px 15px / 15px 225px 15px 255px'
const ROUGH_B = '15px 255px 15px 225px / 225px 15px 255px 15px'

export function JobScene({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-3">{children}</div>
}

/** One italic line of plain future-work framing: “One day at work, you will …” */
export function Scene({ children }: { children: ReactNode }) {
  return <p className="text-ink-soft text-sm italic">{children}</p>
}

export function Takeaway({ children }: { children: ReactNode }) {
  return <p className="text-[15px]">{children}</p>
}

/** Highlighted key phrase inside a Takeaway. */
export function Key({ children }: { children: ReactNode }) {
  return (
    <strong
      style={{
        background:
          'linear-gradient(transparent 55%, color-mix(in srgb, var(--color-marker-yellow) 55%, transparent) 55%)',
      }}
    >
      {children}
    </strong>
  )
}

/** A wobbly speech bubble with a small hand-drawn face. accent = teal border (replies). */
export function ChatBubble({
  who,
  face,
  accent = false,
  indent = false,
  children,
}: {
  who: string
  face: string
  accent?: boolean
  indent?: boolean
  children: ReactNode
}) {
  return (
    <div
      className="bg-white px-4 py-2.5 text-[14px]"
      style={{
        border: `2px solid ${accent ? 'var(--color-marker-teal, #2A9D8F)' : INK}`,
        borderRadius: accent ? ROUGH_B : ROUGH_A,
        transform: accent ? 'rotate(0.5deg)' : 'rotate(-0.6deg)',
        marginLeft: indent ? '1.5rem' : 0,
      }}
    >
      <div className="font-mono text-[11px] text-ink-soft">
        <span
          className="mr-1.5 inline-block text-center"
          style={{
            width: 24,
            height: 24,
            lineHeight: '21px',
            border: `2px solid ${INK}`,
            borderRadius: '60% 40% 55% 45%/50% 55% 45% 50%',
            background: '#fff',
          }}
        >
          {face}
        </span>
        {who}
      </div>
      <div className="mt-1">{children}</div>
    </div>
  )
}

/** A code-review artifact: file title bar + code lines; dead lines fade, notes point. */
export function ReviewCard({
  file,
  lines,
}: {
  file: string
  lines: { text: string; dead?: boolean; note?: string }[]
}) {
  return (
    <div className="bg-paper-shade" style={{ border: `2px solid ${INK}`, borderRadius: ROUGH_A }}>
      <div className="font-mono text-[11px] text-ink-soft px-3 py-1" style={{ borderBottom: `2px solid ${INK}` }}>
        ✎ pull request · {file}
      </div>
      <pre className="overflow-x-auto px-3 py-2 font-mono text-[12.5px] leading-7">
        {lines.map((l, i) => (
          <div key={i} style={{ opacity: l.dead ? 0.5 : 1 }}>
            {l.text}
            {l.note && (
              <span className="font-bold" style={{ color: 'var(--color-marker-coral, #E8604C)', opacity: 1 }}>
                {'  '}← {l.note}
              </span>
            )}
          </div>
        ))}
      </pre>
    </div>
  )
}

/** A dark terminal / test-run card. Compose lines with <Pass>/<Fail> marks below. */
export function TestRunCard({ lines }: { lines: ReactNode[] }) {
  return (
    <div
      className="px-4 py-2.5 font-mono text-[12.5px] leading-7"
      style={{ background: INK, color: 'var(--color-paper, #FBF7EE)', border: `2px solid ${INK}`, borderRadius: ROUGH_A }}
    >
      {lines.map((l, i) => (
        <div key={i}>{l}</div>
      ))}
    </div>
  )
}

export function Pass({ children }: { children: ReactNode }) {
  return <span style={{ color: 'var(--color-marker-teal, #2A9D8F)', fontWeight: 700 }}>✓ {children}</span>
}

export function Fail({ children }: { children: ReactNode }) {
  return (
    <span
      className="px-1.5 font-bold"
      style={{ color: 'var(--color-marker-coral, #E8604C)', border: '2px solid var(--color-marker-coral, #E8604C)', borderRadius: '50% 45% 55% 48%' }}
    >
      ✗ {children}
    </span>
  )
}

/** A sketched fragment of an app screen (the bug, visible). */
export function AppMoment({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white px-4 py-3 text-[14px]" style={{ border: `2px solid ${INK}`, borderRadius: ROUGH_A }}>
      {children}
    </div>
  )
}

/** A CI pipeline row: labeled steps, pass/fail/run states. */
export function PipelineRow({ steps }: { steps: { label: string; state: 'pass' | 'fail' | 'run' }[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {steps.map((s, i) => (
        <div
          key={i}
          className="px-3 py-1 font-mono text-[12px]"
          style={{
            border: `2px solid ${s.state === 'fail' ? 'var(--color-marker-coral, #E8604C)' : s.state === 'pass' ? 'var(--color-marker-teal, #2A9D8F)' : INK}`,
            borderRadius: i % 2 ? ROUGH_B : ROUGH_A,
          }}
        >
          {s.state === 'pass' ? '✓ ' : s.state === 'fail' ? '✗ ' : '⟳ '}
          {s.label}
        </div>
      ))}
    </div>
  )
}
