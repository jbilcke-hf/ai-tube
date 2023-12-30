import { useEffect, useState, useTransition } from "react"
import { VideoInfo, VideoRating } from "@/types/general"

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
    // we use optimistic updates
    const previousRating = { ...rating }
    setRating({
      ...rating,
      isLikedByUser: true,
      isDislikedByUser: false,
      numberOfLikes:  Math.abs(Math.max(0, rating.numberOfLikes + 1)),
      numberOfDislikes:  Math.abs(Math.max(0, rating.numberOfDislikes - 1)),
    })
    startTransition(async () => {
      try {
        const freshRating = await rateVideo(video.id, true, huggingfaceApiKey)
        // setRating(freshRating)
      } catch (err) {
        setRating(previousRating)
      }
    })
  } : undefined

  const handleDislike = huggingfaceApiKey ? () => {
    // we use optimistic updates
    const previousRating = { ...rating }
    setRating({
      ...rating,
      isLikedByUser: false,
      isDislikedByUser: true,
      numberOfLikes: Math.abs(Math.max(0, rating.numberOfLikes - 1)),
      numberOfDislikes: Math.abs(Math.max(0, rating.numberOfDislikes + 1)),
    })
    startTransition(async () => {
      try {
        const freshRating = await rateVideo(video.id, false, huggingfaceApiKey)
        // setRating(freshRating)
      } catch (err) {
        setRating(previousRating)
      }
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