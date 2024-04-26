import { ClapProject, ClapSegmentCategory } from "@aitube/clap"

import { resolveSegment } from "./resolveSegment"
import { LayerElement } from "../core/types"

export async function resolveSegments(
  clap: ClapProject,
  segmentCategory: ClapSegmentCategory,
  nbMax?: number
) : Promise<LayerElement[]> {
  return Promise.all(
    clap.segments
    .filter(s => s.category === segmentCategory)
    .slice(0, nbMax)
    .map(s => resolveSegment(s, clap))
  )
}