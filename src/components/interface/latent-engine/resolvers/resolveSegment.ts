import { ClapProject, ClapSegment, ClapSegmentCategory } from "@aitube/clap"

import { LatentComponentResolver, LayerElement } from "../core/types"

import { resolve as genericResolver } from "./generic"
import { resolve as interfaceResolver } from "./interface"
import { resolve as videoResolver } from "./video"
import { resolve as imageResolver } from "./image"

export async function resolveSegment(segment: ClapSegment, clap: ClapProject): Promise<LayerElement> {
  let latentComponentResolver: LatentComponentResolver = genericResolver
  
  if (segment.category === ClapSegmentCategory.INTERFACE) {
    latentComponentResolver = interfaceResolver
  } else if (segment.category === ClapSegmentCategory.VIDEO) {
    latentComponentResolver = videoResolver
  } else if (segment.category === ClapSegmentCategory.IMAGE) {
    latentComponentResolver = imageResolver
  }

  return latentComponentResolver(segment, clap)
}
