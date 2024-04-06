"use client"

import { useEffect, useRef } from "react"
import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer"

import { Viewer } from "@photo-sphere-viewer/core"

import { EquirectangularVideoAdapter } from "@photo-sphere-viewer/equirectangular-video-adapter"

import { SettingsPlugin } from "@photo-sphere-viewer/settings-plugin"
import { ResolutionPlugin } from "@photo-sphere-viewer/resolution-plugin"
import { VideoPlugin } from "@photo-sphere-viewer/video-plugin"

import "@photo-sphere-viewer/settings-plugin/index.css"
import "@photo-sphere-viewer/video-plugin/index.css"

import { cn } from "@/lib/utils"
import { MediaInfo } from "@/types/general"

export function VideoSphereViewer({
  video,
  className = "",
  width,
  height,
  muted = false,
 }: {
  video: MediaInfo
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
          [SettingsPlugin, {}],
          [VideoPlugin, {
            muted,
            // progressbar: true,
            bigbutton: false
          }],
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
  