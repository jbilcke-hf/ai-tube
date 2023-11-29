import { useEffect } from "react"

import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils"

export function PublicVideoView() {
  const displayMode = useStore(s => s.displayMode)
  const setDisplayMode = useStore(s => s.setDisplayMode)
  const currentChannel = useStore(s => s.currentChannel)
  const setCurrentChannel = useStore(s => s.setCurrentChannel)
  const currentTag = useStore(s => s.currentTag)
  const setCurrentTag = useStore(s => s.setCurrentTag)
  const currentVideos = useStore(s => s.currentVideos)
  const currentVideo = useStore(s => s.currentVideo)
  const setCurrentVideo = useStore(s => s.setCurrentVideo)

  useEffect(() => {

  }, [currentCategory])

  return (
    <div className={cn(
      `grid grid-cols-4`
    )}>
      {null}
    </div>
  )
}