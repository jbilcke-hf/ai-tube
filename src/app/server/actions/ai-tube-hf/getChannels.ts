"use server"

import { Credentials, downloadFile, listDatasets, whoAmI } from "@/huggingface/hub/src"
import { parseDatasetReadme } from "@/app/server/actions/utils/parseDatasetReadme"
import { ChannelInfo } from "@/types"

import { adminCredentials } from "../config"

export async function getChannels(options: {
  apiKey?: string
  owner?: string
  renewCache?: boolean
} = {}): Promise<ChannelInfo[]> {
  // console.log("getChannels")
  let credentials: Credentials = adminCredentials
  let owner = options?.owner

  if (options?.apiKey) {
    try {
      credentials = { accessToken: options.apiKey }
      const { name: username } = await whoAmI({ credentials })
      if (!username) {
        throw new Error(`couldn't get the username`)
      }
      // everything is in order,
      owner = username
    } catch (err) {
      console.error(err)
      return []
    }
  }

  let channels: ChannelInfo[] = []
  
  const prefix = "ai-tube-"

  let search = owner
    ? { owner } // search channels of a specific user
    : prefix // global search (note: might be costly?)

 
  for await (const { id, name, likes, updatedAt } of listDatasets({
    search,
    credentials,
    requestInit: options?.renewCache
    ? { cache: "no-store" }
    : undefined
  })) {

    // TODO: need to handle better cases where the username is missing

    const chunks = name.split("/")
    const [datasetUser, datasetName] = chunks.length === 2
      ? chunks
      : [name, name]

    // console.log(`found a candidate dataset "${datasetName}" owned by @${datasetUser}`)
    
    // ignore channels which don't start with ai-tube
    if (!datasetName.startsWith(prefix)) {
      continue
    }

    // ignore the video index
    if (datasetName === "ai-tube-index") {
      continue
    }

    const slug = datasetName.replaceAll(prefix, "")
    
    // console.log(`found an AI Tube channel: "${slug}"`)

    // TODO parse the README to get the proper label
    let label = slug.replaceAll("-", " ")

    let thumbnail = ""
    let prompt = ""
    let description = ""
    let voice = ""
    let tags: string[] = []

    // console.log(`going to read datasets/${name}`)
    try {
      const response = await downloadFile({
        repo: `datasets/${name}`,
        path: "README.md",
        credentials
      })
      const readme = await response?.text()

      const parsedDatasetReadme = parseDatasetReadme(readme)
      
      // console.log("parsedDatasetReadme: ", parsedDatasetReadme)

      prompt = parsedDatasetReadme.prompt
      label = parsedDatasetReadme.pretty_name
      description = parsedDatasetReadme.description
      thumbnail = parsedDatasetReadme.thumbnail || "thumbnail.jpg"

      thumbnail =
        thumbnail.startsWith("http")
          ? thumbnail
          : (thumbnail.endsWith(".jpg") || thumbnail.endsWith(".jpeg"))
          ? `https://huggingface.co/datasets/${name}/resolve/main/${thumbnail}`
          : ""

      voice = parsedDatasetReadme.voice

      tags = parsedDatasetReadme.tags
        .map(tag => tag.trim()) // clean them up
        .filter(tag => tag) // remove empty tags
      
    } catch (err) {
      // console.log("failed to read the readme:", err)
    }

    const channel: ChannelInfo = {
      id,
      datasetUser,
      datasetName,
      slug,
      label,
      description,
      thumbnail,
      prompt,
      likes,
      tags,
      updatedAt: updatedAt.toISOString()
    }

    channels.push(channel)
  }

  return channels
}
