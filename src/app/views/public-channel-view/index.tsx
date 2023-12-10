"use client"

import { useEffect, useTransition } from "react"

import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils"
import { VideoList } from "@/app/interface/video-list"
import { getChannelVideos } from "@/app/server/actions/ai-tube-hf/getChannelVideos"


export function PublicChannelView() {
  const [_isPending, startTransition] = useTransition()
  const publicChannel = useStore(s => s.publicChannel)
  const publicVideos = useStore(s => s.publicVideos)
  const setPublicVideos = useStore(s => s.setPublicVideos)

  useEffect(() => {
    if (!publicChannel) {
      return
    }

    startTransition(async () => {
      const videos = await getChannelVideos({
        channel: publicChannel,
        status: "published",
      })
      setPublicVideos(videos)
    })

    setPublicVideos([])
  }, [publicChannel, publicChannel?.id])

  return (
    <div className={cn(
      `flex flex-col`
    )}>
      <VideoList
        videos={publicVideos}
      />
    </div>
  )
}