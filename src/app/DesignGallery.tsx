import { useState } from 'react'
import { Link } from 'react-router'
import { SITE_NAME } from '../content/site'
import { useSeo } from './useSeo'
import { StickyNote } from '../design/StickyNote'
import { InkButton } from '../design/InkButton'
import { TapeLabel } from '../design/TapeLabel'
import { HighlightMark } from '../design/HighlightMark'
import { ConsolePane } from '../design/ConsolePane'
import { HandArrow, RoughEllipse, RoughRect } from '../design/rough-svg'

/**
 * The app's internal style guide — a reference of the sketchbook design
 * language for building the app itself. The learning demos live in each
 * phase's own lab (on the phase pages).
 */

const SWATCHES = [
  ['paper', '#FBF5E9'],
  ['paper-raised', '#FFFDF6'],
  ['paper-shade', '#F1E8D7'],
  ['ink', '#2B2925'],
  ['ink-soft', '#6B6459'],
  ['marker-yellow', '#FFD95E'],
  ['marker-coral', '#FF6B57'],
  ['marker-teal', '#2FA98C'],
  ['pencil-blue', '#5B8DB8'],
  ['sticky', '#FFF3B8'],
  ['sticky-pink', '#FFD9D2'],
] as const

export function DesignGallery() {
  useSeo({ title: `Style guide | ${SITE_NAME}`, description: 'Internal design gallery.', path: '/design', noindex: true })
  const [logs, setLogs] = useState<string[]>(['Hello, machine!'])

  return (
    <div className="flex flex-col gap-12">
      <p className="text-ink-soft max-w-2xl">
        This page is the app’s internal style reference — the shared visual language every lesson
        is drawn in. Looking for the interactive learning demos? Each phase has its own lab on{' '}
        <Link to="/" className="underline">its phase page</Link> (try{' '}
        <Link to="/phase/0" className="underline">phase 0</Link> or{' '}
        <Link to="/phase/1" className="underline">phase 1</Link>).
      </p>

      <section>
        <TapeLabel id="g-palette">palette</TapeLabel>
        <div className="mt-4 flex flex-wrap gap-3">
          {SWATCHES.map(([name, hex]) => (
            <div key={name} className="text-center">
              <div
                className="ink-dot h-14 w-14 border-2"
                style={{ background: hex, borderColor: 'var(--color-ink)' }}
              />
              <span className="text-ink-soft text-xs">{name}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <TapeLabel id="g-type">typography & marks</TapeLabel>
        <div className="mt-4 flex flex-col gap-2">
          <p className="font-hand text-4xl font-bold">Caveat for titles & diagram labels</p>
          <p>
            Nunito for body — because reading should be easy. Key ideas get{' '}
            <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
              a highlighter swipe
            </HighlightMark>
            , gotchas get{' '}
            <HighlightMark type="circle" color="var(--color-marker-coral)">circled</HighlightMark>, and
            wins get{' '}
            <HighlightMark type="underline" color="var(--color-marker-teal)">underlined</HighlightMark>.
          </p>
          <p className="font-code text-[15px]">JetBrains Mono for code — ligatures off, {'=>'} stays two characters.</p>
        </div>
      </section>

      <section>
        <TapeLabel id="g-components">components</TapeLabel>
        <div className="mt-4 flex flex-wrap items-start gap-6">
          <div className="flex flex-col gap-3">
            <InkButton id="g-btn-default" onClick={() => setLogs((l) => [...l, `clicked at step ${l.length}`])}>
              log something
            </InkButton>
            <InkButton id="g-btn-primary" variant="primary">primary action</InkButton>
            <InkButton id="g-btn-disabled" disabled>disabled</InkButton>
          </div>
          <StickyNote id="g-sticky-y">A yellow sticky for side notes.</StickyNote>
          <StickyNote id="g-sticky-p" color="pink">A pink one for predictions.</StickyNote>
          <ConsolePane lines={logs} />
        </div>
      </section>

      <section>
        <TapeLabel id="g-rough">hand-drawn primitives</TapeLabel>
        <svg viewBox="0 0 640 150" className="mt-4 w-full max-w-2xl">
          <RoughRect x={20} y={30} width={130} height={80} seed={1} />
          <RoughRect x={190} y={30} width={130} height={80} seed={2} fill="var(--color-marker-teal)" />
          <RoughEllipse cx={420} cy={70} width={120} height={80} seed={3} fill="var(--color-marker-coral)" />
          <HandArrow from={{ x: 500, y: 70 }} to={{ x: 610, y: 70 }} seed={4} />
          <text x={30} y={135} fontFamily="var(--font-hand)" fontSize={20} fill="var(--color-ink-soft)">
            every wobble is seeded — it never changes between renders
          </text>
        </svg>
      </section>
    </div>
  )
}
