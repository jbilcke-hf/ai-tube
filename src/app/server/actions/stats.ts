"use server"

import { Redis } from "@upstash/redis"

import { redisToken, redisUrl } from "./config"
import { developerMode } from "@/app/config"

const redis = new Redis({
  url: redisUrl,
  token: redisToken
})

export async function getNumberOfViewsForVideos(videoIds: string[]): Promise<Record<string, number>> {
  if (!Array.isArray(videoIds)) {
    return {}
  }

  try {
    
    const stats: Record<string, number> = {}

    const ids: string[] = []

    for (const videoId of videoIds) {
      ids.push(`videos:${videoId}:stats:views`)
      stats[videoId] = 0
    }


    const values = await redis.mget<number[]>(...ids)

    values.forEach((nbViews, i) => {
      const videoId = ids[i]
      stats[videoId] = nbViews || 0
    })

    return stats
  } catch (err) {
    return {}
  }
}

export async function getNumberOfViewsForVideo(videoId: string): Promise<number> {
  try {
    const key = `videos:${videoId}:stats`

    const result = await redis.get<number>(key) || 0

    return result
  } catch (err) {
    return 0
  }
}


export async function watchVideo(videoId: string): Promise<number> {
  if (developerMode) {
    return getNumberOfViewsForVideo(videoId)
  }

  try {
    const result = await redis.incr(`videos:${videoId}:stats:views`)
    
    return result
  } catch (err) {
    return 0
  }
}
