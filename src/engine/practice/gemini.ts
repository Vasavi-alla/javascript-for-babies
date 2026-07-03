/**
 * Optional AI mentor, powered by the user's own Gemini key (paid tier).
 * The key lives only in this browser's localStorage; every feature here
 * degrades gracefully when no key is set.
 */

const KEY_STORAGE = 'jfb-gemini-key'
export const GEMINI_MODEL = 'gemini-3.5-flash'

export function getGeminiKey(): string {
  return localStorage.getItem(KEY_STORAGE) ?? ''
}

export function setGeminiKey(key: string) {
  if (key.trim()) localStorage.setItem(KEY_STORAGE, key.trim())
  else localStorage.removeItem(KEY_STORAGE)
}

export async function askMentor(args: {
  task: string
  code: string
  output: string[]
  expected: string[]
  error?: string
  passed: boolean
}): Promise<string> {
  const key = getGeminiKey()
  if (!key) return 'No Gemini key set yet — add one to wake the mentor up.'

  const prompt = [
    'You are a warm, patient JavaScript mentor inside a visual learning app. The learner is a complete beginner who has just learned: variables (let/const), if/else, loops, and is now learning functions (parameters, calling).',
    `The exercise asks: ${args.task}`,
    `Their code:\n${args.code}`,
    args.error ? `Running it produced this error: ${args.error}` : `Console output: ${JSON.stringify(args.output)}`,
    `Expected output: ${JSON.stringify(args.expected)}`,
    args.passed
      ? 'They PASSED. In at most 80 words of simple English, praise one specific thing they did right, and offer at most one gentle improvement (style or habit) if there is an obvious one.'
      : 'They have NOT passed yet. In at most 90 words of simple English, explain what is going wrong and nudge them toward the fix — but do NOT write the corrected code for them. No jargon beyond: variable, function, parameter, argument, call, string.',
  ].join('\n\n')

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(key)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      },
    )
    if (!res.ok) {
      if (res.status === 400 || res.status === 401 || res.status === 403)
        return 'The mentor couldn’t log in — that key doesn’t seem to work. Double-check it and save again.'
      return `The mentor is unreachable right now (HTTP ${res.status}). Your local checks above still tell the truth!`
    }
    const data = (await res.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
    }
    const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? ''
    return text.trim() || 'The mentor went quiet — try asking again.'
  } catch {
    return 'The mentor is unreachable (no network?). Your local checks above still tell the truth!'
  }
}
