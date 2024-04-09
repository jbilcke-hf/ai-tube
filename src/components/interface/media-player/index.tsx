"use client"

import AutoSizer from "react-virtualized-auto-sizer"

import { cn } from "@/lib/utils/cn"
import { MediaInfo } from "@/types/general"
import { parseMediaProjectionType } from "@/lib/utils/parseMediaProjectionType"

import { EquirectangularVideoPlayer } from "./equirectangular"
import { CartesianVideoPlayer } from "./cartesian"
import { GaussianSplattingPlayer } from "./gaussian"

export function MediaPlayer({
  media,
  enableShortcuts = true,
  className = "",
  // currentTime,
 }: {
  media?: MediaInfo
  enableShortcuts?: boolean
  className?: string
  // currentTime?: number
}) {
  console.log("MediaPlayer called for \"" + media?.label + "\"")
  
  if (!media || !media?.assetUrl) { return null }

  // uncomment one of those to forcefully test the .splatv player!
  // media.assetUrlHd = "https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/4d/flame/flame.splatv"
  // media.assetUrlHd = "https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/4d/sear/sear.splatv"
  // media.assetUrlHd = "https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/4d/birthday/birthday.splatv"

  const projectionType = parseMediaProjectionType(media)
  
  if (projectionType === "gaussian") {
    // note: for AutoSizer to work properly it needs to be inside a normal div with no display: "flex"
    return (
      <div className={cn(`w-full aspect-video`, className)}>
        <AutoSizer>{({ height, width }) => (
           <GaussianSplattingPlayer media={media} className={className} width={width} height={height} />
          )}</AutoSizer>
      </div>
    )
  }

  if (projectionType === "equirectangular") {
    // note: for AutoSizer to work properly it needs to be inside a normal div with no display: "flex"
    return (
      <div className={cn(`w-full aspect-video`, className)}>
        <AutoSizer>{({ height, width }) => (
           <EquirectangularVideoPlayer media={media} className={className} width={width} height={height} />
          )}</AutoSizer>
      </div>
    )
  }

  return (
    <CartesianVideoPlayer media={media} enableShortcuts={enableShortcuts} className={className} />
  )
}