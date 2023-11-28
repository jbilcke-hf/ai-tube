import { cn } from "@/lib/utils"
import { FullVideoInfo } from "@/types"

import { VideoCard } from "../video-card"

export function VideoList({
  videos,
  layout = "flex",
  className = "",
}: {
  videos: FullVideoInfo[]

  /**
   * Layout mode
   * 
   * This isn't necessarily based on screen size, it can also be:
   * - based on the device type (eg. a smart TV)
   * - a design choice for a particular page
   */
  layout?: "grid" | "flex"

  className?: string
}) {
  
  return (
    <div
      className={cn(
        layout === "grid"
          ? `grid grid-cols-4 gap-4`
          : `flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4`,
        className,
      )}
    >
    {videos.map((video) => (
      <VideoCard
        key={video.id}
        video={video}
        className=""
      />
    ))}
    </div>
  )
}