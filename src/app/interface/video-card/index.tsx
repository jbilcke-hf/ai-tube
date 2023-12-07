import { useRef, useState } from "react"
import { RiCheckboxCircleFill } from "react-icons/ri"

import { cn } from "@/lib/utils"
import { VideoInfo } from "@/types"
import { formatDuration } from "@/lib/formatDuration"
import { formatTimeAgo } from "@/lib/formatTimeAgo"
import Link from "next/link"

const defaultChannelThumbnail = "/huggingface-avatar.jpeg"

export function VideoCard({
  video,
  className = "",
  onSelect,
}: {
  video: VideoInfo
  className?: string
  onSelect?: (video: VideoInfo) => void
 }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [duration, setDuration] = useState(0)

  const [channelThumbnail, setChannelThumbnail] = useState(video.channel.thumbnail)

  const handlePointerEnter = () => {
    // ref.current?.load()
    ref.current?.play()
  }
  const handlePointerLeave = () => {
    ref.current?.pause()
    // ref.current?.load()
  }
  const handleLoad = () => {
    if (ref.current?.readyState) {
      setDuration(ref.current.duration)
    }
  }

  const handleClick = () => {
    onSelect?.(video)
  }

  const handleBadChannelThumbnail = () => {
    try {
      if (channelThumbnail !== defaultChannelThumbnail) {
        setChannelThumbnail(defaultChannelThumbnail)
      }
    } catch (err) {
      
    }
  }

  return (
  <Link href={`/watch?v=${video.id}`}>
    <div
      className={cn(
        `w-full`,
        `flex flex-col`,
        `bg-line-900`,
        `space-y-3`,
        `cursor-pointer`,
        className,
      )}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      // onClick={handleClick}
      >
        <div
          className={cn(
            `flex flex-col aspect-video items-center justify-center`,
            `rounded-xl overflow-hidden`,
          )}
        >
          <video
            ref={ref}
            src={video.assetUrl}
            className="w-full"
            onLoadedMetadata={handleLoad}
            muted
          />

          <div className={cn(
            ``,
            `w-full flex flex-row items-end justify-end`
            )}>
              <div className={cn(
                `-mt-8`,
                `mr-0`,
              )}
              >
                <div className={cn(
                  `mb-[5px]`,
                  `mr-[5px]`,
                  `flex flex-col items-center justify-center text-center`,
                  `bg-neutral-900 rounded`,
                  `text-2xs font-semibold px-[3px] py-[1px]`,
                )}
                >{formatDuration(duration)}</div>
              </div>
          </div>
        </div>
        <div className={cn(
          `flex flex-row space-x-4`,
        )}>
          <div className="flex flex-col">
            <div className="flex w-9 rounded-full overflow-hidden">
              <img
                src={channelThumbnail}
                onError={handleBadChannelThumbnail}
              />
            </div>
          </div>
          <div className="flex flex-col flex-grow">
            <h3 className="text-zinc-100 text-base font-medium mb-0 line-clamp-2">{video.label}</h3>
            <div className={cn(
              `flex flex-row items-center`,
              `text-neutral-400 text-sm font-normal space-x-1`,
              )}>
              <div>{video.channel.label}</div>
              <div><RiCheckboxCircleFill className="" /></div>
            </div>
            <div className={cn(
              `flex flex-row`,
              `text-neutral-400 text-sm font-normal`,
              `space-x-1`
            )}>
            <div>0 views</div>
            <div className="font-semibold scale-125">·</div>
            <div>{formatTimeAgo(video.updatedAt)}</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}