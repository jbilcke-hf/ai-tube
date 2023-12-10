"use server"

import { ChannelInfo, VideoGenerationModel, VideoInfo } from "@/types"

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
}): Promise<VideoInfo> {
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
    tags
  })


  return videoInfo
}