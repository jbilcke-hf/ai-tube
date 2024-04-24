export function getSegmentEndAt(element: HTMLElement, defaultValue = 0): number {
  return Number(element.getAttribute('data-segment-end-at') || defaultValue)
}