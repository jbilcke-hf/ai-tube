"use client"

import { useEffect, useTransition } from "react"

import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils"
import { VideoPlayer } from "@/app/interface/video-player"

import { watchVideo } from "@/app/server/actions/stats"

export function PublicVideoEmbedView() {
  const [_pending, startTransition] = useTransition()

  // current time in the video
  // note: this is used to *set* the current time, not to read it
  // EDIT: you know what, let's do this the dirty way for now
  // const [desiredCurrentTime, setDesiredCurrentTime] = useState()

  const video = useStore(s => s.publicVideo)

  const videoId = `${video?.id || ""}`

  const setPublicVideo = useStore(s => s.setPublicVideo)

  // we inject the current videoId in the URL, if it's not already present
  // this is a hack for Hugging Face iframes
  useEffect(() => {
    const queryString = new URL(location.href).search
    const searchParams = new URLSearchParams(queryString)
    if (videoId) {
      if (searchParams.get("v") !== videoId) {
        console.log(`current videoId "${videoId}" isn't set in the URL query params.. TODO we should set it`)
        
        // searchParams.set("v", videoId)
        // location.search = searchParams.toString()
      }
    } else {
      // searchParams.delete("v")
      // location.search = searchParams.toString()
    }
  }, [videoId])

  useEffect(() => {
    startTransition(async () => {
      if (!video || !video.id) {
        return
      }
      const numberOfViews = await watchVideo(videoId)

      setPublicVideo({
        ...video,
        numberOfViews
      })
    })

  }, [video?.id])

  if (!video) { return null }
  
  return (
    <div className={cn(
      `w-full`,
      `flex flex-col`
    )}>
      <VideoPlayer
        video={video}
        enableShortcuts={false}
      />
    </div>
  )
}
