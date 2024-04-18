"use client"

import { useEffect, useTransition } from "react"

import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils/cn"
import { MediaInfo } from "@/types/general"
import { getVideos } from "@/app/api/actions/ai-tube-hf/getVideos"
import { TrackList } from "@/components/interface/track-list"
import { PlaylistControl } from "@/components/interface/playlist-control"
import { usePlaylist } from "@/lib/hooks/usePlaylist"

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
        maxNbMedias: 25
      })

      setPublicMedias(newTracks)
    })
    */
  }, [])

  const handleSelect = (media: MediaInfo) => {
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