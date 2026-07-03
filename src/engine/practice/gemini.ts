/**
 * Optional AI mentor, powered by the user's own Gemini key (paid tier).
 * The key lives only in this browser's localStorage; every feature here
 * degrades gracefully when no key is set.
 */

const KEY_STORAGE = 'jfb-gemini-key'
export const GEMINI_MODEL = 'gemini-3.5-flash'

export function getGeminiKey(): string {
  // The user's own key: either pasted once into the mentor panel (localStorage)
  // or supplied via .env.local (VITE_GEMINI_KEY) — never hardcoded in source.
  return (
    localStorage.getItem(KEY_STORAGE) ??
    ((import.meta.env.VITE_GEMINI_KEY as string | undefined) || '')
  )
}

export function setGeminiKey(key: string) {
  if (key.trim()) localStorage.setItem(KEY_STORAGE, key.trim())
  else localStorage.removeItem(KEY_STORAGE)
}

/** Review a code exercise attempt. */
export async function askMentor(args: {
  task: string
  code: string
  output: string[]
  expected: string[]
  error?: string
  passed: boolean
}): Promise<string> {
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
  return callGemini(prompt)
}

/**
 * Review a teach-back: the learner explains the concept in their own words;
 * the mentor checks the understanding, not the wording.
 */
export async function reviewTeachBack(args: {
  prompt: string
  answer: string
  modelAnswer: string
}): Promise<string> {
  const prompt = [
    'You are a warm, patient JavaScript teacher reviewing a beginner\'s "teach-back". After each lesson the learner must explain the concept in their own words, as if teaching a friend — if they can teach it, they own it. Judge the UNDERSTANDING, never the wording or the metaphors they chose.',
    `The teach-back question was: ${args.prompt}`,
    `The learner's explanation:\n${args.answer}`,
    `A model answer, for your reference only (do NOT demand its wording):\n${args.modelAnswer}`,
    'Reply in at most 110 words of simple English, addressing the learner as "you": (1) name what they clearly got right; (2) gently correct anything actually wrong; (3) point out the single most important missing idea, if any. If the explanation is genuinely solid, say so plainly and offer one way to make it even sharper. No jargon beyond what a beginner knows (value, variable, function, parameter, argument, call).',
  ].join('\n\n')
  return callGemini(prompt)
}

async function callGemini(prompt: string): Promise<string> {
  const key = getGeminiKey()
  if (!key) return 'No Gemini key set yet — add one to wake the mentor up.'

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
