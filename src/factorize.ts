export function factorize(n: bigint): bigint[] {
  const factors: bigint[] = [];
  let d = 2n;
  while (d * d <= n) {
    while (n % d === 0n) {
      factors.push(d);
      n /= d;
    }
    d += 1n;
  }
  if (n > 1n) {
    factors.push(n);
  }
  return factors;
}