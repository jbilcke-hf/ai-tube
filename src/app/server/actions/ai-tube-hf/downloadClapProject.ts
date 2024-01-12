import { v4 as uuidv4 } from "uuid"
import { Credentials } from "@/huggingface/hub/src"

import { ClapProject } from "@/clap/types"
import { ChannelInfo, VideoInfo, VideoRequest } from "@/types/general"
import { defaultVideoModel } from "@/app/config"
import { parseClap } from "@/clap/parseClap"

import { parseVideoModelName } from "../utils/parseVideoModelName"
import { computeOrientationProjectionWidthHeight } from "../utils/computeOrientationProjectionWidthHeight"

import { downloadFileAsBlob } from "./downloadFileAsBlob"

export async function downloadClapProject({
  path,
  channel,
  credentials,
}: {
  path: string
  channel: ChannelInfo
  credentials: Credentials
}): Promise<{
  videoRequest: VideoRequest
  videoInfo: VideoInfo
  clapProject: ClapProject
}> {
  // we recover the repo from the cnannel info
  const repo = `datasets/${channel.datasetUser}/${channel.datasetName}`

  // we download the clap file (which might be in a private repo)
  const clapString = await downloadFileAsBlob({
    repo,
    path,
    apiKey: credentials.accessToken,
    expectedMimeType: "application/gzip"
  })

  const clapProject = await parseClap(clapString)

  const id = clapProject.meta.id || uuidv4()
  
  const videoRequest: VideoRequest = {
    id,
    label: clapProject.meta.title || "Untitled",
    description: clapProject.meta.description || "",
    prompt: "", // there is no prompt - instead we use segments
    model: parseVideoModelName(clapProject.meta.defaultVideoModel, channel.model),
    style: channel.style,
    lora: channel.lora,
    voice: channel.voice,
    music: channel.music,
    thumbnailUrl: "",
    clapUrl: `https://huggingface.co/${repo}/resolve/main/${path}`,
    updatedAt: new Date().toISOString(),
    tags: channel.tags,
    channel,
    duration: 0, // will be computed automatically
    ...computeOrientationProjectionWidthHeight({
      lora: "",
      orientation: clapProject.meta.orientation,
      // projection, // <- will be extrapolated from the LoRA for now
    }),
  }

  const videoInfo: VideoInfo = {
    id,
    status: "submitted",
    label: videoRequest.label || "",
    description: videoRequest.description || "",
    prompt: videoRequest.prompt || "",
    model: videoRequest.model || defaultVideoModel,
    style: videoRequest.style || "",
    lora: videoRequest.lora || "",
    voice: videoRequest.voice || "",
    music: videoRequest.music || "",
    thumbnailUrl: videoRequest.thumbnailUrl || "", // will be generated in async
    clapUrl: videoRequest.clapUrl || "",
    assetUrl: "", // will be generated in async
    assetUrlHd: "",
    numberOfViews: 0,
    numberOfLikes: 0,
    numberOfDislikes: 0,
    updatedAt: new Date().toISOString(),
    tags: videoRequest.tags,
    channel,
    duration: videoRequest.duration || 0,
    ...computeOrientationProjectionWidthHeight({
      lora: videoRequest.lora,
      orientation: videoRequest.orientation,
      // projection, // <- will be extrapolated from the LoRA for now
    }),
  }

  return {
    videoRequest,
    videoInfo,
    clapProject
  }
}