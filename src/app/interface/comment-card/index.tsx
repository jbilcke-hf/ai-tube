import { cn } from "@/lib/utils"
import { VideoComment } from "@/types"
import { useEffect, useState } from "react"
import { DefaultAvatar } from "../default-avatar"

export function CommentCard({
  comment,
  replies = []
}: {
  comment?: VideoComment,
  replies: VideoComment[]
}) {

  const [userThumbnail, setUserThumbnail] = useState(comment?.user?.thumbnail || "")

  useEffect(() => {
    setUserThumbnail(comment?.user?.thumbnail || "")
  
  }, [comment?.user?.thumbnail])

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
      `flex flex-col`,

    )}>
      {/* THE COMMENT INFO - HORIZONTAL */}
      <div className={cn(
      `flex flex-col`,

      )}>
          <div
          className={cn(
            `flex flex-col items-center justify-center`,
            `rounded-full overflow-hidden`,
            `w-26 h-26`
          )}
        >
         {comment.user.thumbnail
          ? <img
              src={comment.user.thumbnail}
              onError={handleBadUserThumbnail}
            />
          : <DefaultAvatar
              username={comment.user.userName}
              bgColor="#fde047"
              textColor="#1c1917"
              width={104}
              roundShape
            />}
        </div>
      </div>

      {/* THE REPLIES */}
      {/* TODO */}
    </div>
  )
}