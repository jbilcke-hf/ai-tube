import { getSegmentStartAt } from "./getSegmentStartAt"

export function getElementsSortedByStartAt<T extends HTMLElement>(elements: T[], createCopy = true): T[] {
  
  const array = createCopy ? [...elements]:  elements

  // this sort from the smallest (oldest) to biggest (youngest)
  return array.sort((a, b) => {
    const aSegmentStartAt = getSegmentStartAt(a)
    const bSegmentStartAt = getSegmentStartAt(b)
    return aSegmentStartAt - bSegmentStartAt
  })
}