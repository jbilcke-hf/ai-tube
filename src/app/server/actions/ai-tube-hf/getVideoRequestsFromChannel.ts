"use server"

import { ChannelInfo, VideoRequest } from "@/types"
import { getCredentials } from "./getCredentials"
import { listFiles } from "@/huggingface/hub/src"
import { parsePromptFileName } from "../utils/parsePromptFileName"
import { downloadFileAsText } from "./downloadFileAsText"
import { parseDatasetPrompt } from "../utils/parseDatasetPrompt"
import { parseVideoModelName } from "../utils/parseVideoModelName"
import { orientationToWidthHeight } from "../utils/orientationToWidthHeight"
import { parseProjectionFromLoRA } from "../utils/parseProjectionFromLoRA"

/**
 * Return all the videos requests created by a user on their channel
 *
 */
export async function getVideoRequestsFromChannel({
  channel,
  apiKey,
  renewCache,
  neverThrow,
}: {
  channel: ChannelInfo
  apiKey?: string
  renewCache?: boolean
  neverThrow?: boolean
}): Promise<VideoRequest[]> {

  try {
    const { credentials } = await getCredentials(apiKey)

    let videos: Record<string, VideoRequest> = {}

    const repo = `datasets/${channel.datasetUser}/${channel.datasetName}`

    // console.log(`scanning ${repo}`)

    for await (const file of listFiles({
      repo,
      // recursive: true,
      // expand: true,
      credentials,
      requestInit: renewCache
        ? { cache: "no-cache" }
        : undefined
    })) {

      // TODO we should add some safety mechanisms here:
      // skip lists of files that are too long
      // skip files that are too big
      // skip files with file.security.safe !== true

      // console.log("file.path:", file.path)
      /// { type, oid, size, path }
      if (file.path === "README.md") {
        // console.log("found the README")
        // TODO: read this readme
      } else if (file.path.startsWith("prompt_") && file.path.endsWith(".md")) {
        
        const id = parsePromptFileName(file.path)

        if (!id) { continue }

        const rawMarkdown = await downloadFileAsText({
          repo,
          path: file.path,
          apiKey,
          renewCache,
          neverThrow: true,
        })

        if (!rawMarkdown) {
          // console.log(`markdown file is empty, skipping`)
          continue
        }

        const {
          title,
          description,
          tags,
          prompt,
          thumbnail,
          model,
          lora,
          style,
          music,
          voice,
          orientation,
        } = parseDatasetPrompt(rawMarkdown, channel)

        if (!title || !description || !prompt) {
          // console.log("dataset prompt is incomplete or unparseable")
          continue
        }
        // console.log("prompt parsed markdown:", { title, description, tags })
        let thumbnailUrl =
          thumbnail.startsWith("http")
            ? thumbnail
            : (thumbnail.endsWith(".jpg") || thumbnail.endsWith(".jpeg"))
            ? `https://huggingface.co/${repo}/resolve/main/${thumbnail}`
            : ""

        
        const video: VideoRequest = {
          id,
          label: title,
          description,
          prompt,
          thumbnailUrl,
          model,
          lora,
          style,
          voice,
          music,
          updatedAt: file.lastCommit?.date || new Date().toISOString(),
          tags: Array.isArray(tags) && tags.length ? tags : channel.tags,
          channel,
          orientation,
          ...orientationToWidthHeight(orientation),
          duration: 0,
        }

        videos[id] = video

      } else if (file.path.endsWith(".mp4")) {
        // console.log("found a video:", file.path)
      }
    }

    return Object.values(videos)
  } catch (err) {
    if (neverThrow) {
      console.error(`getVideoRequestsFromChannel():`, err)
      return []
    } else {
      throw err
    }
  }
}
