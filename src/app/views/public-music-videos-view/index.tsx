"use client"

import { useEffect, useTransition } from "react"

import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils"
import { VideoInfo } from "@/types"
import { getVideos } from "@/app/server/actions/ai-tube-hf/getVideos"
import { TrackList } from "@/app/interface/track-list"

export function PublicMusicVideosView() {
  const [_isPending, startTransition] = useTransition()
  const setView = useStore(s => s.setView)
  const setPublicTracks = useStore(s => s.setPublicTracks)
  const setPublicTrack = useStore(s => s.setPublicTrack)
  const publicTracks = useStore(s => s.publicTracks)

  useEffect(() => {
  
    /*
    startTransition(async () => {
      const newTracks = await getVideos({
        sortBy: "date",
        mandatoryTags: ["music"],
        maxVideos: 25
      })

      setPublicVideos(newTracks)
    })
    */
  }, [])

  const handleSelect = (media: VideoInfo) => {
    //
    // setView("public_video")
    // setPublicVideo(video)
    console.log("play the track in the background, but don't reload everything")
  }

  return (
    <div className={cn(
     `sm:pr-4`
    )}>
      <TrackList
        items={publicTracks}
        onSelect={handleSelect}
        layout="table"
      />
    </div>
  )
}