"use client"

import { MediaInfo } from "@/types/general"

import { Gsplat } from "../gsplat"

export function GaussianSplattingPlayer({
  media,
  width,
  height,
  enableShortcuts = true,
  className = "",
  // currentTime,
 }: {
  media: MediaInfo
  width?: number
  height?: number
  enableShortcuts?: boolean
  className?: string
  // currentTime?: number
}) {
  return (
    <Gsplat
      url={media.assetUrlHd || media.assetUrl}
      width={width}
      height={height}
      className={className}
    />
  )
}