import { VideoOrientation } from "@/types"

export function orientationToWidthHeight(orientation?: VideoOrientation): { width: number; height: number } {

  if (orientation === "square") {
    return {
      width: 512,
      height: 512,
    }
  }
  
  const longResolution = 1024
  const shortResolution = 576

  if (orientation === "portrait") {
    return {
      width: shortResolution,
      height: longResolution,
    }
  }

  /*

  this is already the default, actually

  if (orientation === "landscape") {
    return {
      width: longResolution,
      height: shortResolution,
    }
  }
  */

  return {
    width: longResolution,
    height: shortResolution,
  }
}