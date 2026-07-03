/** Deterministic seeds so hand-drawn wobble never changes between renders. */

export function hashSeed(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return ((h >>> 0) % 2147483646) + 1
}

/** Deterministic value in [min, max) derived from a seed. */
export function seededBetween(seed: number, min: number, max: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  const frac = x - Math.floor(x)
  return min + frac * (max - min)
}
