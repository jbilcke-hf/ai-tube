export function getZIndexDepth(element: HTMLElement, defaultValue = 0) {
  return Number(element.getAttribute('data-z-index-depth') || 0)
}