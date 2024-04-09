
import { useEffect, useTransition } from "react"

import { useStore } from "@/app/state/useStore"
import { MediaInfo } from "@/types/general"

import { VideoList } from "../video-list"
import { getVideos } from "@/app/server/actions/ai-tube-hf/getVideos"

export function RecommendedVideos({
  media,
}: {
  // the media to use for the recommendations
  media: MediaInfo
}) {
  const [_isPending, startTransition] = useTransition()
  const setRecommendedVideos = useStore(s => s.setRecommendedVideos)
  const recommendedVideos = useStore(s => s.recommendedVideos)

  useEffect(() => {
    startTransition(async () => {
      setRecommendedVideos(await getVideos({
        sortBy: "random",
        niceToHaveTags: media.tags,
        ignoreVideoIds: [media.id],
        maxVideos: 16,
      }))
    })
  }, media.tags)

  return (
    <VideoList
      items={recommendedVideos}
      layout="vertical"
    />
  )
}