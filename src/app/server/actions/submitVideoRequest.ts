"use server"

import { ChannelInfo, VideoInfo } from "@/types"

import { uploadVideoRequestToDataset } from "./ai-tube-hf/uploadVideoRequestToDataset"
import { updateQueue } from "./ai-tube-robot/updateQueue"

export async function submitVideoRequest({
  channel,
  apiKey,
  title,
  description,
  prompt,
  tags,
}: {
  channel: ChannelInfo
  apiKey: string
  title: string
  description: string
  prompt: string
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
    tags
  })

  try {
    await updateQueue({ apiKey, channel })
    
    return {
      ...videoInfo,
      status: "queued"
    }
  } catch (err) {
    console.error(`failed to update the queue, but this can be done later :)`)
    return videoInfo
  }
}