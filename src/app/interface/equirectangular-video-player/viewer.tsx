"use client"

import { useEffect, useRef, useState } from "react"
import AutoSizer from "react-virtualized-auto-sizer"
import { PanoramaPosition, PluginConstructor, Point, Position, SphericalPosition, Viewer } from "@photo-sphere-viewer/core"
import { EquirectangularVideoAdapter, LensflarePlugin, ReactPhotoSphereViewer, ResolutionPlugin, SettingsPlugin, VideoPlugin } from "react-photo-sphere-viewer"

import { cn } from "@/lib/utils"
import { VideoInfo } from "@/types/general"

type PhotoSpherePlugin = (PluginConstructor | [PluginConstructor, any])

export function VideoSphereViewer({
  video,
  className = "",
  width,
  height,
  muted = false,
 }: {
  video: VideoInfo
  className?: string
  width: number
  height: number
  muted?: boolean
}) {
  const rootContainerRef = useRef<HTMLDivElement>(null)
  const viewerContainerRef = useRef<HTMLElement>()
  const viewerRef = useRef<Viewer>()

  useEffect(() => {
    if (!viewerRef.current) { return }
    viewerRef.current.setOptions({
      size: {
        width: `${width}px`,
        height: `${height}px`
      }
    })
  }, [width, height])

  if (!video.assetUrl) { return null }

  return (
    <div
      // will be used later, if we need overlays and stuff
      ref={rootContainerRef}
    >
      <ReactPhotoSphereViewer

        container=""
        containerClass={cn(
          "rounded-xl overflow-hidden",
          className
        )}

        width={`${width}px`}
        height={`${height}px`}

        onReady={(instance) => {
          viewerRef.current = instance
          viewerContainerRef.current = instance.container
        }}
        
        // to access a plugin we must use viewer.getPlugin()
        // plugins={[[LensflarePlugin, { lensflares: [] }]]}

        adapter={[EquirectangularVideoAdapter, { muted }]}
        navbar="video"
        src="" 
        plugins={[
          [VideoPlugin, {
            muted,
            // progressbar: true,
            bigbutton: false
          }],
          // SettingsPlugin,
          [ResolutionPlugin, {
            defaultResolution: 'HD',
            resolutions: [
              {
                id: 'HD',
                label: 'Standard',
                panorama: { source: video.assetUrlHd || video.assetUrl },
              },
            ],
          }],
        ]}
      />
    </div>
  )
}
  