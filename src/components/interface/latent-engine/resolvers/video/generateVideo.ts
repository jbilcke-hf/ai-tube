import { aitubeApiUrl } from "../../core/config"

export async function generateVideo({
  prompt,
  width,
  height,
  token,
  mode = "data-uri",
}: {
  prompt: string
  width: number
  height: number
  token: string

  // data-uri are good for small files as they contain all the data, they can be sent over the network,
  // object-uri are good for large files but can't be sent over the network (they are just a ID)
  // this also means that object-uri cannot be used on the server-side
  mode?: "data-uri" | "object-uri"
}): Promise<string> {
  const requestUri = `${aitubeApiUrl}/api/resolvers/video?t=${
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

  // will only work on the server-side
  if (mode === "object-uri") {
    return URL.createObjectURL(blob)
  } else {
    if (typeof window !== "undefined") {
      // on browser-side
      const dataURL = await new Promise<string>((resolve, reject) => {
        var a = new FileReader()
        a.onload = function(e) { resolve(`${e.target?.result || ""}`) }
        a.readAsDataURL(blob)
      })
      return dataURL 
    } else {
      // NodeJS side
      const contentType = res.headers.get("Content-Type")
      const buffer = await (res as any).buffer() as Buffer
      return "data:" + contentType + ';base64,' + buffer.toString('base64')
    }
  }
}