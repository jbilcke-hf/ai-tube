"use server"

import { developerMode } from "@/app/config"
import { WhoAmIUser, whoAmI } from "@/lib/huggingface/hub/src"
import { MediaRating } from "@/types/general"
import { redis } from "./redis";

export async function getStatsForMedias(mediaIds: string[]): Promise<Record<string, { numberOfViews: number; numberOfLikes: number; numberOfDislikes: number}>> {
  if (!Array.isArray(mediaIds)) {
    return {}
  }

  try {
    
    const stats: Record<string, { numberOfViews: number; numberOfLikes: number; numberOfDislikes: number; }> = {}

    const listOfRedisIDs: string[] = []

    for (const mediaId of mediaIds) {
      listOfRedisIDs.push(`videos:${mediaId}:stats:views`)
      listOfRedisIDs.push(`videos:${mediaId}:stats:likes`)
      listOfRedisIDs.push(`videos:${mediaId}:stats:dislikes`)
      stats[mediaId] = {
        numberOfViews: 0,
        numberOfLikes: 0,
        numberOfDislikes: 0,
      }
    }

    const listOfRedisValues = await redis.mget<number[]>(...listOfRedisIDs)

    let v = 0
    for (let i = 0; i < listOfRedisValues.length; i += 3) {
      stats[mediaIds[v++]] = {
        numberOfViews: listOfRedisValues[i] || 0,
        numberOfLikes: listOfRedisValues[i + 1] || 0,
        numberOfDislikes: listOfRedisValues[i + 2] || 0
      }
    }

    return stats
  } catch (err) {
    return {}
  }
}

export async function countNewMediaView(mediaId: string): Promise<number> {
  if (developerMode) {
    const stats = await getStatsForMedias([mediaId])

    return stats[mediaId].numberOfViews
  }

  try {
    const result = await redis.incr(`videos:${mediaId}:stats:views`)
    
    return result
  } catch (err) {
    return 0
  }
}

export async function getMediaRating(mediaId: string, apiKey?: string): Promise<MediaRating> {
  let numberOfLikes = 0
  let numberOfDislikes = 0
  let isLikedByUser = false
  let isDislikedByUser = false

  try {
    // update video likes counter
    numberOfLikes = (await redis.get<number>(`videos:${mediaId}:stats:likes`)) || 0
    numberOfDislikes = (await redis.get<number>(`videos:${mediaId}:stats:dislikes`)) || 0
  } catch (err) {
  }

  // optional: determine if the user liked or disliked the content
  if (apiKey) {
    try {
      const credentials = { accessToken: apiKey }
      
      const user = await whoAmI({ credentials }) as unknown as WhoAmIUser
      const isLiked = await redis.get<boolean>(`users:${user.id}:activity:videos:${mediaId}:liked`)
      if (isLiked !== null) {
        isLikedByUser = !!isLiked
        isDislikedByUser = !isLiked
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

export async function rateMedia(mediaId: string, liked: boolean, apiKey: string): Promise<MediaRating> {
  // note: we want the like to throw an exception if it failed
  let numberOfLikes = 0
  let numberOfDislikes = 0
  let isLikedByUser = false
  let isDislikedByUser = false

  const credentials = { accessToken: apiKey }
  
  const user = await whoAmI({ credentials }) as unknown as WhoAmIUser

  const hasLiked = await redis.get<boolean>(`users:${user.id}:activity:videos:${mediaId}:liked`)
  
  const hasAlreadyRatedTheSame =  hasLiked !== null && liked === hasLiked

  if (hasAlreadyRatedTheSame) {
    return {
      numberOfLikes: await redis.get(`videos:${mediaId}:stats:likes`) || 0,
      numberOfDislikes: await redis.get(`videos:${mediaId}:stats:dislikes`) || 0,
      isLikedByUser: liked,
      isDislikedByUser: !liked
    }
  }
  const hasAlreadyRatedAndDifferently = hasLiked !== null && liked !== hasLiked

  await redis.set(`users:${user.id}:activity:videos:${mediaId}:liked`, liked)

  isLikedByUser = liked
  isDislikedByUser = !liked

  // if user has already rated the content, and it's different from the desired value,
  // then we need to undo the rating

  try {
    if (liked) {
      // update video likes counter
      numberOfLikes = await redis.incr(`videos:${mediaId}:stats:likes`)
      if (hasAlreadyRatedAndDifferently) {
        numberOfDislikes = await redis.decr(`videos:${mediaId}:stats:dislikes`)
      }
    } else {
      numberOfDislikes = await redis.incr(`videos:${mediaId}:stats:dislikes`)
      if (hasAlreadyRatedAndDifferently) {
        numberOfLikes = await redis.decr(`videos:${mediaId}:stats:likes`)
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
