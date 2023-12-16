"use client"

import { useEffect, useTransition } from "react"

import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils"
import { VideoInfo } from "@/types"
import { getVideos } from "@/app/server/actions/ai-tube-hf/getVideos"
import { VideoList } from "@/app/interface/video-list"

export function PublicMusicVideosView() {
  const [_isPending, startTransition] = useTransition()
  const setView = useStore(s => s.setView)
  const setPublicVideos = useStore(s => s.setPublicVideos)
  const setPublicVideo = useStore(s => s.setPublicVideo)
  const publicVideos = useStore(s => s.publicVideos)

  useEffect(() => {
    startTransition(async () => {
      const videos = await getVideos({
        sortBy: "date",
        mandatoryTags:["music"],
        maxVideos: 25
      })

      setPublicVideos(videos)
    })
  }, [])

  const handleSelect = (video: VideoInfo) => {
    //
    // setView("public_video")
    // setPublicVideo(video)
    console.log("play the track in the background, but don't reload everything")
  }

  return (
    <div className={cn(
     `sm:pr-4`
    )}>
      <VideoList
        videos={publicVideos}
        onSelect={handleSelect}
      />
    </div>
  )
}