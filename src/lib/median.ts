export function median(values: number[]): number {
  if (values.length === 0) return 0;

  const sorted = [...values].sort((a, b) => a - b);
  const middleIndex = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 1) return sorted[middleIndex];
  return Math.round((sorted[middleIndex - 1] + sorted[middleIndex]) / 2);
}
