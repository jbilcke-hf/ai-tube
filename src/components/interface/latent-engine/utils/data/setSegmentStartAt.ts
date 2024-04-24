export function setSegmentStartAt(element: HTMLElement, value = 0): void {
  return element.setAttribute('data-segment-start-at', `${value || "0"}`)
}