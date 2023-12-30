"use server"

import { ChannelInfo, UpdateQueueResponse } from "@/types/general"

import { aiTubeRobotApi } from "../config"

export async function updateQueue({
  channel,
  apiKey,
}: {
  channel?: ChannelInfo
  apiKey: string
}): Promise<number> {
  if (!apiKey) {
    throw new Error(`the apiKey is required`)
  }

  const res = await fetch(`${aiTubeRobotApi}/update-queue`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      // Authorization: `Bearer ${apiToken}`,
     },
    body: JSON.stringify({
      apiKey,
      channel
    }),
    cache: 'no-store',
    // we can also use this (see https://vercel.com/blog/vercel-cache-api-nextjs-cache)
    // next: { revalidate: 1 }
  })

  if (res.status !== 200) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }
  
  const response = (await res.json()) as UpdateQueueResponse
  // console.log("response:", response)
  return response.nbUpdated
}