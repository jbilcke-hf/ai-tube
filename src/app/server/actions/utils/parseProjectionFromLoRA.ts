import { VideoProjection } from "@/types"

export function parseProjectionFromLoRA(input?: any): VideoProjection {
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