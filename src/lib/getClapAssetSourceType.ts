import { ClapAssetSource } from "@/clap/types"

export function getClapAssetSourceSource(input: string): ClapAssetSource {
  
  const str = `${input || ""}`
  if (str.startsWith("https://") || str.startsWith("http://")) {
    return "REMOTE"
  }

  // note that "path" assets are potentially a security risk, they need to be treated with care
  if (str.startsWith("/") || str.startsWith("../") || str.startsWith("./")) {
    return "PATH"
  }

  if (str.startsWith("data:")) {
    return "DATA"
  }

  if (!str) {
    return "EMPTY"
  }

  return "PROMPT"
}