"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { RiCheckboxCircleFill } from "react-icons/ri"

import { cn } from "@/lib/utils"
import { MediaDisplayLayout, VideoInfo } from "@/types/general"
import { formatDuration } from "@/lib/formatDuration"
import { formatTimeAgo } from "@/lib/formatTimeAgo"
import { isCertifiedUser } from "@/app/certification"
import { transparentImage } from "@/lib/transparentImage"
import { DefaultAvatar } from "../default-avatar"
import { formatLargeNumber } from "@/lib/formatLargeNumber"

export function VideoCard({
  media,
  className = "",
  layout = "grid",
  onSelect,
  selected,
  index
}: {
  media: VideoInfo
  className?: string
  layout?: MediaDisplayLayout
  onSelect?: (media: VideoInfo) => void
  selected?: boolean
  index: number
 }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [duration, setDuration] = useState(0)

  const [channelThumbnail, setChannelThumbnail] = useState(media.channel.thumbnail)
  const [mediaThumbnail, setMediaThumbnail] = useState(
    `https://huggingface.co/datasets/jbilcke-hf/ai-tube-index/resolve/main/videos/${media.id}.webp`
  )
  const [mediaThumbnailReady, setMediaThumbnailReady] = useState(false)
  const [shouldLoadMedia, setShouldLoadMedia] = useState(false)

  const isCompact = layout === "vertical"

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
    onSelect?.(media)
  }

  const handleBadChannelThumbnail = () => {
    try {
      if (channelThumbnail) {
        setChannelThumbnail("")
      }
    } catch (err) {
      
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setShouldLoadMedia(true)
    }, index * 1500)
  }, [index])

  return (
  <Link href={`https://aitube.at/watch?v=${media.id}`}>
    <div
      className={cn(
        `w-full flex`,
        isCompact 
        ? `space-x-2`
        : `flex-col space-y-3`,
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
            isCompact ? `` : ``
          )}
        >
          <div className={cn(
            `relative w-full`,
            `aspect-video`,
           //  `aspect-video rounded-xl overflow-hidden`,
           isCompact ? `w-42 h-24` : ``
          )}>
            {mediaThumbnailReady && shouldLoadMedia
              ? <video
                // mute the video
                muted

                // prevent iOS from attempting to open the video in full screen, which is annoying
                playsInline

                ref={ref}
                src={media.assetUrlHd || media.assetUrl}
                className={cn(
                  `w-full h-full`,
                  `object-cover`,
                  `rounded-xl overflow-hidden aspect-video`,
                  duration > 0 ? `opacity-100`: 'opacity-0',
                  `transition-all duration-500`,
                  )}
                onLoadedMetadata={handleLoad}

              /> : null}
            <img
              src={mediaThumbnail}
              className={cn(
                `absolute`,
                `object-cover`,
                `rounded-xl overflow-hidden aspect-video`,
                mediaThumbnailReady ? `opacity-100`: 'opacity-0',
                `hover:opacity-0 w-full h-full top-0 z-30`,
                //`pointer-events-none`,
                `transition-all duration-500 hover:delay-300 ease-in-out`,
              )}
              onMouseEnter={() => {
                setShouldLoadMedia(true)
              }}
              onLoad={() => {
                setMediaThumbnailReady(true)
              }}
              onError={() => {
                setMediaThumbnail(transparentImage)
                setMediaThumbnailReady(false)
              }}
            />
          </div>

          <div className={cn(
            // `aspect-video`,
            `z-40`,
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
          `flex-none`,
          isCompact ? `w-40 lg:w-44 xl:w-51` : `space-x-4`,
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
              username={media.channel.datasetUser}
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
            )}>{media.label}</h3>
            <div className={cn(
              `flex flex-row items-center`,
              `text-neutral-400 font-normal space-x-1`,
              isCompact ? `text-xs` : `text-sm`
              )}>
              <div>{media.channel.label}</div>
              {isCertifiedUser(media.channel.datasetUser) ? <div><RiCheckboxCircleFill className="" /></div> : null}
            </div>
            
            <div className={cn(
              `flex flex-row`,
              `text-neutral-400 font-normal`,
              isCompact ? `text-xs` : `text-sm`,
              `space-x-1`
            )}>
            <div>{formatLargeNumber(media.numberOfViews)} views</div>
            <div className="font-semibold scale-125">·</div>
            <div>{formatTimeAgo(media.updatedAt)}</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}