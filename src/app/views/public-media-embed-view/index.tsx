"use client"

import { useEffect, useTransition } from "react"

import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils/cn"
import { MediaPlayer } from "@/components/interface/media-player"

import { countNewMediaView } from "@/app/api/actions/stats"

export function PublicMediaEmbedView() {
  const [_pending, startTransition] = useTransition()

  // current time in the media
  // note: this is used to *set* the current time, not to read it
  // EDIT: you know what, let's do this the dirty way for now
  // const [desiredCurrentTime, setDesiredCurrentTime] = useState()

  const media = useStore(s => s.publicMedia)

  const mediaId = `${media?.id || ""}`

  const setPublicMedia = useStore(s => s.setPublicMedia)

  // we inject the current mediaId in the URL, if it's not already present
  // this is a hack for Hugging Face iframes
  useEffect(() => {
    const queryString = new URL(location.href).search
    const searchParams = new URLSearchParams(queryString)
    if (mediaId) {
      // "v" is the legacy parameter, for when we only worked on videos
      if (searchParams.get("m") !== mediaId || searchParams.get("v") !== mediaId) {
        console.log(`current mediaId "${mediaId}" isn't set in the URL query params.. TODO we should set it`)
        
        // searchParams.set("v", mediaoId)
        // location.search = searchParams.toString()
      }
    } else {
      // searchParams.delete("v")
      // location.search = searchParams.toString()
    }
  }, [mediaId])

  useEffect(() => {
    startTransition(async () => {
      if (!media || !media.id) {
        return
      }
      const numberOfViews = await countNewMediaView(mediaId)

      setPublicMedia({
        ...media,
        numberOfViews
      })
    })

  }, [media?.id])

  if (!media) { return null }
  
  return (
    <div className={cn(
      `w-full`,
      `flex flex-col`
    )}>
      <MediaPlayer
        className="rounded-xl overflow-hidden"
        media={media}
        enableShortcuts={false}
      />
    </div>
  )
}
