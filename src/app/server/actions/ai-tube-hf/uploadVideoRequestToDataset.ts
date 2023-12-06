"use server"

import { Blob } from "buffer"

import { Credentials, uploadFile, whoAmI } from "@/huggingface/hub/src"
import { ChannelInfo, VideoInfo, VideoRequest } from "@/types"
import { formatPromptFileName } from "../utils/formatPromptFileName"

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
  tags,
}: {
  channel: ChannelInfo
  apiKey: string
  title: string
  description: string
  prompt: string
  tags: string[]
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
    thumbnailUrl: channel.thumbnail,
    updatedAt: new Date().toISOString(),
    tags,
    channel,
  }

  const newVideo: VideoInfo = {
    id,
    status: "submitted",
    label: title,
    description,
    prompt,
    thumbnailUrl: channel.thumbnail, // will be generated in async
    assetUrl: "", // will be generated in async
    numberOfViews: 0,
    numberOfLikes: 0,
    updatedAt: new Date().toISOString(),
    tags,
    channel,
  }

  return {
    videoRequest: newVideoRequest,
    videoInfo: newVideo
  }
}
