"use client"

import { Player } from "react-tuby"
import "react-tuby/css/main.css"

import { cn } from "@/lib/utils"
import { VideoInfo } from "@/types"

export function VideoPlayer({
  video,
  className = ""
 }: {
  video?: VideoInfo
  className?: string
}) {

  // TODO: keep the same form factor?
  if (!video) { return null }

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
        
          src={[
            {
              quality: "Full HD",
              url: video.assetUrl,
            }
          ]}
          subtitles={[]}
          // poster="https://cdn.jsdelivr.net/gh/naptestdev/video-examples@master/poster.png"
        />
      </div>
    </div>
  )
}