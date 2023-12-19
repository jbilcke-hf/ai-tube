import { cn } from "@/lib/utils"
import { MediaDisplayLayout, VideoInfo } from "@/types"
import { TrackCard } from "../track-card"
import { VideoCard } from "../video-card"

export function MediaList({
  items,
  type = "video",
  layout = "grid",
  className = "",
  onSelect,
  selectedId,
}: {
  items: VideoInfo[]

  /**
   * Layout mode
   * 
   * This isn't necessarily based on screen size, it can also be:
   * - based on the device type (eg. a smart TV)
   * - a design choice for a particular page
   */
  layout?: MediaDisplayLayout

  /**
   * Content type
   * 
   * Used to change the way we display elements
   */
  type?: "video" | "track"

  className?: string

  onSelect?: (media: VideoInfo) => void

  selectedId?: string
}) {
  
  return (
    <div
      className={cn(
        layout === "table"
          ? `flex flex-col` :
        layout === "grid"
          ? `grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4` :
        layout === "vertical"
          ? `grid grid-cols-1 gap-2`
          : `flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4`,
        className,
      )}
    >
    {items.map((media, i) => {
      const Component = type === "track" ? TrackCard : VideoCard
    
      return (
        <Component
          key={media.id}
          media={media}
          className="w-full"
          layout={layout}
          onSelect={onSelect}
          selected={selectedId === media.id}
          index={i}
        />
      )
    })}
    </div>
  )
}