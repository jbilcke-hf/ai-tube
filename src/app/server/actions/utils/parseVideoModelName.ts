import { VideoGenerationModel } from "@/types/general"

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

  if (
    rawModelString === "hotshot" || 
    rawModelString === "hotshotxl" ||
    rawModelString === "hotshot xl" ||
    rawModelString === "hotshot-xl"
  ) {
    model = "HotshotXL"
  }

  return model
}