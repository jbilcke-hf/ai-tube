"use server"

import { MediaInfo } from "@/types/general"

import { getStatsForMedias } from "../stats"

export async function extendVideosWithStats(videos: MediaInfo[]): Promise<MediaInfo[]> {
  
  const allStats = await getStatsForMedias(videos.map(v => v.id))

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