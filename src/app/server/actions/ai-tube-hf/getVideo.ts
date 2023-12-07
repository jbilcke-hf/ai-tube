"use server"

import { VideoInfo } from "@/types"

import { getIndex } from "./getIndex"

export async function getVideo({
  videoId,
  neverThrow,
}: {
  videoId?: string | string[] | null,
  neverThrow?: boolean
}): Promise<VideoInfo | undefined> {
  try {
    const id = `${videoId || ""}`

    if (!id) {
      throw new Error(`cannot get the video, invalid id: "${id}"`)
    }
    const published = await getIndex({ status: "published" })

    const video = published[id] || undefined

    if (!video) {
      throw new Error(`cannot get the video, nothing found for id "${id}"`)
    }

    return video
  } catch (err) {
    if (neverThrow) {
      return undefined
    }
    throw err
  }
}