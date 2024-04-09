export function parseAssetToCheckIfLatent(url: string) {
  let ext = url.toLowerCase().split(".").pop() || ""
  ext = ext.split("?").shift() || ""

  // check if it's a Clap or a LatentScript file
  // the .ls is usually small (it's like Makrdown)
  // while the Clap can be huge (many gbs)
  if (ext === "clap" || ext === "ls") {
    return true
  }

  return false
}