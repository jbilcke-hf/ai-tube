import { useEffect, useState, useTransition } from "react"
import { VideoInfo, VideoRating } from "@/types"

import { GenericLikeButton } from "./generic"
import { getVideoRating, rateVideo } from "@/app/server/actions/stats"
import { useLocalStorage } from "usehooks-ts"
import { localStorageKeys } from "@/app/state/localStorageKeys"
import { defaultSettings } from "@/app/state/defaultSettings"

export function LikeButton({
  video
}: {
  video?: VideoInfo
}) {
  const [_pending, startTransition] = useTransition()

  const [rating, setRating] = useState<VideoRating>({
    isLikedByUser: false,
    isDislikedByUser: false,
    numberOfLikes: 0,
    numberOfDislikes: 0,
  })

  const [huggingfaceApiKey] = useLocalStorage<string>(
    localStorageKeys.huggingfaceApiKey,
    defaultSettings.huggingfaceApiKey
  )

  useEffect(() => {
    startTransition(async () => {
      if (!video || !video?.id) { return }

      const freshRating = await getVideoRating(video.id, huggingfaceApiKey)
      setRating(freshRating)

    })
  }, [video?.id, huggingfaceApiKey])

  if (!video) { return null }
  
  if (!huggingfaceApiKey) { return null }

  const handleLike = huggingfaceApiKey ? () => {
    // we use premeptive update
    setRating({
      ...rating,
      isLikedByUser: true,
      isDislikedByUser: false,
      numberOfLikes: rating.numberOfLikes + 1,
      numberOfDislikes: rating.numberOfDislikes - 1,
    })
    startTransition(async () => {
      const freshRating = await rateVideo(video.id, true, huggingfaceApiKey)
      setRating(freshRating)
    })
  } : undefined

  const handleDislike = huggingfaceApiKey ? () => {
    setRating({
      ...rating,
      isLikedByUser: false,
      isDislikedByUser: true,
      numberOfLikes: rating.numberOfLikes - 1,
      numberOfDislikes: rating.numberOfDislikes + 1,
    })
    startTransition(async () => {
      const freshRating = await rateVideo(video.id, false, huggingfaceApiKey)
      setRating(freshRating)
    })
  } : undefined

  return (
    <GenericLikeButton
      {...rating}
      onLike={handleLike}
      onDislike={handleDislike}
    />
  )
}