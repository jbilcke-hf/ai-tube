export function setSegmentEndAt(element: HTMLElement, value = 0): void {
  return element.setAttribute('data-segment-end-at', `${value || "0"}`)
}