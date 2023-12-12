"use server"

import { getVideoIndex } from "./getVideoIndex"

export async function getTags({
  renewCache = true,
  neverThrow = true,
}: {
  renewCache?: boolean
  neverThrow?: boolean
} = {
  renewCache: true,
  neverThrow: true,
}): Promise<string[]> {
  try {
    const published = Object.values(await getVideoIndex({
      status: "published",
      renewCache,
    }))

    const tags: Record<string, number> = {}
    for (const video of published) {
      for (const tag of video.tags) {
        const key = tag.trim().toLowerCase()
        tags[key] = 1 + (tags[key] || 0)
      }
    }

    return Object.entries(tags).sort((a, b) => b[1] - a[1]).map(i => i[0])
  } catch (err) {
    if (neverThrow) {
      return []
    }
    throw err
  }
}