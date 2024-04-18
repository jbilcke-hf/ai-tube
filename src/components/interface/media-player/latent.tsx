"use client"

import { MediaInfo } from "@/types/general"

import { LatentEngine } from "../latent-engine"

export function LatentPlayer({
  media,
  width,
  height,
  className = "",
  // currentTime,
 }: {
  media: MediaInfo
  width?: number
  height?: number
  className?: string
  // currentTime?: number
}) {
  // TODO add a play bar which should support fixed, streaming and live modes
  return (
    <LatentEngine
      media={media}
      width={width}
      height={height}
      className={className}
    />
  )
}