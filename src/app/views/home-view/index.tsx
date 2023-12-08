"use client"

import { useEffect, useTransition } from "react"

import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils"
import { VideoInfo } from "@/types"
import { getVideos } from "@/app/server/actions/ai-tube-hf/getVideos"
import { VideoList } from "@/app/interface/video-list"
import { getTags } from "@/app/server/actions/ai-tube-hf/getTags"

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
        tag: currentTag,
        maxVideos: 25
      })

      setPublicVideos(videos)
    })
  }, [currentTag])

  const handleSelect = (video: VideoInfo) => {
    setView("public_video")
    setPublicVideo(video)
  }

  return (
    <div className={cn(
     `pr-4`
    )}>
      <VideoList
        videos={publicVideos}
        layout="grid"
        onSelect={handleSelect}
      />
    </div>
  )
}