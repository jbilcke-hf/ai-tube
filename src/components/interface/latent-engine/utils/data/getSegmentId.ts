export function getSegmentId(element: HTMLElement, defaultValue = ""): string {
  return element.getAttribute('data-segment-id') || defaultValue
}