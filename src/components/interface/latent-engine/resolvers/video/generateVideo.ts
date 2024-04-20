export async function generateVideo(prompt: string): Promise<string> {
  const requestUri = `/api/resolvers/video?p=${encodeURIComponent(prompt)}`
  const res = await fetch(requestUri)
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  return url

}