import { parseProjectionFromLoRA } from "@/app/api/parsers/parseProjectionFromLoRA"
import { MediaInfo, MediaProjection } from "@/types/general"

import { parseAssetToCheckIfGaussian } from "./parseAssetToCheckIfGaussian"
import { parseAssetToCheckIfLatent } from "./parseAssetToCheckIfLatent"

export function parseMediaProjectionType(media?: MediaInfo): MediaProjection {
  // note: we could also create a new value for when it is undetermined,
  // or we could also return undefined
  if (!media) { return "cartesian" }

  const isLatent = 
    media.projection === "latent" ||
    parseAssetToCheckIfLatent(media?.assetUrlHd) ||
    parseAssetToCheckIfLatent(media?.assetUrl)

  if (isLatent) {
    return "latent"
  }

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