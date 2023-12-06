"use client"

import { useEffect, useTransition } from "react"

import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils"
import { VideoList } from "@/app/interface/video-list"


export function PublicChannelView() {
  const [_isPending, startTransition] = useTransition()
  const currentChannel = useStore(s => s.currentChannel)
  const currentVideos = useStore(s => s.currentVideos)
  const setCurrentVideos = useStore(s => s.setCurrentVideos)
  const setCurrentVideo = useStore(s => s.setCurrentVideo)

  useEffect(() => {
    if (!currentChannel) {
      return
    }

    startTransition(async () => {
      /*
      const videos = await getChannelVideos({
        channel: currentChannel,
      })
      console.log("videos:", videos)
      */
    })

    setCurrentVideos([])
  }, [currentChannel, currentChannel?.id])

  return (
    <div className={cn(
      `flex flex-col`
    )}>
      <VideoList
        videos={currentVideos}
      />
    </div>
  )
}