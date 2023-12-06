export function truncate(text: string, length: number): string {
  const truncated = text.slice(0, length)

  return `${truncated}${truncated !== text ? '...' : ''}`
}