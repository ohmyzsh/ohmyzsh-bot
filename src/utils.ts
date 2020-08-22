export function different (A: string[], B: string[]): boolean {
  if (A.length !== B.length) return true

  A.sort()
  B.sort()

  for (let i = 0; i < A.length; i++) {
    if (A[i] !== B[i]) return true
  }

  return false
}
