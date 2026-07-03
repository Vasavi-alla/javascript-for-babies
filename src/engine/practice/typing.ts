/**
 * iPadOS "smart punctuation" silently swaps straight quotes for curly ones
 * (and can insert non-breaking spaces). JavaScript — and exact-answer checks —
 * need the straight originals, so every typing surface normalizes as you type.
 */
export function unsmartText(text: string): string {
  return text
    .replace(/[‘’‚′]/g, "'")
    .replace(/[“”„″]/g, '"')
    .replace(/ /g, ' ')
}
