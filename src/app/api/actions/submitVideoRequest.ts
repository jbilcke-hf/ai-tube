"use server"

import { ClapImageRatio } from "@aitube/clap"

import { ChannelInfo, VideoGenerationModel, MediaInfo } from "@/types/general"

import { uploadVideoRequestToDataset } from "./ai-tube-hf/uploadVideoRequestToDataset"

export async function submitVideoRequest({
  channel,
  apiKey,
  title,
  description,
  prompt,
  model,
  lora,
  style,
  voice,
  music,
  tags,
  duration,
  orientation,
}: {
  channel: ChannelInfo
  apiKey: string
  title: string
  description: string
  prompt: string
  model: VideoGenerationModel
  lora: string
  style: string
  voice: string
  music: string
  tags: string[]
  duration: number
  orientation: ClapImageRatio
}): Promise<MediaInfo> {
  if (!apiKey) {
    throw new Error(`the apiKey is required`)
  }

  const { videoRequest, videoInfo } = await uploadVideoRequestToDataset({
    channel,
    apiKey,
    title,
    description,
    prompt,
    model,
    lora,
    style,
    voice,
    music,
    tags,
    duration,
    orientation
  })


  return videoInfo
}