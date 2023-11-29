import { useEffect } from "react"

import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils"
import { VideoInfo } from "@/types"

export function HomeView() {
  const displayMode = useStore(s => s.displayMode)
  const setDisplayMode = useStore(s => s.setDisplayMode)
  const currentChannel = useStore(s => s.currentChannel)
  const setCurrentChannel = useStore(s => s.setCurrentChannel)
  const currentTag = useStore(s => s.currentTag)
  const setCurrentTag = useStore(s => s.setCurrentTag)
  const currentVideos = useStore(s => s.currentVideos)
  const setCurrentVideos = useStore(s => s.setCurrentVideos)
  const currentVideo = useStore(s => s.currentVideo)
  const setCurrentVideo = useStore(s => s.setCurrentVideo)

  useEffect(() => {

    // we use fake data for now
    // this will be pulled from the Hugging Face API
    const newCategoryVideos: VideoInfo[] = []
    setCurrentVideos(newCategoryVideos)
  }, [currentTag])

  return (
    <div className={cn(
      `grid grid-cols-4`
    )}>
      {currentVideos.map((video) => (
        <div
          key={video.id}
          className={cn(
            `flex flex-col`,
            `w-[300px] h-[400px]`
          )}>
            <div
              className={cn(

              )}
            >
              <img src="" />
            </div>
            <div className={cn(

            )}>
              <h3>{video.label}</h3>
            </div>
          </div>
      ))}
    </div>
  )
}