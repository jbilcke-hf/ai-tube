"use server"

import { VideoInfo } from "@/types"

import { getStatsForVideos } from "../stats"

export async function extendVideosWithStats(videos: VideoInfo[]): Promise<VideoInfo[]> {
  
  const allStats = await getStatsForVideos(videos.map(v => v.id))

  return videos.map(v => {
    const stats = allStats[v.id] || {
      numberOfViews: 0,
      numberOfLikes: 0,
      numberOfDislikes: 0
    }

    v.numberOfViews = stats.numberOfViews
    v.numberOfLikes = stats.numberOfLikes
    v.numberOfDislikes = stats.numberOfDislikes

    return v
  })
}