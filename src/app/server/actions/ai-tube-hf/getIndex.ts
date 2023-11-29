import { downloadFile } from "@/huggingface/hub/src"
import { VideoInfo, VideoStatus } from "@/types"

import { adminCredentials, adminUsername } from "../config"

export async function getIndex({
  status,
  renewCache,
}: {
  status: VideoStatus

  /**
   * Renew the cache
   * 
   * This is was the batch job daemon will use, as in normal time
   * we will want to use the cache since the file might be large
   * 
   * it is also possible that we decide to *never* renew the cache from a user's perspective,
   * and only renew it manually when a video changes status
   * 
   * that way user requests will always be snappy!
   */
  renewCache?: boolean
}): Promise<Record<string, VideoInfo>> {

  // grab the current video index
  const response = await downloadFile({
    credentials: adminCredentials,
    repo: `datasets/${adminUsername}/ai-tube-index`,
    path: `${status}.json`,
    
  })

  // attention, this list might grow, especially the "published" one
  // published videos should be put in a big dataset folder of files
  // named "<id>.json" and "<id>.mp4" like in VideoChain
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
}
