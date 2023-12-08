"use client"

import { useEffect, useState } from "react"
import { RiCheckboxCircleFill } from "react-icons/ri"
import { PiShareFatLight } from "react-icons/pi"
import CopyToClipboard from "react-copy-to-clipboard"
import { LuCopyCheck } from "react-icons/lu"

import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils"
import { VideoPlayer } from "@/app/interface/video-player"
import { VideoInfo } from "@/types"


export function PublicVideoView() {
  const video = useStore(s => s.publicVideo)

  const videoId = `${video?.id || ""}`

  const [copied, setCopied] = useState<boolean>(false)

  // we inject the current videoId in the URL, if it's not already present
  // this is a hack for Hugging Face iframes
  useEffect(() => {
    const queryString = new URL(location.href).search
    const searchParams = new URLSearchParams(queryString)
    if (videoId) {
      if (searchParams.get("v") !== videoId) {
        console.log(`current videoId "${videoId}" isn't set in the URL query params.. TODO we should set it`)
        
        // searchParams.set("v", videoId)
        // location.search = searchParams.toString()
      }
    } else {
      // searchParams.delete("v")
      // location.search = searchParams.toString()
    }
  }, [videoId])

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    }
  }, [copied])
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
          {video.label}
        </div>
        
        {/** VIDEO TOOLBAR - HORIZONTAL */}
        <div className={cn(
          `flex flex-row`,
          `items-center`,
          `justify-between`,
          `mb-4`
        )}>
          {/** LEFT PART FO THE TOOLBARR */}
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

          {/** RIGHT PART FO THE TOOLBAR */}
          <div className={cn(
            `flex flex-row`,
            `items-center`,
            `space-x-2`
          )}>
            {/* SHARE */}
            <div className={cn(
              `flex flex-row`,
              `items-center`
            )}>
              <CopyToClipboard
                text={`https://huggingface.co/spaces/jbilcke-hf/ai-tube?v=${video.id}`}
                onCopy={() => setCopied(true)}>
                <div className={cn(
                  `flex flex-row space-x-2 pl-3 pr-4 h-9`,
                  `items-center justify-center text-center`,
                  `rounded-2xl`,
                  `cursor-pointer`,
                  `bg-neutral-700/50 hover:bg-neutral-700/90 text-zinc-100`
                )}>
                  <div className="flex items-center justify-center pt-0.5">
                    {
                      copied ? <LuCopyCheck className="w-4 h-4" />
                      : <PiShareFatLight className="w-5 h-5" />
                    }
                  </div>
                  <div className="text-sm font-medium">
                    {
                      copied ? "Link copied!" : "Share video"
                    }</div>
                </div>
              </CopyToClipboard>
            </div>
          </div>

        </div>

        {/** VIDEO DESCRIPTION - VERTICAL */}
        <div className={cn(
          `flex flex-col p-3`,
          `rounded-xl`,
          `bg-neutral-700/50`,
          `text-sm`
        )}>
          <p>{video.description}</p>
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
