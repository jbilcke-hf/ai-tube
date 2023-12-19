import { cn } from "@/lib/utils"
import { CommentInfo } from "@/types"
import { useEffect, useState } from "react"
import { DefaultAvatar } from "../default-avatar"
import { formatTimeAgo } from "@/lib/formatTimeAgo"
import { CommentWithTimeSeeks } from "./time-seeker"

export function CommentCard({
  comment,
  replies = []
}: {
  comment?: CommentInfo,
  replies: CommentInfo[]
}) {

  const isLongContent = (comment?.message.length || 0) > 370

  const [userThumbnail, setUserThumbnail] = useState(comment?.userInfo?.thumbnail || "")
  const [isExpanded, setExpanded] = useState(false)

  useEffect(() => {
    setUserThumbnail(comment?.userInfo?.thumbnail || "")
  
  }, [comment?.userInfo?.thumbnail])

  if (!comment) { return null }

  const handleBadUserThumbnail = () => {
    try {
      if (userThumbnail) {
        setUserThumbnail("")
      }
    } catch (err) {
      
    }
  }

  return (
    <div className={cn(
      `flex flex-col w-full`,

    )}>
      {/* THE COMMENT INFO - HORIZONTAL */}
      <div className={cn(
      `flex flex-row w-full`,
      // `space-x-3`

      )}>
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
                username={comment?.userInfo?.userName}
                bgColor="#fde047"
                textColor="#1c1917"
                width={36}
                roundShape
              />}
        </div>

        {/* USER INFO AND ACTUAL MESSAGE */}
        <div
          className={cn(
            `flex flex-col items-start justify-center`,
            `space-y-1.5`,
          )}
        >
          <div className="flex flex-row space-x-3">
            <div className="text-xs font-medium text-zinc-100">@{comment?.userInfo?.userName}</div>
            <div className="text-xs font-medium text-neutral-400">{formatTimeAgo(comment.updatedAt)}</div>
          </div>
          <CommentWithTimeSeeks
            className={cn(
              `text-sm font-normal`,
              `shrink`,
              `overflow-hidden break-words`,
              isExpanded ? `` : `line-clamp-4`
            )}
            linkClassName="font-medium text-neutral-400 cursor-pointer hover:underline"
            onSeek={(timeInSec) => {
              try {
                const videoElement: HTMLVideoElement | undefined = (document.getElementsByClassName("tuby-container")?.[0]?.children?.[0] as any)
                if (videoElement) {
                  videoElement.currentTime = timeInSec
                }
              } catch (err) {
                // 
              }
            }}>{
            comment.message
          }</CommentWithTimeSeeks>
          {isLongContent && 
            <div className={cn(
            `flex`,
            `text-sm font-medium text-neutral-400`,
            `cursor-pointer`,
            `hover:underline`
            )}
            onClick={() => {
              setExpanded(!isExpanded)
            }}
            >
              {isExpanded ? 'Read less' : 'Read more'}
            </div>}
        </div>
      </div>

      {/* THE REPLIES */}
      {/* TODO */}
    </div>
  )
}