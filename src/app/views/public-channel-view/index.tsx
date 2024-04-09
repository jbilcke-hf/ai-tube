"use client"

import { useEffect, useState, useTransition } from "react"

import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils/cn"
import { VideoList } from "@/components/interface/video-list"
import { DefaultAvatar } from "@/components/interface/default-avatar"

export function PublicChannelView() {
  const [_isPending, startTransition] = useTransition()
  const publicChannel = useStore(s => s.publicChannel)
  const publicChannelVideos = useStore(s => s.publicChannelVideos)
  const setPublicChannelVideos = useStore(s => s.setPublicChannelVideos)

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

    // we already have all the videos we need (eg. they were rendered server-side)
    // if (publicChannelVideos.length) { return }

    // setPublicChannelVideos([])

    // do we really need this? normally this was computed server-side
    /*
    startTransition(async () => {
      const newPublicChannelVideos = await getChannelVideos({
        channel: publicChannel,
        status: "published",
      })
      console.log("publicChannelVideos:", newPublicChannelVideos)
      setPublicChannelVideos(newPublicChannelVideos)
    })
    */

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
        items={publicChannelVideos}
      />
    </div>
  )
}