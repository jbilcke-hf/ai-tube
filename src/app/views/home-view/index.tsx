import { useEffect } from "react"

import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils"
import { VideoInfo } from "@/types"

export function HomeView() {
  const displayMode = useStore(s => s.displayMode)
  const setDisplayMode = useStore(s => s.setDisplayMode)
  const currentChannel = useStore(s => s.currentChannel)
  const setCurrentChannel = useStore(s => s.setCurrentChannel)
  const currentCategory = useStore(s => s.currentCategory)
  const setCurrentCategory = useStore(s => s.setCurrentCategory)
  const currentVideos = useStore(s => s.currentVideos)
  const setCurrentVideos = useStore(s => s.setCurrentVideos)
  const currentVideo = useStore(s => s.currentVideo)
  const setCurrentVideo = useStore(s => s.setCurrentVideo)

  useEffect(() => {

    // we use fake data for now
    // this will be pulled from the Hugging Face API
    const newCategoryVideos: VideoInfo[] = [
      {
        id: "42",
        label: "Test Julian",
        thumbnailUrl: "",
        assetUrl: "",
        numberOfViews: 0,
        createdAt: "2023-11-27",
        categories: [],
        channelId: "",
        channel: {
          id: "",
          slug: "",
          label: "Hugging Face",
          thumbnail: "",
          prompt: "",
          likes: 0,
        }
      }
    ]
    setCurrentVideos(newCategoryVideos)
  }, [currentCategory])

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