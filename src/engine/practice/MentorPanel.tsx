import { useState } from 'react'
import { InkButton } from '../../design/InkButton'
import { getGeminiKey, setGeminiKey } from './gemini'

/**
 * The AI mentor, as a drop-in panel: a button that asks (via the caller's
 * `ask` callback), first-time key setup, and the mentor's reply. Used by
 * CodeExercise (code review) and TeachBack (explanation review).
 */
export function MentorPanel({
  id,
  label = '🤖 ask the AI mentor',
  ask,
}: {
  id: string
  label?: string
  ask: () => Promise<string>
}) {
  const [busy, setBusy] = useState(false)
  const [text, setText] = useState<string | null>(null)
  const [hasKey, setHasKey] = useState(() => Boolean(getGeminiKey()))
  const [keyOpen, setKeyOpen] = useState(false)
  const [keyDraft, setKeyDraft] = useState('')

  async function go() {
    if (!hasKey) {
      setKeyOpen(true)
      return
    }
    setBusy(true)
    setText(null)
    setText(await ask())
    setBusy(false)
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <InkButton id={`mentor-${id}`} onClick={go} disabled={busy}>
          {busy ? '🤖 thinking…' : label}
        </InkButton>
      </div>

      {keyOpen && !hasKey && (
        <div className="border-ink-soft/40 flex max-w-xl flex-col gap-2 border-l-2 border-dashed pl-3">
          <p className="text-sm">
            The mentor runs on <strong>your</strong> Gemini key (it stays in this browser only —
            never sent anywhere except to Google).
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={keyDraft}
              onChange={(e) => setKeyDraft(e.target.value)}
              placeholder="paste your Gemini API key"
              className="border-ink-soft/50 bg-paper-raised w-72 rounded-sm border border-dashed px-3 py-1.5 font-mono text-xs outline-none"
            />
            <InkButton
              id={`savekey-${id}`}
              disabled={keyDraft.trim() === ''}
              onClick={() => {
                setGeminiKey(keyDraft)
                setHasKey(true)
                setKeyOpen(false)
              }}
            >
              save key
            </InkButton>
          </div>
        </div>
      )}

      {text && (
        <div className="border-pencil-blue/60 max-w-xl border-l-2 pl-3">
          <p className="font-hand text-xl">🤖 the mentor says:</p>
          <p className="mt-1 text-[15px]">{text}</p>
        </div>
      )}
    </div>
  )
}
