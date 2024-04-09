import { downloadFile } from "@/lib/huggingface/hub/src"
import { getCredentials } from "./getCredentials"

export async function downloadFileAsText({
  repo,
  path,
  apiKey,
  renewCache = false,
  neverThrow = false
}: {
  repo: string

  path: string

  apiKey?: string

  /**
   * Force renewing the cache
   * 
   * False by default
   */
  renewCache?: boolean

  /**
   * If set to true, this function will never throw an exception
   * this is useful in workflow where we don't care about what happened
   * 
   * False by default
   */
  neverThrow?: boolean
}): Promise<string> {
  try {
    const { credentials } = await getCredentials(apiKey)

    const response = await downloadFile({
      repo,
      path,
      credentials,
      requestInit: renewCache
        ? { cache: "no-cache" }
        : undefined
    })
    
    const text = await response?.text()

    if (typeof text !== "string") {
      throw new Error(`file has no text content`)
    }

    return text
  } catch (err) {
    if (neverThrow) {
      console.error(`downloadFileAsText():`, err)
      return ""
    } else {
      throw err
    }
  }
}