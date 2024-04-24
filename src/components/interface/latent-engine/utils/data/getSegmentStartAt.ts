export function getSegmentStartAt(element: HTMLElement, defaultValue = 0): number {
  return Number(element.getAttribute('data-segment-start-at') || defaultValue)
}