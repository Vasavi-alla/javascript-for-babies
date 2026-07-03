/** Line diff (LCS) between the learner's code and the model answer. */

export interface DiffLine {
  type: 'same' | 'yours' | 'model'
  text: string
}

export function diffLines(yours: string, model: string): DiffLine[] {
  const a = yours.replace(/\r\n/g, '\n').split('\n')
  const b = model.replace(/\r\n/g, '\n').split('\n')
  const norm = (s: string) => s.trim().replace(/\s+/g, ' ')

  // LCS table on normalized lines (indentation/spacing differences aren't "wrong")
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0))
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      dp[i][j] = norm(a[i]) === norm(b[j]) ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1])
    }
  }

  const out: DiffLine[] = []
  let i = 0
  let j = 0
  while (i < a.length && j < b.length) {
    if (norm(a[i]) === norm(b[j])) {
      out.push({ type: 'same', text: b[j] })
      i++
      j++
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      out.push({ type: 'yours', text: a[i] })
      i++
    } else {
      out.push({ type: 'model', text: b[j] })
      j++
    }
  }
  while (i < a.length) out.push({ type: 'yours', text: a[i++] })
  while (j < b.length) out.push({ type: 'model', text: b[j++] })

  // drop blank-line noise
  return out.filter((line) => line.type === 'same' || line.text.trim() !== '')
}
