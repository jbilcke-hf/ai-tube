import { parseProjectionFromLoRA } from "@/app/server/actions/utils/parseProjectionFromLoRA"
import { MediaInfo, MediaProjection } from "@/types/general"

import { parseAssetToCheckIfGaussian } from "./parseAssetToCheckIfGaussian"

export function parseMediaProjectionType(media?: MediaInfo): MediaProjection {
  // note: we could also create a new value for when it is undetermined,
  // or we could also return undefined
  if (!media) { return "cartesian" }

  // TODO: add a way to detect its a gaussian splat (the file format, maybe?)
  const isGaussian =
    media.projection === "gaussian" ||
    parseAssetToCheckIfGaussian(media?.assetUrlHd) ||
    parseAssetToCheckIfGaussian(media?.assetUrl)
  
  if (isGaussian) {
    return "gaussian"
  }

  const isEquirectangular =
    media.projection === "equirectangular" ||
    parseProjectionFromLoRA(media.lora) === "equirectangular"

  if (isEquirectangular) {
    return "equirectangular"
  }

  return "cartesian"
}