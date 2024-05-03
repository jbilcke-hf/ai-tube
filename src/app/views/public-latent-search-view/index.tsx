"use client"

import { useEffect, useTransition } from "react"

import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils/cn"
import { MediaInfo } from "@/types/general"
import { getVideos } from "@/app/api/actions/ai-tube-hf/getVideos"
import { VideoList } from "@/components/interface/video-list"

export function PublicLatentSearchView() {
  const [_isPending, startTransition] = useTransition()
  const setView = useStore(s => s.setView)
  const currentTag = useStore(s => s.currentTag)
  const setPublicMedias = useStore(s => s.setPublicMedias)
  const setPublicMedia = useStore(s => s.setPublicMedia)
  const publicMedias = useStore(s => s.publicMedias)

  useEffect(() => {
    startTransition(async () => {
      const medias = await getVideos({
        sortBy: "date",
        mandatoryTags: currentTag ? [currentTag] : [],
        maxNbMedias: 25
      })

      // due to some caching on the first function.. we update with fresh data!
      // const updatedVideos = await extendVideosWithStats(medias)

      setPublicMedias(medias)
    })
  }, [currentTag])

  const handleSelect = (media: MediaInfo) => {
    setView("public_latent_media")
    setPublicMedia(media)
  }

  return (
    <div className={cn(
     `sm:pr-4`
    )}>
      <VideoList
        items={publicMedias}
        onSelect={handleSelect}
      />
    </div>
  )
}