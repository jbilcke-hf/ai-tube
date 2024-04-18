import { RenderedScene } from "@/types/general"

export async function generateImage(prompt: string): Promise<string> {
  const requestUri = `/api/resolvers/image?p=${encodeURIComponent(prompt)}`

  const res = await fetch(requestUri)

  const scene = (await res.json()) as RenderedScene

  if (scene.error || scene.status !== "completed") {
    throw new Error(scene.error)
  }

  return scene.assetUrl
}