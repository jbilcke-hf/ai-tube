import { VideoInfo, VideoStatus } from "@/types"

import { adminUsername } from "../config"

export async function getIndex({
  status,
  renewCache,
}: {
  status: VideoStatus

  renewCache?: boolean
}): Promise<Record<string, VideoInfo>> {
  try {
    const response = await fetch(
      `https://huggingface.co/datasets/${adminUsername}/ai-tube-index/raw/main/${status}.json`
    , {
      cache: "no-store"
    })

    const jsonResponse = await response?.json()

    if (
      typeof jsonResponse === "undefined" &&
      typeof jsonResponse !== "object" &&
      Array.isArray(jsonResponse) ||
      jsonResponse === null) {
      throw new Error("index is not an object, admin repair needed")
    }

    const videos = jsonResponse as Record<string, VideoInfo>

    return videos
  } catch (err) {
    console.error(`failed to get index ${status}:`, err)
    return {}
  }
}
