export function parseAssetToCheckIfGaussian(url: string) {
  let ext = url.toLowerCase().split(".").pop() || ""
  ext = ext.split("?").shift() || ""

  if (ext === "splatv" || ext === "splat" || ext === "gsplat" || ext === "ply") {
    return true
  }

  return false
}