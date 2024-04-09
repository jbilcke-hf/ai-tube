import { downloadFile } from "@/lib/huggingface/hub/src"
import { getCredentials } from "./getCredentials"

export async function downloadFileAsBlob({
  repo,
  path,
  apiKey,
  expectedMimeType = "text/plain",
  renewCache = false,
  neverThrow = false
}: {
  repo: string

  path: string

  apiKey?: string

  expectedMimeType?: string

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
}): Promise<Blob> {
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
    
    if (!response) {
      throw new Error("missing response")
    }
    const blob = await response.blob()

    return blob
  } catch (err) {
    if (neverThrow) {
      console.error(`downloadFileAsBlob():`, err)

      const blobResult = new Blob([""], { type: expectedMimeType })
      return blobResult
    } else {
      throw err
    }
  }
}