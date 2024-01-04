"use server"

import { ChannelInfo, VideoRequest } from "@/types/general"
import { getCredentials } from "./getCredentials"
import { listFiles } from "@/huggingface/hub/src"
import { parsePromptFileName } from "../utils/parsePromptFileName"
import { downloadFileAsText } from "./downloadFileAsText"
import { parseDatasetPrompt } from "../utils/parseDatasetPrompt"
import { computeOrientationProjectionWidthHeight } from "../utils/computeOrientationProjectionWidthHeight"
import { downloadClapProject } from "./downloadClapProject"

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
      try {
        const filePath = file.path.toLowerCase().trim()
        // TODO we should add some safety mechanisms here:
        // skip lists of files that are too long
        // skip files that are too big
        // skip files with file.security.safe !== true

        // console.log("file.path:", file.path)
        /// { type, oid, size, path }
        if (filePath === "readme.md") {
          // console.log("found the README")
          // TODO: read this readme
        } else if (filePath.endsWith(".clap")) {
          const clap = await downloadClapProject({
            path: file.path,
            channel,
            credentials,
          })
          console.log("got a clap file:", clap.clapProject.meta)
          
          // in the frontend UI we want to display everything,
          // we don't filter stuff even if they are incomplete

          videos[clap.videoRequest.id] = clap.videoRequest
        } else if (filePath.startsWith("prompt_") && filePath.endsWith(".md")) {
          
          const id = parsePromptFileName(filePath)

          if (!id) { continue }

          const rawMarkdown = await downloadFileAsText({
            repo,
            path: file.path, // be sure to use the original file.path (with capitalization if any) and not filePath
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

          /*
          on ai-tube side (not the ai-tube robot) we are okay with partial video requests,
          ie. drafts
          if (!title || !description || !prompt) {
            // console.log("dataset prompt is incomplete or unparseable")
            // continue
          }
          */

          // console.log("prompt parsed markdown:", { title, description, tags })
          let thumbnailUrl =
            thumbnail.startsWith("http")
              ? thumbnail
              : (thumbnail.endsWith(".webp") || thumbnail.endsWith(".jpg") || thumbnail.endsWith(".jpeg"))
              ? `https://huggingface.co/${repo}/resolve/main/${thumbnail}`
              : ""

          // TODO: the clap file is empty if
          // the video is prompted using Markdown
          const clapUrl = ""

          const video: VideoRequest = {
            id,
            label: title,
            description,
            prompt,
            thumbnailUrl,
            clapUrl,
            model,
            lora,
            style,
            voice,
            music,
            updatedAt: file.lastCommit?.date || new Date().toISOString(),
            tags: Array.isArray(tags) && tags.length ? tags : channel.tags,
            channel,
            duration: 0,
            ...computeOrientationProjectionWidthHeight({
              lora,
              orientation,
              // projection, // <- will be extrapolated from the LoRA for now
            }),
          }

          videos[id] = video

        } else if (filePath.endsWith(".mp4")) {
          // console.log("found a video:", file.path)
        }
      } catch (err) {
        console.error("error while processing a dataset file:")
        console.error(err)
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
