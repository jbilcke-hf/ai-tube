"use server"

import { ChannelInfo } from "@/types"

import { adminUsername } from "../config"

export async function getChannels({
  channelId = "",
  renewCache = true,
  neverThrow = true
}: {
  channelId?: string
  renewCache?: boolean
  neverThrow?: boolean
} = {}): Promise<ChannelInfo[]> {
  try {
    const response = await fetch(
      `https://huggingface.co/datasets/${adminUsername}/ai-tube-index/raw/main/channels.json`
    , {
      cache: renewCache ? "no-store" : "default"
    })

    const jsonResponse = await response?.json()

    if (
      typeof jsonResponse === "undefined" ||
      typeof jsonResponse !== "object" ||
      Array.isArray(jsonResponse) ||
      jsonResponse === null) {
      throw new Error("index is not an object, admin repair needed")
    }

    const channelsIndex = (jsonResponse as Record<string, ChannelInfo>) || {}

    const channels = Object.values(channelsIndex)

    if (!channelId) { return channels }

    return channels.filter(channel => channel.id === channelId)
  } catch (err) {
    if (neverThrow) {
      console.error(`failed to get the channel index:`, err)
      return []
    }
    throw err
  }
}
