"use server"

import { MediaInfo } from "@/types/general"

import { getVideoIndex } from "./getVideoIndex"
import { getStatsForMedias } from "../stats"

export async function getVideo({
  videoId,
  neverThrow,
}: {
  videoId?: string | string[] | null,
  neverThrow?: boolean
}): Promise<MediaInfo | undefined> {
  try {
    const id = `${videoId || ""}`

    if (!id) {
      throw new Error(`cannot get the video, invalid id: "${id}"`)
    }
    const published = await getVideoIndex({ status: "published" })

    const video = published[id] || undefined

    if (!video) {
      throw new Error(`cannot get the video, nothing found for id "${id}"`)
    }

    const allStats = await getStatsForMedias([video.id])
    
    const stats = allStats[video.id] || {
      numberOfViews: 0,
      numberOfLikes: 0,
      numberOfDislikes: 0,
    }

    video.numberOfViews = stats.numberOfViews
    video.numberOfLikes = stats.numberOfLikes
    video.numberOfDislikes = stats.numberOfDislikes

    return video
  } catch (err) {
    if (neverThrow) {
      return undefined
    }
    throw err
  }
}