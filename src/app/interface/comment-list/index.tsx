"use client"

import { cn } from "@/lib/utils"
import { VideoComment } from "@/types"
import { CommentCard } from "../comment-card"

export function CommentList({
  comments = []
}: {
  comments: VideoComment[]
}) {

  return (
    <div className={cn(
      `flex flex-col`,
      `w-full space-y-4`
    )}>
      {comments.map(comment => (
        <CommentCard
          key={comment.id}
          comment={comment}
          replies={[]}
        />
      ))}
    </div>
  )
}