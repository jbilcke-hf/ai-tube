"use client"

import { Player } from "react-tuby"
import "react-tuby/css/main.css"

import { cn } from "@/lib/utils/cn"
import { MediaInfo } from "@/types/general"

export function CartesianVideoPlayer({
  media,
  enableShortcuts = true,
  className = "",
  // currentTime,
 }: {
  media: MediaInfo
  enableShortcuts?: boolean
  className?: string
  // currentTime?: number
}) {

  const assetUrl = media.assetUrlHd || media.assetUrl

  if (!assetUrl) {
    return (
      <div className={cn(
        `w-full`,
        `flex flex-col items-center justify-center`,
        className
      )}>
    </div>
  )}

  return (
    <div className={cn(
        `w-full`,
        `flex flex-col items-center justify-center`,
        className
      )}>
      <div className={cn(
        `w-[calc(100%+16px)]`,
        `-ml-2 -mr-2`,
        `flex flex-col items-center justify-center`,
        )}>
        <Player
        
          // playerRef={ref}

          src={[
            {
              quality: "Full HD",

              // TODO: separate the media asset URLs into separate source channels,
              // one for each resolution
              url: media.assetUrlHd || media.assetUrl,
            }
          ]}

          keyboardShortcut={enableShortcuts}

          subtitles={[]}
          poster={
            `https://huggingface.co/datasets/jbilcke-hf/ai-tube-index/resolve/main/videos/${media.id}.webp`
          }
        />
      </div>
    </div>
  )
}