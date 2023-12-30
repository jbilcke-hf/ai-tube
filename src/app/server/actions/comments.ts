"use server"

import { v4 as uuidv4 } from "uuid"

import { CommentInfo, StoredCommentInfo } from "@/types/general"
import { stripHtml } from "@/lib/stripHtml"
import { getCurrentUser, getUsers } from "./users"
import { redis } from "./redis"

export async function submitComment(videoId: string, rawComment: string, apiKey: string): Promise<CommentInfo> {

  // trim, remove HTML, limit the length
  const message = stripHtml(rawComment).trim().slice(0, 1024).trim()

  if (!message) { throw new Error("comment is empty") }

  const user = await getCurrentUser(apiKey)

  const storedComment: StoredCommentInfo = {
    id: uuidv4(),
    userId: user.id,
    inReplyTo: undefined, // undefined means in reply to OP
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    message,
    numberOfLikes: 0,
    numberOfReplies: 0,
    likedByOriginalPoster: false,
  }

  await redis.lpush(`videos:${videoId}:comments`, storedComment)

  const fullComment: CommentInfo = {
    ...storedComment,
    userInfo: {
      ...user,

      // important: we erase all information about the API token!
      hfApiToken: undefined,
    },
  }

  return fullComment
}


export async function getComments(videoId: string): Promise<CommentInfo[]> {
  try {
    const rawList = await redis.lrange<StoredCommentInfo>(`videos:${videoId}:comments`, 0, 100)

    const storedComments = Array.isArray(rawList) ? rawList : []

    const usersById = await getUsers(storedComments.map(u => u.userId))

    const comments: CommentInfo[] = storedComments.map(storedComment => ({
      ...storedComment,
      userInfo: (usersById as any)[storedComment.userId] || undefined,
    }))

    return comments
  } catch (err) {
    return []
  }
}
