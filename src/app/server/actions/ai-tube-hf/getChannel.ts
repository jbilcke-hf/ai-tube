"use server"


import { ChannelInfo } from "@/types"

import { getChannels } from "./getChannels"

export async function getChannel(options: {
  channelId?: string | string[] | null
  // apiKey?: string // deprecated, we only work on public content
  // owner?: string // deprecated, we only work on public content
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
      // apiKey: options?.apiKey, // deprecated, we only work on public content
      // owner: options?.owner, // deprecated, we only work on public content
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
