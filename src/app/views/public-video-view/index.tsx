"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { RiCheckboxCircleFill } from "react-icons/ri"
import { PiShareFatLight } from "react-icons/pi"
import { BsHeadsetVr } from "react-icons/bs"
import CopyToClipboard from "react-copy-to-clipboard"
import { LuCopyCheck } from "react-icons/lu"
import { LuScrollText } from "react-icons/lu"
import { BiCameraMovie } from "react-icons/bi"
import { useLocalStorage } from "usehooks-ts"

import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils"

import { ActionButton, actionButtonClassName } from "@/app/interface/action-button"
import { RecommendedVideos } from "@/app/interface/recommended-videos"
import { isCertifiedUser } from "@/app/certification"
import { countNewMediaView } from "@/app/server/actions/stats"
import { formatTimeAgo } from "@/lib/formatTimeAgo"
import { DefaultAvatar } from "@/app/interface/default-avatar"
import { LikeButton } from "@/app/interface/like-button"

import { ReportModal } from "../report-modal"
import { formatLargeNumber } from "@/lib/formatLargeNumber"
import { CommentList } from "@/app/interface/comment-list"
import { Input } from "@/components/ui/input"

import { localStorageKeys } from "@/app/state/localStorageKeys"
import { defaultSettings } from "@/app/state/defaultSettings"
import { getComments, submitComment } from "@/app/server/actions/comments"
import { useCurrentUser } from "@/app/state/useCurrentUser"
import { parseMediaProjectionType } from "@/lib/parseMediaProjectionType"
import { MediaPlayer } from "@/app/interface/media-player"

