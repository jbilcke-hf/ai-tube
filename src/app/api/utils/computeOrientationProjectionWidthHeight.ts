import { MediaProjection } from "@/types/general"

import { parseProjectionFromLoRA } from "../parsers/parseProjectionFromLoRA"
import { ClapMediaOrientation, parseMediaOrientation } from "@aitube/clap"

export function computeOrientationProjectionWidthHeight({
  lora: maybeLora,
  projection: maybeProjection,
  orientation: maybeOrientation,
}: {
  lora?: any
  projection?: any
  orientation?: any
}): {
  orientation: ClapMediaOrientation
  projection: MediaProjection
  width: number
  height: number
} {

  const lora = `${maybeLora || ""}`
  const orientation = parseMediaOrientation(maybeOrientation)
  const projection = maybeProjection ? maybeProjection : parseProjectionFromLoRA(lora)

  let width = 1024
  let height = 576

  if (orientation === "portrait") {
    height = 1024
    width = 576
  } else if (orientation === "square") {
    height = 512
    width = 512
  } else {
    width = 1024
    height = 576
  }

  // now for equirectangular videos we need to have the correct image ratio of 2:1
  if (projection === "equirectangular") {
    width = 1024
    height = 512
  }

  return {
    orientation,
    projection,
    width,
    height,
  }
}