"use client"

import React, { useEffect } from "react"

import { cn } from "@/lib/utils/cn"
import { MediaInfo } from "@/types/general"
import { theSimps } from "@/app/latent/samples"
import { useChildController } from "./useChildController"
import { useSetupIframeOnce } from "./useSetupIframeOnce"

function LatentEngineClapper({
  media,
  width,
  height,
  className = "" }: {
  media: MediaInfo
  width?: number
  height?: number
  className?: string
}) {
  // only call this once per iframe
  useSetupIframeOnce()

  const hasLoadedBellhop = useChildController(s => s.hasLoadedBellhop)
  const sendMessage = useChildController(s => s.sendMessage)

  useEffect(() => {
    console.log('connected to the iframe player, now loading the prompt..')
    sendMessage('loadPrompt', { prompt: theSimps })
  }, [media.id, hasLoadedBellhop])

  return (
    <div
      style={{ width, height }}
      className={cn(`
      relative
      flex flex-col
      items-center justify-between
      w-full h-full
      rounded-xl overflow-hidden
      bg-black
      `, className)}>
      <iframe
        className="pointer-events-auto"
        width={width}
        height={height}
        src={`http://localhost:3000/embed?clap=/samples/claps/wasteland.clap`}
      />
    </div>
  );
}

export default LatentEngineClapper