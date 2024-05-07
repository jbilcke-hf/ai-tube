import { VideoGenerationModel } from "@/types/general"

export const showBetaFeatures = `${
  process.env.NEXT_PUBLIC_SHOW_BETA_FEATURES || ""
}`.trim().toLowerCase() === "true"


export const defaultVideoModel: VideoGenerationModel = "SVD"
export const defaultVoice = "Julian"

export const developerMode = `${
  process.env.NEXT_PUBLIC_DEVELOPER_MODE || ""
}`.trim().toLowerCase() === "true"
