import { RenderedScene } from "@/types/general"

export async function generateVideo(prompt: string): Promise<string> {
  const requestUri = `/api/resolvers/video?p=${encodeURIComponent(prompt)}`

  // console.log(`generateVideo: calling ${requestUri}`)

  const res = await fetch(requestUri)

  const scene = (await res.json()) as RenderedScene

  if (scene.error || scene.status !== "completed") {
    throw new Error(scene.error)
  }

  return scene.assetUrl
}