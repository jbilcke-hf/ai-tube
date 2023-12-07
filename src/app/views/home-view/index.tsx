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
  const displayMode = useStore(s => s.displayMode)
  const setDisplayMode = useStore(s => s.setDisplayMode)
  const currentChannel = useStore(s => s.currentChannel)
  const setCurrentChannel = useStore(s => s.setCurrentChannel)
  const currentTag = useStore(s => s.currentTag)
  const setCurrentTag = useStore(s => s.setCurrentTag)
  const setCurrentTags = useStore(s => s.setCurrentTags)
  const currentVideos = useStore(s => s.currentVideos)
  const setCurrentVideos = useStore(s => s.setCurrentVideos)
  const currentVideo = useStore(s => s.currentVideo)
  const setCurrentVideo = useStore(s => s.setCurrentVideo)

  useEffect(() => {
    startTransition(async () => {
      const videos = await getVideos({
        sortBy: "date",
        tag: currentTag,
        maxVideos: 25
      })

      setCurrentVideos(videos)
    })
  }, [currentTag])

  const handleSelect = (video: VideoInfo) => {
    setCurrentVideo(video)
    setView("public_video")
  }

  return (
    <div className={cn(
     //  `grid grid-cols-4`
    )}>
      <VideoList
        videos={currentVideos}
        layout="grid"
        onSelect={handleSelect}
      />
    </div>
  )
}