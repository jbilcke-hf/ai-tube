"use client"

import { useEffect, useTransition } from "react"

import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils"
import { VideoInfo } from "@/types/general"
import { getVideos } from "@/app/server/actions/ai-tube-hf/getVideos"
import { TrackList } from "@/app/interface/track-list"
import { PlaylistControl } from "@/app/interface/playlist-control"
import { usePlaylist } from "@/lib/usePlaylist"

export function PublicMusicVideosView() {
  const [_isPending, startTransition] = useTransition()
  const setView = useStore(s => s.setView)
  const setPublicTracks = useStore(s => s.setPublicTracks)
  const setPublicTrack = useStore(s => s.setPublicTrack)
  const publicTracks = useStore(s => s.publicTracks)

  const playlist = usePlaylist()

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
    // console.log("going to play:", media.assetUrl.replace(".mp4", ".mp3"))
    playlist.playback({
      url: media.assetUrl.replace(".mp4", ".mp3"),
      meta: media,
      isLastTrackOfPlaylist: false,
      playNow: true,
    })
  }

  return (
    <div className={cn(
     `w-full h-full`
    )}>
      <div className="flex flex-col w-full overflow-y-scroll h-[calc(100%-80px)] sm:pr-4">
        <TrackList
          items={publicTracks}
          onSelect={handleSelect}
          selectedId={playlist.current?.id}
          layout="table"
        />
      </div>

      <PlaylistControl />
    </div>
  )
}