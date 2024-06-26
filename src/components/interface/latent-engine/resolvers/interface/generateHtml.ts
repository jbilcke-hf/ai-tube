import { aitubeApiUrl } from "../../core/config"

export async function generateHtml(prompt: string): Promise<string> {
  const requestUri = `${aitubeApiUrl}/api/resolvers/interface?p=${encodeURIComponent(prompt)}`

  // console.log(`generateHtml: calling ${requestUri}`)

  const res = await fetch(requestUri)

  const dangerousHtml = await res.text()

  return dangerousHtml
}