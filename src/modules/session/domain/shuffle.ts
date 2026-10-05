/** Caller supplies 128 random bits, never an identity or timestamp. Not a security token. */
export function validateSeed(seed: string): void {
  if (typeof seed !== "string" || !/^[a-f0-9]{32}$/.test(seed) || /^0+$/.test(seed)) {
    throw new Error("WORKSPACE_INVALID_SEED");
  }
}

/** xoshiro128** with unsigned 32-bit arithmetic; deterministic across JS runtimes. */
function randomWords(seed: string): () => number {
  validateSeed(seed);
  let a = parseInt(seed.slice(0, 8), 16) >>> 0;
  let b = parseInt(seed.slice(8, 16), 16) >>> 0;
  let c = parseInt(seed.slice(16, 24), 16) >>> 0;
  let d = parseInt(seed.slice(24, 32), 16) >>> 0;
  const rotate = (value: number, bits: number) =>
    ((value << bits) | (value >>> (32 - bits))) >>> 0;
  return () => {
    const result = Math.imul(rotate(Math.imul(b, 5), 7), 9) >>> 0;
    const t = b << 9;
    c ^= a;
    d ^= b;
    b ^= c;
    a ^= d;
    c ^= t;
    d = rotate(d, 11);
    return result;
  };
}

/** Rejection sampling avoids modulo bias, including for non-power-of-two bounds. */
export function uniformIndex(nextWord: () => number, bound: number): number {
  if (!Number.isSafeInteger(bound) || bound < 1 || bound > 0x100000000) {
    throw new Error("WORKSPACE_INVALID_RANDOM_BOUND");
  }
  const limit = 0x100000000 - (0x100000000 % bound);
  let word: number;
  do {
    word = nextWord();
    if (!Number.isInteger(word) || word < 0 || word >= 0x100000000) {
      throw new Error("WORKSPACE_INVALID_RANDOM_WORD");
    }
  } while (word >= limit);
  return word % bound;
}

/** Copy first: the editorial deck and its elements are never modified. */
export function seededShuffle<T>(items: readonly T[], seed: string): T[] {
  const nextWord = randomWords(seed);
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = uniformIndex(nextWord, i + 1);
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}
