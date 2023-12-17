"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { RiCheckboxCircleFill } from "react-icons/ri"

import { cn } from "@/lib/utils"
import { MediaDisplayLayout, VideoInfo } from "@/types"
import { formatDuration } from "@/lib/formatDuration"
import { formatTimeAgo } from "@/lib/formatTimeAgo"
import { isCertifiedUser } from "@/app/certification"
import { transparentImage } from "@/lib/transparentImage"
import { DefaultAvatar } from "../default-avatar"

export function TrackCard({
  media,
  className = "",
  layout = "grid",
  onSelect,
  index
}: {
  media: VideoInfo
  className?: string
  layout?: MediaDisplayLayout
  onSelect?: (media: VideoInfo) => void
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

  const isTable = layout === "table"
  const isMicro = layout === "micro"
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
  <Link href={`/music?m=${media.id}`}>
    <div
      className={cn(
        `w-full flex`,
        isTable ? `flex-row h-16 space-x-4 px-2 py-2 rounded-lg` :
        isCompact ? `flex-row h-24 py-1 space-x-2` :
        `flex-col space-y-3`,
        `bg-line-900`,
        `cursor-pointer`,
        (isTable || isMicro) ? (
          (index % 2) ? "bg-neutral-800/40 hover:bg-neutral-800/70" : "hover:bg-neutral-800/70"
        ) : "",
        className,
      )}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      // onClick={handleClick}
      >
        {/* THUMBNAIL BLOCK */}
        <div
          className={cn(
            `flex items-center justify-center`,
            `rounded overflow-hidden`,
            isTable ? `flex-col` :
            isMicro ? `flex-col` :
            isCompact ? ` flex-col w-42 h-42` :
            ` flex-col aspect-square`
          )}
        >
          <div className={cn(
            `relative`,
            `aspect-square`,
            isTable ? "w-full h-full" : isCompact ? `w-42 h-42` : ``
          )}>
            {!isTable && mediaThumbnailReady && shouldLoadMedia
              ? <video
                // mute the video
                muted

                // prevent iOS from attempting to open the video in full screen, which is annoying
                playsInline

                ref={ref}
                src={media.assetUrl}
                className={cn(
                  `w-full h-full`,
                  `aspect-square`,
                  duration > 0 ? `opacity-100`: 'opacity-0',
                  `transition-all duration-500`,
                  )}
                onLoadedMetadata={handleLoad}

              /> : null}
            <img
              src={mediaThumbnail}
              className={cn(
                `absolute`,
                `aspect-square object-cover`,
                `rounded-lg overflow-hidden`,
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

          {isTable ? null : <div className={cn(
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
          </div>}
        </div>

        {/* TEXT BLOCK */}
        <div className={cn(
          `flex flex-row`,


          isTable ? `w-full` :

          isCompact ? `w-40 lg:w-44 xl:w-51` : `space-x-4`,
        )}>
          {
          isTable || isCompact ? null
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
            `flex`,
            isMicro ? ` flex-col justify-center` :
            isTable ? `w-full flex-col md:flex-row justify-center md:justify-start items-start md:items-center` :
            isCompact ?  `flex-col` : `flex-col flex-grow`
          )}>
            <h3 className={cn(
              `text-zinc-100 mb-0 line-clamp-2`,
              isMicro ? `font-normal text-2xs md:text-xs lg:text-sm mb-0.5` : 
              isTable ? `w-[30%] font-normal text-xs md:text-sm lg:text-base mb-0.5` : 
              isCompact ? `font-medium text-2xs md:text-xs lg:text-sm mb-1.5` :
              `font-medium text-base`
            )}>{media.label}</h3>
            <div className={cn(
              `flex flex-row items-center`,
              `text-neutral-400 font-normal space-x-1`,
              isTable ? `text-2xs md:text-xs lg:text-sm` :
              isCompact ? `text-3xs md:text-2xs lg:text-xs` : `text-sm`
              )}>
              <div>{media.channel.label}</div>
              {isCertifiedUser(media.channel.datasetUser) ? <div><RiCheckboxCircleFill className="opacity-40" /></div> : null}
            </div>
            
            {isTable ? null : <div className={cn(
              `flex flex-row`,
              `text-neutral-400 font-normal`,
              isCompact ? `text-2xs lg:text-xs` : `text-sm`,
              `space-x-1`
            )}>
            <div>{media.numberOfViews} views</div>
            <div className="font-semibold scale-125">·</div>
            <div>{formatTimeAgo(media.updatedAt)}</div>
            </div>}

            {/*
            {isTable ? <div className={cn(
              `hidden md:flex flex-row flex-grow`,
              `text-zinc-100 mb-0 line-clamp-2`,
              `w-[30%] font-normal text-xs md:text-sm lg:text-base mb-0.5` 
            )}>{media.duration}</div> : null}
            */}
          </div>
        </div>
      </div>
    </Link>
  )
}