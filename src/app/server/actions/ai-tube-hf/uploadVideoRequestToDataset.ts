"use server"

import { Blob } from "buffer"

import { Credentials, uploadFile, whoAmI } from "@/huggingface/hub/src"
import { ChannelInfo, VideoGenerationModel, VideoInfo, VideoOrientation, VideoRequest } from "@/types/general"
import { formatPromptFileName } from "../utils/formatPromptFileName"
import { computeOrientationProjectionWidthHeight } from "../utils/computeOrientationProjectionWidthHeight"

/**
 * Save the video request to the user's own dataset
 *
 */
export async function uploadVideoRequestToDataset({
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
  orientation: VideoOrientation
}): Promise<{
  videoRequest: VideoRequest
  videoInfo: VideoInfo
}> {
  if (!apiKey) {
    throw new Error(`the apiKey is required`)
  }

  let credentials: Credentials = { accessToken: apiKey }

  const { name: username } = await whoAmI({ credentials })
  if (!username) {
    throw new Error(`couldn't get the username`)
  }

  const { id, fileName } = formatPromptFileName()

  // Convert string to a Buffer
  const blob = new Blob([`
# Title

${title}

# Description

${description}

# Model

${model}

# LoRA

${lora}

# Style

${style}

# Voice

${voice}

# Music

${music}

# Duration

${duration}

# Orientation

${orientation}

# Tags

${tags.map(tag => `- ${tag}`).join("\n")}

# Prompt
${prompt}
`]);


  await uploadFile({
	  credentials,
    repo: `datasets/${channel.datasetUser}/${channel.datasetName}`,
    file: {
      path: fileName,
      content: blob as any,
    },
    commitTitle: "Add new video prompt",
  })

  // TODO: now we ping the robot to come read our prompt

  const newVideoRequest: VideoRequest = {
    id,
    label: title,
    description,
    prompt,
    model,
    style,
    lora,
    voice,
    music,
    thumbnailUrl: channel.thumbnail,

    // for now AI Tube doesn't support upload of clap files
    clapUrl: "",

    updatedAt: new Date().toISOString(),
    tags,
    channel,
    duration: 0,
    ...computeOrientationProjectionWidthHeight({
      lora,
      orientation,
      // projection, // <- will be extrapolated from the LoRA for now
    }),
  }

  const newVideo: VideoInfo = {
    id,
    status: "submitted",
    label: title,
    description,
    prompt,
    model,
    style,
    lora,
    voice,
    music,
    thumbnailUrl: channel.thumbnail, // will be generated in async

    // for now AI Tube doesn't support upload of clap files
    clapUrl: "",
    
    assetUrl: "", // will be generated in async
    assetUrlHd: "",
    numberOfViews: 0,
    numberOfLikes: 0,
    numberOfDislikes: 0,
    updatedAt: new Date().toISOString(),
    tags,
    channel,
    duration,
    ...computeOrientationProjectionWidthHeight({
      lora,
      orientation,
      // projection, // <- will be extrapolated from the LoRA for now
    }),
  }

  return {
    videoRequest: newVideoRequest,
    videoInfo: newVideo
  }
}
