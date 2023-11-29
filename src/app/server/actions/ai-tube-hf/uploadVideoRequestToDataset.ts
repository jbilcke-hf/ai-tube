"use server"

import { Blob } from "buffer"
import { v4 as uuidv4 } from "uuid"

import { Credentials, uploadFile, whoAmI } from "@/huggingface/hub/src"
import { ChannelInfo, VideoInfo, VideoRequest } from "@/types"

/**
 * Save the video request to the user's own dataset
 * 
 * @param param0
 * @returns 
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

  const date = new Date()
  const dateSlug = date.toISOString().replace(/[^0-9]/gi, '').slice(0, 12);

  // there is a bug in the [^] maybe, because all characters are removed
  // const nameSlug = title.replaceAll(/\S+/gi, "-").replaceAll(/[^A-Za-z0-9\-_]/gi, "")
  // const fileName = `prompt-${dateSlug}-${nameSlug}.txt`

  const videoId = uuidv4()

  const fileName = `prompt_${dateSlug}_${videoId}.txt`

  // Convert string to a Buffer
  const blob = new Blob([`
# Title
${title}

# Description
${description}

# Tags

${tags.map(tag => `- ${tag}\n`)}

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
    id: videoId,
    label: title,
    description,
    prompt,
    thumbnailUrl: "",
    updatedAt: new Date().toISOString(),
    tags: [...channel.tags],
    channel,
  }

  const newVideo: VideoInfo = {
    id: videoId,
    status: "submitted",
    label: title,
    description,
    prompt,
    thumbnailUrl: "", // will be generated in async
    assetUrl: "", // will be generated in async
    numberOfViews: 0,
    numberOfLikes: 0,
    updatedAt: new Date().toISOString(),
    tags: [...channel.tags],
    channel,
  }

  return {
    videoRequest: newVideoRequest,
    videoInfo: newVideo
  }
}
