"use client"

import { useEffect } from "react"
import { RiCheckboxCircleFill } from "react-icons/ri"

import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils"
import { VideoPlayer } from "@/app/interface/video-player"


export function PublicVideoView() {
  const displayMode = useStore(s => s.displayMode)
  const video = useStore(s => s.currentVideo)
  const setMenuMode = useStore(s => s.setMenuMode)
  const setHeaderMode = useStore(s => s.setHeaderMode)

  if (!video) { return null }
  
  return (
    <div className={cn(
      `w-full`,
      `flex flex-row`
    )}>
      <div className={cn(
        `flex-grow`,
        `flex flex-col`,
      )}>
        {/** VIDEO PLAYER - HORIZONTAL */}
        <VideoPlayer
          video={video}
          className="mb-4"
        />

        {/** VIDEO TITLE - HORIZONTAL */}
        <div className={cn(
          `text-xl text-zinc-100 font-medium mb-0 line-clamp-2`,
          `mb-2`
        )}>
          {video?.label}
        </div>
        
        {/** VIDEO TOOLBAR - HORIZONTAL */}
        <div className={cn(
          `flex flex-row`,
          `items-center`
        )}>
          {/** CHANNEL LOGO - VERTICAL */}
          <div className={cn(
            `flex flex-col`,
            `mr-3`
          )}>
            <div className="flex w-10 rounded-full overflow-hidden">
              <img
                src="huggingface-avatar.jpeg"
              />
            </div>
          </div>

          {/** CHANNEL INFO - VERTICAL */}
          <div className={cn(
            `flex flex-col`
            )}>
            <div className={cn(
              `flex flex-row items-center`,
              `text-zinc-100 text-base font-medium space-x-1`,
              )}>
              <div>{video.channel.label}</div>
              <div className="text-sm text-neutral-400"><RiCheckboxCircleFill className="" /></div>
            </div>
            <div className={cn(
              `flex flex-row items-center`,
              `text-neutral-400 text-xs font-normal space-x-1`,
              )}>
              <div>0 followers</div>
              <div></div>
            </div>
          </div>

        </div>

      </div>
      <div className={cn(
        `sm:w-56 md:w-96`,
        `hidden sm:flex flex-col`,
        `px-4`
      )}>
        {/*[ TO BE CONTINUED ]*/}
      </div>
    </div>
  )
}