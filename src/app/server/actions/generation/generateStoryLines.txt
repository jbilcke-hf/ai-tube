"use server"

import { Story, StoryLine, TTSVoice } from "@/types"

const instance = `${process.env.AI_BEDTIME_STORY_API_GRADIO_URL || ""}`
const secretToken = `${process.env.AI_BEDTIME_STORY_API_SECRET_TOKEN || ""}`

export async function generateStoryLines(prompt: string, voice: TTSVoice): Promise<StoryLine[]> {
  if (!prompt?.length) {
    throw new Error(`prompt is too short!`)
  }

  const cropped = prompt.slice(0, 30)
  console.log(`user requested "${cropped}${cropped !== prompt ? "..." : ""}"`)

  // positivePrompt = filterOutBadWords(positivePrompt)

  const res = await fetch(instance + (instance.endsWith("/") ? "" : "/") + "api/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      fn_index: 0, // <- important!
      data: [
        secretToken,
        prompt,
        voice,
      ],
    }),
    cache: "no-store",
    // we can also use this (see https://vercel.com/blog/vercel-cache-api-nextjs-cache)
    // next: { revalidate: 1 }
  })


  const rawJson = await res.json()
  const data = rawJson.data as StoryLine[][]

  const stories = data?.[0] || []

  if (res.status !== 200) {
    throw new Error('Failed to fetch data')
  }

  return stories.map(line => ({
    text: line.text.replaceAll(" .", ".").replaceAll(" ?", "?").replaceAll(" !", "!").trim(),
    audio: line.audio
  }))
}