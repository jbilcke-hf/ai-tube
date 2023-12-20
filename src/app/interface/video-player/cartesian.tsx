"use client"

import { Player } from "react-tuby"
import "react-tuby/css/main.css"

import { cn } from "@/lib/utils"
import { VideoInfo } from "@/types"

export function CartesianVideoPlayer({
  video,
  enableShortcuts = true,
  className = "",
  // currentTime,
 }: {
  video: VideoInfo
  enableShortcuts?: boolean
  className?: string
  // currentTime?: number
}) {
  return (
    <div className={cn(
      `w-full`,
      `flex flex-col items-center justify-center`,
      `rounded-xl overflow-hidden`,
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
              url: video.assetUrl,
            }
          ]}

          keyboardShortcut={enableShortcuts}

          subtitles={[]}
          poster={
            `https://huggingface.co/datasets/jbilcke-hf/ai-tube-index/resolve/main/videos/${video.id}.webp`
          }
        />
      </div>
    </div>
  )
}