"use client"

import { useEffect, useTransition } from "react"

import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils"
import { MediaInfo } from "@/types/general"
import { getVideos } from "@/app/server/actions/ai-tube-hf/getVideos"
import { VideoList } from "@/app/interface/video-list"
import { getTags } from "@/app/server/actions/ai-tube-hf/getTags"
import { extendVideosWithStats } from "@/app/server/actions/ai-tube-hf/extendVideosWithStats"

export function HomeView() {
  const [_isPending, startTransition] = useTransition()
  const setView = useStore(s => s.setView)
  const currentTag = useStore(s => s.currentTag)
  const setPublicVideos = useStore(s => s.setPublicVideos)
  const setPublicVideo = useStore(s => s.setPublicVideo)
  const publicVideos = useStore(s => s.publicVideos)

  useEffect(() => {
    startTransition(async () => {
      const videos = await getVideos({
        sortBy: "date",
        mandatoryTags: currentTag ? [currentTag] : [],
        maxVideos: 25
      })

      // due to some caching on the first function.. we update with fresh data!
      // const updatedVideos = await extendVideosWithStats(videos)

      setPublicVideos(videos)
    })
  }, [currentTag])

  const handleSelect = (video: MediaInfo) => {
    setView("public_video")
    setPublicVideo(video)
  }

  return (
    <div className={cn(
     `sm:pr-4`
    )}>
      <VideoList
        items={publicVideos}
        onSelect={handleSelect}
      />
    </div>
  )
}