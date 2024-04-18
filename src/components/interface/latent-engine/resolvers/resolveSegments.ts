import { ClapProject, ClapSegmentCategory } from "@/lib/clap/types"

import { resolveSegment } from "./resolveSegment"

export async function resolveSegments(
  clap: ClapProject,
  segmentCategory: ClapSegmentCategory,
  nbMax?: number
) : Promise<JSX.Element[]> {
  const elements: JSX.Element[] = await Promise.all(
    clap.segments
    .filter(s => s.category === segmentCategory)
    .slice(0, nbMax)
    .map(s => resolveSegment(s, clap))
  )
  return elements
}