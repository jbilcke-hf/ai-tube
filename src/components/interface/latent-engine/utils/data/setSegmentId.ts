export function setSegmentId(element: HTMLElement, value = ""): void {
  return element.setAttribute('data-segment-id', value)
}