"use client"

import { cn } from "@/lib/utils/cn"
import { CommentInfo } from "@/types/general"
import { CommentCard } from "../comment-card"

export function CommentList({
  comments = []
}: {
  comments: CommentInfo[]
}) {

  return (
    <div className={cn(
      `flex flex-col`,
      `pt-6`,
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