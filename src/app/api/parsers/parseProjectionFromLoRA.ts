import { MediaProjection } from "@/types/general"

export function parseProjectionFromLoRA(input?: any): MediaProjection {
 const name = `${input || ""}`.trim().toLowerCase()

  const isEquirectangular = (
    name.includes("equirectangular") ||
    name.includes("panorama") ||
    name.includes("360")
  )

  return (
    isEquirectangular
    ? "equirectangular"
    : "cartesian"
  )
}