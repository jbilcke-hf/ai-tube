"use client"

import { useRef, useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { RiCheckboxCircleFill } from "react-icons/ri"

import { cn } from "@/lib/utils"
import { VideoInfo } from "@/types"
import { formatDuration } from "@/lib/formatDuration"
import { formatTimeAgo } from "@/lib/formatTimeAgo"

const DefaultAvatar = dynamic(() => import("../default-avatar"), {
  loading: () => null,
})
 

export function VideoCard({
  video,
  className = "",
  layout = "normal",
  onSelect,
}: {
  video: VideoInfo
  className?: string
  layout?: "normal" | "compact"
  onSelect?: (video: VideoInfo) => void
 }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [duration, setDuration] = useState(0)

  const [channelThumbnail, setChannelThumbnail] = useState(video.channel.thumbnail)

  const isCompact = layout === "compact"

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
      if (channelThumbnail) {
        setChannelThumbnail("")
      }
    } catch (err) {
      
    }
  }

  return (
  <Link href={`/watch?v=${video.id}`}>
    <div
      className={cn(
        `w-full flex`,
        isCompact ? `flex-row h-24 py-1 space-x-2` : `flex-col space-y-3`,
        `bg-line-900`,
        `cursor-pointer`,
        className,
      )}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      // onClick={handleClick}
      >
        {/* VIDEO BLOCK */}
        <div
          className={cn(
            `flex flex-col items-center justify-center`,
            `rounded-xl overflow-hidden`,
            isCompact ? `w-42 h-[94px]` : `aspect-video`
          )}
        >
          <video
            ref={ref}
            src={video.assetUrl}
            className={cn(
              `w-full`
              )}
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

        {/* TEXT BLOCK */}
        <div className={cn(
          `flex flex-row`,
          isCompact ? `w-51` : `space-x-4`,
        )}>
          {
          isCompact ? null
          : channelThumbnail ? <div className="flex flex-col">
            <div className="flex w-9 rounded-full overflow-hidden">
              <img
                src={channelThumbnail}
                onError={handleBadChannelThumbnail}
              />
            </div>
          </div>
          : <DefaultAvatar
            username={video.channel.datasetUser}
            bgColor="#fde047"
            textColor="#1c1917"
            width={36}
            roundShape
          />}
          <div className={cn(
            `flex flex-col`,
            isCompact ?  `` : `flex-grow`
          )}>
            <h3 className={cn(
              `text-zinc-100 font-medium mb-0 line-clamp-2`,
              isCompact ? `text-sm mb-1.5` : `text-base`
            )}>{video.label}</h3>
            <div className={cn(
              `flex flex-row items-center`,
              `text-neutral-400 font-normal space-x-1`,
              isCompact ? `text-xs` : `text-sm`
              )}>
              <div>{video.channel.label}</div>
              <div><RiCheckboxCircleFill className="" /></div>
            </div>
            
            <div className={cn(
              `flex flex-row`,
              `text-neutral-400 font-normal`,
              isCompact ? `text-xs` : `text-sm`,
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