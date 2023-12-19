"use client"

import { Player } from "react-tuby"
import "react-tuby/css/main.css"

import { cn } from "@/lib/utils"
import { VideoInfo } from "@/types"
import { MutableRefObject, useEffect, useRef } from "react"
import { isValidNumber } from "@/app/server/actions/utils/isValidNumber"

export function VideoPlayer({
  video,
  enableShortcuts = true,
  className = "",
  // currentTime,
 }: {
  video?: VideoInfo
  enableShortcuts?: boolean
  className?: string
  // currentTime?: number
}) {

  /*
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) { return }
    if (!isValidNumber(currentTime)) { return }
    
    (ref.current as any).currentTime = currentTime 
    // $(".tuby-container video").currentTime = 2
  }, [currentTime])
  */

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
        
          // playerRef={ref}

          src={[
            {
              quality: "Full HD",
              url: video.assetUrl,
            }
          ]}

          keyboardShortcut={enableShortcuts}

          subtitles={[]}
          // poster="https://cdn.jsdelivr.net/gh/naptestdev/video-examples@master/poster.png"
        />
      </div>
    </div>
  )
}