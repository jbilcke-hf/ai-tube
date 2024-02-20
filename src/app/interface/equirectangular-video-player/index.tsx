"use client"

import AutoSizer from "react-virtualized-auto-sizer"

import { cn } from "@/lib/utils"
import { VideoInfo } from "@/types/general"

import { VideoSphereViewer } from "./viewer"

export function EquirectangularVideoPlayer({
  video,
  className = "",
 }: {
  video?: VideoInfo
  className?: string
}) {


  // we shield the VideeoSphere viewer from bad data
  if (!video?.assetUrl) { return null }

  return (
    <div
      className={cn(
        `w-full`,
        // note: for AutoSizer to work properly it needs to be inside a normal div with no display: "flex"
        `aspect-video`,
        className
      )}>
      <AutoSizer>
      {({ height, width }) => (
         <VideoSphereViewer
            video={video}
            className={className}
            width={width}
            height={height}
          />
        )}
      </AutoSizer>
    </div>
  )
}