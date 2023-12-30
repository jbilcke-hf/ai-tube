
import { useEffect, useTransition } from "react"

import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils"
import { VideoInfo } from "@/types/general"

import { VideoList } from "../video-list"
import { getVideos } from "@/app/server/actions/ai-tube-hf/getVideos"

export function RecommendedVideos({
  video,
}: {
  // the video to use for the recommendations
  video: VideoInfo
}) {
  const [_isPending, startTransition] = useTransition()
  const setRecommendedVideos = useStore(s => s.setRecommendedVideos)
  const recommendedVideos = useStore(s => s.recommendedVideos)

  useEffect(() => {
    startTransition(async () => {
      setRecommendedVideos(await getVideos({
        sortBy: "random",
        niceToHaveTags: video.tags,
        ignoreVideoIds: [video.id],
        maxVideos: 16,
      }))
    })
  }, video.tags)

  return (
    <VideoList
      items={recommendedVideos}
      layout="vertical"
    />
  )
}