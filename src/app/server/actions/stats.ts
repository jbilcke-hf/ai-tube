"use server"

import { Redis } from "@upstash/redis"

import { developerMode } from "@/app/config"
import { WhoAmIUser, whoAmI } from "@/huggingface/hub/src"

import { redisToken, redisUrl } from "./config"
import { VideoRating } from "@/types"

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
      const redisId = `${ids[i] || ""}`
      const videoId = redisId.replace(":stats:views", "").replace("videos:", "")
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

export async function getVideoRating(videoId: string, apiKey?: string): Promise<VideoRating> {
  let numberOfLikes = 0
  let numberOfDislikes = 0
  let isLikedByUser = false
  let isDislikedByUser = false

  try {
    // update video likes counter
    numberOfLikes = (await redis.get<number>(`videos:${videoId}:stats:likes`)) || 0
    numberOfDislikes = (await redis.get<number>(`videos:${videoId}:stats:dislikes`)) || 0
  } catch (err) {
  }

  // optional: determine if the user liked or disliked the content
  if (apiKey) {
    try {
      const credentials = { accessToken: apiKey }
      
      const user = await whoAmI({ credentials }) as unknown as WhoAmIUser
      const isLiked = await redis.get(`users:${user.id}:tastes:videos:${videoId}`)
      if (isLiked !== null) {
        isLikedByUser = Boolean(isLiked)
        isDislikedByUser = !isLikedByUser
      }
    } catch (err) {
      console.error("failed to get user like status")
    }
  }

  return {
    isLikedByUser,
    isDislikedByUser,
    numberOfLikes,
    numberOfDislikes,
  }
}

export async function rateVideo(videoId: string, liked: boolean, apiKey: string): Promise<VideoRating> {
  // note: we want the like to throw an exception if it failed
  let numberOfLikes = 0
  let numberOfDislikes = 0
  let isLikedByUser = false
  let isDislikedByUser = false

  const credentials = { accessToken: apiKey }
  
  const user = await whoAmI({ credentials }) as unknown as WhoAmIUser

  const hasLiked = await redis.get<boolean>(`users:${user.id}:activity:videos:${videoId}:liked`)
  const hasAlreadyRatedAndDifferently = hasLiked !== null && liked !== hasLiked

  await redis.set(`users:${user.id}:activity:videos:${videoId}:liked`, liked)

  isLikedByUser = liked
  isDislikedByUser = !liked

  // if user has already rated the content, and it's different from the desired value,
  // then we need to undo the rating

  try {
    if (liked) {
      // update video likes counter
      numberOfLikes = await redis.incr(`videos:${videoId}:stats:likes`)
      if (hasAlreadyRatedAndDifferently) {
        numberOfDislikes = await redis.decr(`videos:${videoId}:stats:dislikes`)
      }
    } else {
      numberOfDislikes = await redis.incr(`videos:${videoId}:stats:dislikes`)
      if (hasAlreadyRatedAndDifferently) {
        numberOfLikes = await redis.decr(`videos:${videoId}:stats:likes`)
      }
    }
  } catch (err) {
  } finally {
    return {
      numberOfLikes,
      numberOfDislikes,
      isLikedByUser,
      isDislikedByUser,
    }
  }
}
