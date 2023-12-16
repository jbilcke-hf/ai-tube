import { VideoGenerationModel } from "@/types"

export function parseVideoModelName(text: any, defaultToUse: VideoGenerationModel): VideoGenerationModel {
  const rawModelString = `${text || ""}`.trim().toLowerCase()

  let model: VideoGenerationModel = defaultToUse || "SVD"

  if (
    rawModelString === "stable video diffusion" || 
    rawModelString === "stablevideodiffusion" || 
    rawModelString === "svd"
  ) {
    model = "SVD"
  }

  if (
    rawModelString === "la vie" || 
    rawModelString === "lavie"
  ) {
    model = "LaVie"
  }

  return model
}