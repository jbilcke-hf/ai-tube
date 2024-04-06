
import { MediaInfo } from "@/types/general"

import { deleteFileFromDataset } from "./deleteFileFromDataset"
import { formatPromptFileName } from "../utils/formatPromptFileName"

export async function deleteVideoRequest({
  video,
  apiKey,
  neverThrow,
}: {
   video: MediaInfo
   apiKey: string
   neverThrow?: boolean
}): Promise<boolean> {
  const repo = `datasets/${video.channel.datasetUser}/${video.channel.datasetName}`
  const { fileName } = formatPromptFileName(video.id)
  return deleteFileFromDataset({
    repo,
    path: fileName,
    apiKey,
    neverThrow,
  })
}