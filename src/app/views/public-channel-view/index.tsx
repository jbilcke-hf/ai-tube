"use client"

import { useEffect, useState, useTransition } from "react"

import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils"
import { VideoList } from "@/app/interface/video-list"
import { getChannelVideos } from "@/app/server/actions/ai-tube-hf/getChannelVideos"
import { DefaultAvatar } from "@/app/interface/default-avatar"

export function PublicChannelView() {
  const [_isPending, startTransition] = useTransition()
  const publicChannel = useStore(s => s.publicChannel)
  const publicVideos = useStore(s => s.publicVideos)
  const setPublicVideos = useStore(s => s.setPublicVideos)

  const [channelThumbnail, setChannelThumbnail] = useState(publicChannel?.thumbnail || "")

  const handleBadChannelThumbnail = () => {
    try {
      if (channelThumbnail) {
        setChannelThumbnail("")
      }
    } catch (err) {
      
    }
  }

  useEffect(() => {
    setChannelThumbnail(publicChannel?.thumbnail || "")

    if (!publicChannel) {
      return
    }

    startTransition(async () => {
      const videos = await getChannelVideos({
        channel: publicChannel,
        status: "published",
      })
      console.log("videos:", videos)
      setPublicVideos(videos)
    })

    setPublicVideos([])
  }, [publicChannel, publicChannel?.id])

  if (!publicChannel) { return null }

  return (
    <div className={cn(
      `flex flex-col`
    )}>
      {/* BANNER */}
      <div className={cn(
        `flex flex-col items-center justify-center w-full h-44`
      )}>
        {channelThumbnail
        ? <img
            src={channelThumbnail}
            onError={handleBadChannelThumbnail}
            className="w-full h-full overflow-hidden object-cover"
          />
        : <DefaultAvatar
            username={publicChannel.datasetUser}
            bgColor="#fde047"
            textColor="#1c1917"
            width={160}
            roundShape
          />}
      </div>

      {/* CHANNEL INFO - HORIZONTAL */}
      <div className={cn(
        `flex flex-row`
      )}>

        {/* AVATAR */}
        <div className={cn(
          `flex flex-col items-center justify-center w-full`
        )}>
          {channelThumbnail
            ? <img
                src={channelThumbnail}
                onError={handleBadChannelThumbnail}
                className="w-40 h-40 overflow-hidden"
              />
            : <DefaultAvatar
                username={publicChannel.datasetUser}
                bgColor="#fde047"
                textColor="#1c1917"
                width={160}
                roundShape
              />}
        </div>

        <div className={cn(
          `flex flex-col items-center justify-center w-full`
        )}>
          <h3 className="tex-xl text-zinc-100">{publicChannel.label}</h3>
        </div>
      </div>

      <VideoList
        videos={publicVideos}
      />
    </div>
  )
}