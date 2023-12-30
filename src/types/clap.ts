export type ClapHeader = {
  format: "clap-0"
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
}

export type ClapSegment = {
  id: string
  track: number
  startTimeInMs: number
  endTimeInMs: number
  category: "render" | "preview" | "characters" | "location" | "time" | "era" | "lighting" | "weather" | "action" | "music" | "sound" | "dialogue" | "style" | "camera" | "generic"
  modelId: string
  prompt: string
  outputType: "text" | "movement" | "image" | "video" | "audio"
  renderId: string
  status: "pending" | "completed" | "error"
  assetUrl: string
  outputGain: number
  seed: number
}

export type ClapProject = {
  meta: ClapMeta
  segments: ClapSegment[]
}
