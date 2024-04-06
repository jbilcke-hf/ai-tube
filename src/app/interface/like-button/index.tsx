import { useEffect, useState, useTransition } from "react"
import { useLocalStorage } from "usehooks-ts"

import { MediaInfo, MediaRating } from "@/types/general"
import { getMediaRating, rateMedia } from "@/app/server/actions/stats"
import { localStorageKeys } from "@/app/state/localStorageKeys"
import { defaultSettings } from "@/app/state/defaultSettings"

import { GenericLikeButton } from "./generic"
export function LikeButton({
  media
}: {
  media?: MediaInfo
}) {
  const [_pending, startTransition] = useTransition()

  const [rating, setRating] = useState<MediaRating>({
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
      if (!media || !media?.id) { return }

      const freshRating = await getMediaRating(media.id, huggingfaceApiKey)
      setRating(freshRating)

    })
  }, [media?.id, huggingfaceApiKey])

  if (!media) { return null }
  
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
        const freshRating = await rateMedia(media.id, true, huggingfaceApiKey)
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
        const freshRating = await rateMedia(media.id, false, huggingfaceApiKey)
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