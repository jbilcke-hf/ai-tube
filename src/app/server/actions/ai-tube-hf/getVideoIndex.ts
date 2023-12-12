import { VideoInfo, VideoStatus } from "@/types"

import { adminUsername } from "../config"

export async function getVideoIndex({
  status,
  renewCache = true,
  neverThrow = true,
}: {
  status: VideoStatus

  renewCache?: boolean
  neverThrow?: boolean
}): Promise<Record<string, VideoInfo>> {
  try {
    const response = await fetch(
      `https://huggingface.co/datasets/${adminUsername}/ai-tube-index/raw/main/${status}.json`
    , {
      cache: renewCache ? "no-store" : "default"
    })

    const jsonResponse = await response?.json()

    if (
      typeof jsonResponse === "undefined" ||
      typeof jsonResponse !== "object" ||
      Array.isArray(jsonResponse) ||
      jsonResponse === null) {
      throw new Error("index is not an object, admin repair needed")
    }

    const videos = jsonResponse as Record<string, VideoInfo>

    return videos
  } catch (err) {
    if (neverThrow) {
      console.error(`failed to get index ${status}:`, err)
      return {}
    }
    throw err
  }
}
