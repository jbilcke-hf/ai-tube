"use server"

import { ChannelInfo, MediaInfo, VideoStatus } from "@/types/general"

import { getVideoRequestsFromChannel  } from "./getVideoRequestsFromChannel"
import { adminApiKey } from "../config"
import { getVideoIndex } from "./getVideoIndex"
import { extendVideosWithStats } from "./extendVideosWithStats"
import { computeOrientationProjectionWidthHeight } from "../../utils/computeOrientationProjectionWidthHeight"
import { defaultVideoModel } from "@/app/config"

// return 
export async function getChannelVideos({
  channel,
  status,
  neverThrow,
}: {
  channel?: ChannelInfo

  // filter videos by status
  status?: VideoStatus

  neverThrow?: boolean
}): Promise<MediaInfo[]> {

  if (!channel) { return [] }

  try {
    const videos = await getVideoRequestsFromChannel({
      channel,
      apiKey: adminApiKey,
      renewCache: true
    })

    // TODO: use a database instead
    // normally 
    const queued = await getVideoIndex({ status: "queued" })
    const published = await getVideoIndex({ status: "published" })

    const validVideos = videos.map(v => {
    let video: MediaInfo = {
        id: v.id,
        status: "submitted",
        label: v.label || "",
        description: v.description || "",
        prompt: v.prompt || "",
        thumbnailUrl: v.thumbnailUrl || "",
        clapUrl: v.clapUrl || "",
        model: v.model || defaultVideoModel,
        lora: v.lora || "",
        style: v.style || "",
        voice: v.voice || "",
        music: v.music || "",
        assetUrl: "",
        assetUrlHd: "",
        numberOfViews: 0,
        numberOfLikes: 0,
        numberOfDislikes: 0,
        updatedAt: v.updatedAt,
        tags: v.tags,
        channel,
        duration: v.duration || 0,
        ...computeOrientationProjectionWidthHeight({
          lora: v.lora,
          orientation: v.orientation,
          // projection, // <- will be extrapolated from the LoRA for now
        }),
      }

      if (queued[v.id]) {
        video = queued[v.id]
      } else if (published[v.id]) {
        video = published[v.id]
      }

      return video
    }).filter(video => {
      // if no filter is requested, we always return the video
      if (!status || typeof status === "undefined") {
        return true
      }

      return video.status === status
    })

    // ask Redis for the freshest stats
    const results = await extendVideosWithStats(validVideos)

    return results
  } catch (err) {
    if (neverThrow) {
      console.error("failed to get channel videos:", err)
      return []
    }

    throw err
  }
}