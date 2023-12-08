"use server"


import { ChannelInfo } from "@/types"

import { getChannels } from "./getChannels"

export async function getChannel(options: {
  channelId?: string | string[] | null
  apiKey?: string
  owner?: string
  renewCache?: boolean
  neverThrow?: boolean
} = {}): Promise<ChannelInfo | undefined> {
  try {
    const id = `${options?.channelId || ""}`
    if (!id) {
      throw new Error(`invalid channel id: "${id}"`)
    }

    const channels = await getChannels({
      channelId: id,
      apiKey: options?.apiKey,
      owner: options?.owner,
      renewCache: options.renewCache,
    })

    if (channels.length === 1) {
      return channels[0]
    }

    throw new Error(`couldn't find channel ${options.channelId}`)
  } catch (err) {
    if (options.neverThrow) {
      return undefined
    }

    throw err
  }
}
