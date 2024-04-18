import { ClapProject, ClapSegment } from "@/lib/clap/types"

import { LatentComponentResolver } from "../core/types"

import { resolve as genericResolver } from "./generic"
import { resolve as interfaceResolver } from "./interface"
import { resolve as videoResolver } from "./video"
import { resolve as imageResolver } from "./image"

export async function resolveSegment(segment: ClapSegment, clap: ClapProject): Promise<JSX.Element> {
  let latentComponentResolver: LatentComponentResolver = genericResolver
  
  if (segment.category === "interface") {
    latentComponentResolver = interfaceResolver
  } else if (segment.category === "video") {

    // for backend performance reason (generative video is slow)
    // we do not support "true" video for now
    // latentComponentResolver = videoResolver
    latentComponentResolver = imageResolver
  }

  return latentComponentResolver(segment, clap)
}