// TODO: rename to PublicMediaView
export function PublicVideoView() {
  const [_pending, startTransition] = useTransition()

  const [commentDraft, setCommentDraft] = useState("")
  const [isCommenting, setCommenting] = useState(false)
  const [isFocusedOnInput, setFocusedOnInput] = useState(false)

  // current time in the media
  // note: this is used to *set* the current time, not to read it
  // EDIT: you know what, let's do this the dirty way for now
  // const [desiredCurrentTime, setDesiredCurrentTime] = useState()

  const { user } = useCurrentUser()

  const [userThumbnail, setUserThumbnail] = useState("")
  
  useEffect(() => {
    setUserThumbnail(user?.thumbnail || "")
  
  }, [user?.thumbnail])

  const handleBadUserThumbnail = () => {
    if (userThumbnail) {
      setUserThumbnail("")
    }
  }


  const media = useStore(s => s.publicVideo)

  const mediaId = `${media?.id || ""}`

  const [copied, setCopied] = useState<boolean>(false)

  const [channelThumbnail, setChannelThumbnail] = useState(`${media?.channel.thumbnail || ""}`)
  const setPublicVideo = useStore(s => s.setPublicVideo)

  const publicComments = useStore(s => s.publicComments)

  const setPublicComments = useStore(s => s.setPublicComments)

  const isEquirectangular = parseMediaProjectionType(media) === "equirectangular"
  
  // we inject the current videoId in the URL, if it's not already present
  // this is a hack for Hugging Face iframes
  useEffect(() => {
    const queryString = new URL(location.href).search
    const searchParams = new URLSearchParams(queryString)
    if (mediaId) {
      // TODO: the "v" parameter is legacy, it made sense in the past when
      // AiTube used to only support traditional videos
      if (searchParams.get("v") !== mediaId || searchParams.get("m") !== mediaId) {
        console.log(`current mediaId "${mediaId}" isn't set in the URL query params.. TODO we should set it`)
        
        // searchParams.set("m", mediaId)
        // location.search = searchParams.toString()
      }
    } else {
      // searchParams.delete("m")
      // location.search = searchParams.toString()
    }
  }, [mediaId])

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    }
  }, [copied])


  const handleBadChannelThumbnail = () => {
    if (channelThumbnail) {
      setChannelThumbnail("")
    }
  }

  useEffect(() => {
    startTransition(async () => {
      if (!media || !media.id) {
        return
      }
      const numberOfViews = await countNewMediaView(mediaId)

      setPublicVideo({
        ...media,
        numberOfViews
      })
    })

  }, [media?.id])


  useEffect(() => {
    startTransition(async () => {
      if (!media || !media.id) {
        return
      }
      const comments = await getComments(mediaId)
      setPublicComments(comments)
    })

  }, [media?.id])

  const [huggingfaceApiKey] = useLocalStorage<string>(
    localStorageKeys.huggingfaceApiKey,
    defaultSettings.huggingfaceApiKey
  )
  
  /*
  useEffect(() => {
    window.addEventListener("keydown", function (e) {
      if (e.code === "Space") {
        e.preventDefault();
      }
    })
  }, [])
  */
  if (!media) { return null }

  const handleSubmitComment = () => {

    startTransition(async () => {
      if (!commentDraft || !huggingfaceApiKey || !mediaId) { return }
    
      const limitedSizeComment = commentDraft.trim().slice(0, 1024).trim()

      const comment = await submitComment(media.id, limitedSizeComment, huggingfaceApiKey)

      setPublicComments(
        [comment].concat(publicComments)
      )

      setCommentDraft("")
      setFocusedOnInput(false)
      setCommenting(false)
    })
  }
  
  return (
    <div className={cn(
      `w-full`,
      `flex flex-col lg:flex-row`
    )}>
      <div className={cn(
        `flex-grow`,
        `flex flex-col`,
        `transition-all duration-200 ease-in-out`,
        `px-2 xl:px-0`
      )}>
        {/** AI MEDIA PLAYER - HORIZONTAL */}
        <MediaPlayer
          media={media}
          enableShortcuts={!isFocusedOnInput}

          // that could be, but let's do it the dirty way for now
          // currentTime={desiredCurrentTime}

          className="rounded-xl overflow-hidden mb-4"
        />

        {/** AI MEDIA TITLE - HORIZONTAL */}
        <div className={cn(
          `flex flex-row space-x-2`,
          `transition-all duration-200 ease-in-out`,
          `text-lg lg:text-xl text-zinc-100 font-medium mb-0 line-clamp-2`,
          `mb-2`,
        )}>
          <div className="">{media.label}</div>
          {/*
          <div className={cn(
            `flex flex-row`, // `inline-block`,
            `bg-neutral-700 text-neutral-300 rounded-lg`,
            // `items-center justify-center`,
            `text-center`,
            `px-1.5 py-0.5`,
            `text-xs`
            )}>
            AI Media Model: {media.model || "HotshotXL"}
          </div>
          */}
        </div>
        
        {/** MEDIA TOOLBAR - HORIZONTAL */}
        <div className={cn(
          `flex flex-col space-y-3 xl:space-y-0 xl:flex-row`,
          `transition-all duration-200 ease-in-out`,
          `items-start xl:items-center`,
          `justify-between`,
          `mb-2 lg:mb-3`,
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
              href={`https://huggingface.co/datasets/${media.channel.datasetUser}/${media.channel.datasetName}`}
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
                    username={media.channel.datasetUser}
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
              href={`https://huggingface.co/datasets/${media.channel.datasetUser}/${media.channel.datasetName}`}
              target="_blank">
              <div className={cn(
                `flex flex-row items-center`,
                `transition-all duration-200 ease-in-out`,
                `text-zinc-100 text-sm lg:text-base font-medium space-x-1`,
                )}>
                <div>{media.channel.label}</div>
                {isCertifiedUser(media.channel.datasetUser) ? <div className="text-sm text-neutral-400"><RiCheckboxCircleFill className="" /></div> : null}
              </div>
              <div className={cn(
                `flex flex-row items-center`,
                `text-neutral-400 text-xs font-normal space-x-1`,
                )}>
                <div>{
                  // TODO implement the follower system
                  formatLargeNumber(0)
                } followers</div>
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

            <LikeButton media={media} />

            {/* SHARE */}
            <div className={cn(
              `flex flex-row`,
              `items-center`
            )}>
              <CopyToClipboard
                text={`${process.env.NEXT_PUBLIC_DOMAIN}/watch?v=${media.id}`}
                onCopy={() => setCopied(true)}>
                <div className={cn(
                  actionButtonClassName,
                  `bg-neutral-700/50 hover:bg-neutral-700/90 text-zinc-100`
                )}>
                  <div className="flex items-center justify-center">
                    {
                      copied ? <LuCopyCheck className="w-5 h-5" />
                      : <PiShareFatLight className="w-6 h-6" />
                    }
                  </div>
                  <span>
                      {copied ? "Copied!" : "Share"}
                  </span>
                </div>
              </CopyToClipboard>
            </div>

            <ActionButton
              href={
                media.model === "LaVie"
                ? "https://huggingface.co/vdo/LaVie"
                : media.model === "SVD"
                ? "https://huggingface.co/stabilityai/stable-video-diffusion-img2vid"
                : "https://huggingface.co/hotshotco/Hotshot-XL"
              }
            >
              <BiCameraMovie className="w-5 h-5" />
              <span className="hidden 2xl:inline">
                Made with {media.model}
              </span>
              <span className="inline 2xl:hidden">
                {media.model}
              </span>
            </ActionButton>

            {isEquirectangular && <ActionButton
              href={`/api/video/${media.id}`}
            >
              <BsHeadsetVr className="w-5 h-5" />
              <span>
                See in VR
              </span>
            </ActionButton>}

            <ActionButton
              href={
                `https://huggingface.co/datasets/${
                  media.channel.datasetUser
                }/${
                  media.channel.datasetName
                }/raw/main/prompt_${
                  media.id
                }.md`
              }
            >
              <LuScrollText className="w-5 h-5" />
              <span>
                Source
              </span>
            </ActionButton>

            <ReportModal media={media} />

          </div>

        </div>

        {/** MEDIA DESCRIPTION - VERTICAL */}
        <div className={cn(
          `flex flex-col p-3`,
          `transition-all duration-200 ease-in-out`,
          `rounded-xl`,
          `bg-neutral-700/50`,
          `text-sm text-zinc-100`,
        )}>

          {/* DESCRIPTION BLOCK */}
          <div className="flex flex-row space-x-2 font-medium mb-1">
            <div>{formatLargeNumber(media.numberOfViews)} views</div>
            <div>{formatTimeAgo(media.updatedAt).replace("about ", "")}</div>
          </div>
          <p>{media.description}</p>
        </div>

        {/* COMMENTS */}
        <div className={cn(
          `flex-col font-medium mb-1 py-6`,
        )}>

          <div className="flex flex-row text-xl text-zinc-100 w-full mb-4">
            {Number(publicComments?.length || 0).toLocaleString()} Comment{
            Number(publicComments?.length || 0) === 1 ? '' : 's'
            }
          </div>
          
          {/* COMMENT INPUT BLOCK - HORIZONTAL */}
          {user && <div className="flex flex-row w-full">
            
            {/* AVATAR */}
            <div 
              // className="flex flex-col w-10 pr-13 overflow-hidden"
              className="flex flex-none flex-col w-10 pr-13 overflow-hidden">
              {
              userThumbnail ? 
                <div className="flex w-9 rounded-full overflow-hidden">
                  <img
                    src={userThumbnail}
                    onError={handleBadUserThumbnail}
                  />
              </div>
              : <DefaultAvatar
                  username={user?.userName}
                  bgColor="#fde047"
                  textColor="#1c1917"
                  width={36}
                  roundShape
                />}
            </div>

            {/* COMMENT INPUTS AND BUTTONS - VERTICAL */}
            <div className="flex flex-col flex-grow">
              <Input
                placeholder="Add a comment.."
                type="text"
                className={cn(
                  `w-full`,
                  `rounded-none`,
                  `bg-transparent dark:bg-transparent`,
                  `border-l-transparent border-r-transparent border-t-transparent dark:border-l-transparent dark:border-r-transparent dark:border-t-transparent`,
                  `border-b border-b-zinc-600 dark:border-b dark:border-b-zinc-600`,
                  `hover:pt-[2px] hover:pb-[1px] hover:border-b-2 hover:border-b-zinc-200 dark:hover:border-b-2 dark:hover:border-b-zinc-200`,
                  
                  `outline-transparent ring-transparent ring-offset-transparent`,
                  `dark:outline-transparent dark:ring-transparent dark:ring-offset-transparent`,
                  `focus-visible:outline-transparent focus-visible:ring-transparent focus-visible:ring-offset-transparent`,
                  `dark:focus-visible:outline-transparent dark:focus-visible:ring-transparent dark:focus-visible:ring-offset-transparent`,
                  
                  `font-normal`,
                  `pl-0 h-8`,

                  `mb-3`
                )}
                onChange={(x) => {
                  if (!isFocusedOnInput) {
                    setFocusedOnInput(true)
                  }
                  if (!isCommenting) {
                    setCommenting(true)
                  }
                  setCommentDraft(x.target.value)
                }}
                value={commentDraft}
                onFocus={() => {
                  if (!isFocusedOnInput) {
                    setFocusedOnInput(true)
                  }
                  if (!isCommenting) {
                    setCommenting(true)
                  }
                }}

                onBlur={() => {
                  setFocusedOnInput(false)
                }}
                onKeyDown={({ key }) => {
                  if (key === 'Enter') {
                    handleSubmitComment()
                  } else {
                    if (!isFocusedOnInput) {
                      setFocusedOnInput(true)
                    }
                    if (!isCommenting) {
                      setCommenting(true)
                    }
                  }
                }}
              />
          
              <div className={cn(
                `flex-row space-x-3 w-full justify-end`,
                isCommenting ? `flex` : `hidden`
              )}>
                <div className="flex flex-row space-x-3">
                <ActionButton
                  variant="ghost"
                  onClick={() => {
                    setCommentDraft("")
                    setCommenting(false)
                    setFocusedOnInput(false)
                  }}
                  >Cancel</ActionButton>
                <ActionButton
                  variant={commentDraft ? "primary" : "secondary"}
                  onClick={handleSubmitComment}
                  >Comment</ActionButton>
                </div>
              </div>
            </div>
          </div>}

          <CommentList
            comments={publicComments}
          />
        </div>

      </div>

      <div className={cn(

        // this one is very important to make sure the right panel is not compressed
        `flex flex-col`,
        `flex-none`,
        `pl-2 lg:pl-4 lg:pr-2`,

        `w-full md:w-[360px] lg:w-[400px] xl:w-[450px]`,
        `transition-all duration-200 ease-in-out`,
      )}>
       <RecommendedVideos media={media} />
      </div>
    </div>
  )
}
