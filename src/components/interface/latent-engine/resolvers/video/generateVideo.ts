export async function generateVideo({
  prompt,
  width,
  height,
  token,
}: {
  prompt: string
  width: number
  height: number
  token: string
}): Promise<string> {
  const requestUri = `/api/resolvers/video?t=${
    token
  }&w=${
    width
  }&h=${
    height
  }&p=${
    encodeURIComponent(prompt)
  }`
  const res = await fetch(requestUri)
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  return url
}