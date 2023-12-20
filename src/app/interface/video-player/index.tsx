"use client"

import AutoSizer from "react-virtualized-auto-sizer"

import { cn } from "@/lib/utils"
import { VideoInfo } from "@/types"
import { parseProjectionFromLoRA } from "@/app/server/actions/utils/parseProjectionFromLoRA"

import { EquirectangularVideoPlayer } from "./equirectangular"
import { CartesianVideoPlayer } from "./cartesian"

export function VideoPlayer({
  video,
  enableShortcuts = true,
  className = "",
  // currentTime,
 }: {
  video?: VideoInfo
  enableShortcuts?: boolean
  className?: string
  // currentTime?: number
}) {
  // we should our video players from  misssing data
  if (!video?.assetUrl) { return null }

  const isEquirectangular = (
    video.projection === "equirectangular" ||
    parseProjectionFromLoRA(video.lora) === "equirectangular"
  )

  if (isEquirectangular) {
    // note: for AutoSizer to work properly it needs to be inside a normal div with no display: "flex"
    return (
      <div className={cn(`w-full aspect-video`, className)}>
        <AutoSizer>{({ height, width }) => (
           <EquirectangularVideoPlayer video={video} className={className} width={width} height={height} />
          )}</AutoSizer>
      </div>
    )
  }

  return (
    <CartesianVideoPlayer video={video} enableShortcuts={enableShortcuts} className={className} />
  )
}