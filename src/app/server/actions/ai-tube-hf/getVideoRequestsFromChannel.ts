"use server"

import { Credentials, downloadFile, listFiles, whoAmI } from "@/huggingface/hub/src"
import { parseDatasetReadme } from "@/app/server/actions/utils/parseDatasetReadme"
import { ChannelInfo, VideoRequest } from "@/types"

import { adminCredentials } from "../config"

/**
 * Return all the videos requests created by a user on their channel
 * 
 * @param options 
 * @returns 
 */
export async function getVideoRequestsFromChannel(options: {
  channel: ChannelInfo,
  apiKey?: string,
  renewCache?: boolean
}): Promise<Record<string, VideoRequest>> {

  let credentials: Credentials = adminCredentials

  if (options?.apiKey) {
    try {
      credentials = { accessToken: options.apiKey }
      const { name: username } = await whoAmI({ credentials })
      if (!username) {
        throw new Error(`couldn't get the username`)
      }
    } catch (err) {
      console.error(err)
      return {}
    }
  }

  let videos: Record<string, VideoRequest> = {}

  const repo = `datasets/${options.channel.datasetUser}/${options.channel.datasetName}`

  console.log(`scanning ${repo}`)

  for await (const file of listFiles({
    repo,
    // recursive: true,
    // expand: true,
    credentials,
    requestInit: {
      // cache invalidation should be called right after adding a new video
      cache: options?.renewCache ? "no-cache" : "default",
      next: {
        revalidate: 10, // otherwise we only update very 10 seconds by default
        // tags: [] // tags used for cache invalidation (ie. this is added to the cache key)
      }
    }
  })) {

    // TODO we should add some safety mechanisms here:
    // skip lists of files that are too long
    // skip files that are too big
    // skip files with file.security.safe !== true

     console.log("file.path:", file.path)
    /// { type, oid, size, path }
    if (file.path === "README.md") {
      console.log("found the README")
      // TODO: read this readme
    } else if (file.path.startsWith("prompt_") && file.path.endsWith(".txt")) {
      console.log("yes!!")
      const fileWithoutSuffix = file.path.split(".txt").shift() || ""
      const words = fileWithoutSuffix.split("_")
      console.log("debug:", { path: file.path, fileWithoutSuffix, words })
      if (words.length !== 3) {
        console.log("found an invalid prompt file format: " + file.path)
        continue
      }
      const [_prefix, date, id] = words
      console.log("found a prompt:", file.path)

      try {
        const response = await downloadFile({
          repo,
          path: file.path,
          credentials
        })
        const rawMarkdown = await response?.text()
  
        const parsedDatasetReadme = parseDatasetReadme(rawMarkdown)
        console.log("prompt parsed markdown:", parsedDatasetReadme)
      } catch (err) {
        console.log("failed to parse the prompt file")
        continue
      }
      const video: VideoRequest = {
        id,
        label: "",
        description: "",
        prompt: "",
        thumbnailUrl: "",

        updatedAt: file.lastCommit?.date || "",
        tags: [], // read them from the file?
        channel: options.channel
      }

      videos[id] = video
    } else if (file.path.endsWith(".mp4")) {
      console.log("found a video:", file.path)
    }
  }

  return videos
}
