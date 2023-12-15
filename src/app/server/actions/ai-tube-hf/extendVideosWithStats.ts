"use server"

import { VideoInfo } from "@/types"
import { getNumberOfViewsForVideos } from "../stats"

export async function extendVideosWithStats(videos: VideoInfo[]): Promise<VideoInfo[]> {
  
  const stats = await getNumberOfViewsForVideos(videos.map(v => v.id))

  return videos.map(v => {
    v.numberOfViews = stats[v.id] || 0
    return v
  })
}