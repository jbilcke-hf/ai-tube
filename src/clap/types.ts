
export type ClapSegmentCategory = "render" | "preview" | "characters" | "location" | "time" | "era" | "lighting" | "weather" | "action" | "music" | "sound" | "dialogue" | "style" | "camera" | "generic"
export type ClapOutputType = "text" | "movement" | "image" | "video" | "audio"
export type ClapSegmentStatus = "pending" | "completed" | "error"
export type ClapImageType = "reference_image" | "text_prompt" | "other"
export type ClapAudioType =  "reference_audio" | "text_prompt" | "other"

export type ClapHeader = {
  format: "clap-0"
  numberOfModels: number
  numberOfSegments: number
}

export type ClapMeta = {
  id: string
  title: string
  description: string
  licence: string
  orientation: string
  width: number
  height: number
  defaultVideoModel: string
  extraPositivePrompt: string[]
}

export type ClapSegment = {
  id: string
  track: number
  startTimeInMs: number
  endTimeInMs: number
  category: ClapSegmentCategory
  modelId: string
  prompt: string
  outputType: ClapOutputType
  renderId: string
  status: ClapSegmentStatus
  assetUrl: string
  outputGain: number
  seed: number
}

export type ClapModel = {
  id: string
  imageType: ClapImageType
  audioType: ClapAudioType
  category: ClapSegmentCategory
  triggerName: string
  label: string
  description: string
  author: string
  thumbnailUrl: string
  storageUrl: string
  imagePrompt: string
  audioPrompt: string
}

export type ClapProject = {
  meta: ClapMeta
  models: ClapModel[]
  segments: ClapSegment[]
  // let's keep room for other stuff (screenplay etc)
}
