"use server"

import { Credentials, listDatasets, whoAmI } from "@/lib/huggingface/hub/src"
import { ChannelInfo } from "@/types/general"

import { adminCredentials } from "../config"
import { parseChannel } from "./parseChannel"

export async function getPrivateChannels(options: {
  channelId?: string
  apiKey?: string
  owner?: string
  // ownerId?: string
  renewCache?: boolean
} = {}): Promise<ChannelInfo[]> {
  // console.log("getChannels")
  let credentials: Credentials = adminCredentials
  let owner = options?.owner || ""
  // let ownerId = options?.ownerId || ""

  if (options?.apiKey) {
    try {
      credentials = { accessToken: options.apiKey }
      const { id: userId, name: username } = await whoAmI({ credentials })
      if (!userId) {
        throw new Error(`couldn't get the id`)
      }
      if (!username) {
        throw new Error(`couldn't get the username`)
      }
      // everything is in order
      // ownerId = userId
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

  // console.log("search:", search)
  
  for await (const { id, name, likes, updatedAt } of listDatasets({
    search,
    credentials,
    requestInit: options?.renewCache
    ? { cache: "no-store" }
    : undefined
  })) {
    if (options.channelId && options.channelId !== id) {
      continue
    }

    // TODO: need to handle better cases where the username is missing

    const chunks = name.split("/")
    const [_datasetUser, datasetName] = chunks.length === 2
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

    const channel = await parseChannel({
      ...options,

      id,
      name,
      likes,
      updatedAt,

      // nope that doesn't work, it's the wrong owner
      // ownerId,
    })

    channels.push(channel)

    if (options.channelId && options.channelId === id) {
      break
    }
  }

  return channels
}
