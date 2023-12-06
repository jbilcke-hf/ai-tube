import { cn } from "@/lib/utils"
import { VideoInfo } from "@/types"

import { VideoCard } from "../video-card"

export function VideoList({
  videos,
  layout = "flex",
  className = "",
  onSelect,
}: {
  videos: VideoInfo[]

  /**
   * Layout mode
   * 
   * This isn't necessarily based on screen size, it can also be:
   * - based on the device type (eg. a smart TV)
   * - a design choice for a particular page
   */
  layout?: "grid" | "flex"

  className?: string

  onSelect?: (video: VideoInfo) => void
}) {
  
  return (
    <div
      className={cn(
        layout === "grid"
          ? `grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
          : `flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4`,
        className,
      )}
    >
    {videos.map((video) => (
      <VideoCard
        key={video.id}
        video={video}
        className="w-full"
        onSelect={onSelect}
      />
    ))}
    </div>
  )
}