import { cn } from "@/lib/utils"
import { VideoInfo } from "@/types"

export function VideoCard({
  video,
  className = "",
}: {
  video: VideoInfo
  className?: string
 }) {

  return (
  <div
    className={cn(
      `flex flex-col`,
      `w-[300px] h-[400px]`,
      `bg-line-900`,
      className,
    )}>
      <div
        className={cn(
          `rounded-lg overflow-hidden`
        )}
      >
        <img src="" />
      </div>
      <div className={cn(

      )}>
        <h3>{video.label}</h3>
      </div>
    </div>
  )
}