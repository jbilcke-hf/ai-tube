"use client"

import { useEffect, useState, useTransition } from "react"
import { RiCheckboxCircleFill } from "react-icons/ri"
import { PiShareFatLight } from "react-icons/pi"
import CopyToClipboard from "react-copy-to-clipboard"
import { LuCopyCheck } from "react-icons/lu"
import { LuScrollText } from "react-icons/lu"
import { BiCameraMovie } from "react-icons/bi"

import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils"
import { VideoPlayer } from "@/app/interface/video-player"
import { VideoInfo } from "@/types"
import { ActionButton, actionButtonClassName } from "@/app/interface/action-button"
import { RecommendedVideos } from "@/app/interface/recommended-videos"
import { isCertifiedUser } from "@/app/certification"
import { watchVideo } from "@/app/server/actions/stats"
import { formatTimeAgo } from "@/lib/formatTimeAgo"
import { DefaultAvatar } from "@/app/interface/default-avatar"
 
export function PublicVideoView() {
  const [_pending, startTransition] = useTransition()
  const video = useStore(s => s.publicVideo)

  const videoId = `${video?.id || ""}`

  const [copied, setCopied] = useState<boolean>(false)

  const [channelThumbnail, setChannelThumbnail] = useState(`${video?.channel.thumbnail || ""}`)
  const setPublicVideo = useStore(s => s.setPublicVideo)

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


  const handleBadChannelThumbnail = () => {
    try {
      if (channelThumbnail) {
        setChannelThumbnail("")
      }
    } catch (err) {
      
    }
  }

  useEffect(() => {
    startTransition(async () => {
      if (!video || !video.id) {
        return
      }
      const numberOfViews = await watchVideo(videoId)

      setPublicVideo({
        ...video,
        numberOfViews
      })
    })

  }, [video?.id])

  if (!video) { return null }

  return (
    <div className={cn(
      `w-full`,
      `flex flex-row`
    )}>
      <div className={cn(
        `flex-grow`,
        `flex flex-col`,
        `transition-all duration-200 ease-in-out`,
        `px-2 sm:px-0`
      )}>
        {/** VIDEO PLAYER - HORIZONTAL */}
        <VideoPlayer
          video={video}
          className="mb-4"
        />

        {/** VIDEO TITLE - HORIZONTAL */}
        <div className={cn(
          `flex flew-row space-x-2`,
          `transition-all duration-200 ease-in-out`,
          `text-lg lg:text-xl text-zinc-100 font-medium mb-0 line-clamp-2`,
          `mb-2`,
        )}>
          <div className="">{video.label}</div>
          {/*
          <div className={cn(
            `flex flex-row`, // `inline-block`,
            `bg-neutral-700 text-neutral-300 rounded-lg`,
            // `items-center justify-center`,
            `text-center`,
            `px-1.5 py-0.5`,
            `text-xs`
            )}>
            AI Video Model: {video.model || "HotshotXL"}
          </div>
          */}
        </div>
        
        {/** VIDEO TOOLBAR - HORIZONTAL */}
        <div className={cn(
          `flex flex-col space-y-3 xl:space-y-0 xl:flex-row`,
          `transition-all duration-200 ease-in-out`,
          `items-start xl:items-center`,
          `justify-between`,
          `mb-4`,
        )}>
          {/** LEFT PART OF THE TOOLBAR */}
          <div className={cn(
            `flex flex-row`,
            `items-center`
          )}>
            {/** CHANNEL LOGO - VERTICAL */}
            <a
              className={cn(
                `flex flex-col`,
                `mr-3`,
                `cursor-pointer`
              )}
              href={`https://huggingface.co/datasets/${video.channel.datasetUser}/${video.channel.datasetName}`}
              target="_blank">
              <div className="flex w-10 rounded-full overflow-hidden">
              {
                channelThumbnail ? <div className="flex flex-col">
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
              </div>
            </a>

            {/** CHANNEL INFO - VERTICAL */}
            <a className={cn(
              `flex flex-row sm:flex-col`,
              `transition-all duration-200 ease-in-out`,
              `cursor-pointer`,
              )}
              href={`https://huggingface.co/datasets/${video.channel.datasetUser}/${video.channel.datasetName}`}
              target="_blank">
              <div className={cn(
                `flex flex-row items-center`,
                `transition-all duration-200 ease-in-out`,
                `text-zinc-100 text-sm lg:text-base font-medium space-x-1`,
                )}>
                <div>{video.channel.label}</div>
                {isCertifiedUser(video.channel.datasetUser) ? <div className="text-sm text-neutral-400"><RiCheckboxCircleFill className="" /></div> : null}
              </div>
              <div className={cn(
                `flex flex-row items-center`,
                `text-neutral-400 text-xs font-normal space-x-1`,
                )}>
                <div>0 followers</div>
                <div></div>
              </div>
            </a>


          </div>

          {/** RIGHT PART OF THE TOOLBAR */}
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
                <div className={actionButtonClassName}>
                  <div className="flex items-center justify-center">
                    {
                      copied ? <LuCopyCheck className="w-4 h-4" />
                      : <PiShareFatLight className="w-5 h-5" />
                    }
                  </div>
                  <div>
                    {
                      copied ? "Link copied!" : "Share video"
                    }</div>
                </div>
              </CopyToClipboard>
            </div>

            <ActionButton
              href={
                video.model === "LaVie"
                ? "https://huggingface.co/vdo/LaVie"
                : video.model === "SVD"
                ? "https://huggingface.co/stabilityai/stable-video-diffusion-img2vid"
                : "https://huggingface.co/hotshotco/Hotshot-XL"
              }
            >
              <BiCameraMovie />
              <span>Made with {video.model}</span>
            </ActionButton>

            <ActionButton
              href={
                `https://huggingface.co/datasets/${
                  video.channel.datasetUser
                }/${
                  video.channel.datasetName
                }/raw/main/prompt_${
                  video.id
                }.md`
              }
            >
              <LuScrollText />
              <span>See prompt</span>
            </ActionButton>
          </div>

        </div>

        {/** VIDEO DESCRIPTION - VERTICAL */}
        <div className={cn(
          `flex flex-col p-3`,
          `transition-all duration-200 ease-in-out`,
          `rounded-xl`,
          `bg-neutral-700/50`,
          `text-sm text-zinc-100`,
        )}>
          <div className="flex flex-row space-x-2 font-medium mb-1">
            <div>{video.numberOfViews} views</div>
            <div>{formatTimeAgo(video.updatedAt).replace("about ", "")}</div>
          </div>
          <p>{video.description}</p>
        </div>
      </div>
      <div className={cn(
        `w-40 sm:w-56 md:w-64 lg:w-72 xl:w-[450px]`,
        `transition-all duration-200 ease-in-out`,
        `hidden sm:flex flex-col`,
        `pl-5 pr-1 sm:pr-2 md:pr-3 lg:pr-4 xl:pr-6 2xl:pr-8`,
      )}>
       <RecommendedVideos video={video} />
      </div>
    </div>
  )
}
