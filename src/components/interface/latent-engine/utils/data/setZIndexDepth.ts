export function setZIndexDepthId(element: HTMLElement, value = 0): void {
  return element.setAttribute('data-z-index-depth', `${value || "0"}`)
}