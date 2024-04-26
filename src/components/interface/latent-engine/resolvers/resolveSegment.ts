import { ClapProject, ClapSegment } from "@aitube/clap"

import { LatentComponentResolver, LayerElement } from "../core/types"

import { resolve as genericResolver } from "./generic"
import { resolve as interfaceResolver } from "./interface"
import { resolve as videoResolver } from "./video"
import { resolve as imageResolver } from "./image"

export async function resolveSegment(segment: ClapSegment, clap: ClapProject): Promise<LayerElement> {
  let latentComponentResolver: LatentComponentResolver = genericResolver
  
  if (segment.category === "interface") {
    latentComponentResolver = interfaceResolver
  } else if (segment.category === "video") {
    latentComponentResolver = videoResolver
  } else if (segment.category === "storyboard") {
    latentComponentResolver = imageResolver
  }

  return latentComponentResolver(segment, clap)
}
