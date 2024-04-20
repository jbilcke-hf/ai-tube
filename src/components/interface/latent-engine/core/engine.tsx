"use client"

import React, { MouseEventHandler, useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils/cn"

import { useLatentEngine } from "../store/useLatentEngine"
import { PlayPauseButton } from "../components/play-pause-button"
import { StreamTag } from "../../stream-tag"
import { ContentLayer } from "../components/content-layer"
import { MediaInfo } from "@/types/general"
import { getMockClap } from "@/lib/clap/getMockClap"
import { serializeClap } from "@/lib/clap/serializeClap"

function LatentEngine({
  media,
  width,
  height,
  className = "" }: {
  media: MediaInfo
  width?: number
  height?: number
  className?: string
}) {
  const setContainerDimension = useLatentEngine(s => s.setContainerDimension)
  const isLoaded = useLatentEngine(s => s.isLoaded)
  const imagine = useLatentEngine(s => s.imagine)
  const open = useLatentEngine(s => s.open)

  const setImageElement = useLatentEngine(s => s.setImageElement)
  const setVideoElement = useLatentEngine(s => s.setVideoElement)
  const setSegmentationElement = useLatentEngine(s => s.setSegmentationElement)

  const simulationVideoPlaybackFPS = useLatentEngine(s => s.simulationVideoPlaybackFPS)
  const simulationRenderingTimeFPS = useLatentEngine(s => s.simulationRenderingTimeFPS)

  const streamType = useLatentEngine(s => s.streamType)
  const isStatic = useLatentEngine(s => s.isStatic)
  const isLive = useLatentEngine(s => s.isLive)
  const isInteractive = useLatentEngine(s => s.isInteractive)

  const isPlaying = useLatentEngine(s => s.isPlaying)
  const togglePlayPause = useLatentEngine(s => s.togglePlayPause)

  const videoLayer = useLatentEngine(s => s.videoLayer)
  const segmentationLayer = useLatentEngine(s => s.segmentationLayer)
  const interfaceLayer = useLatentEngine(s => s.interfaceLayer)
  const videoElement = useLatentEngine(s => s.videoElement)
  const imageElement = useLatentEngine(s => s.imageElement)

  const onClickOnSegmentationLayer = useLatentEngine(s => s.onClickOnSegmentationLayer)

  const stateRef = useRef({ isInitialized: false })

  const [isOverlayVisible, setOverlayVisible] = useState(true)

  const overlayTimerRef = useRef<NodeJS.Timeout>()

  const videoLayerRef = useRef<HTMLDivElement>(null)
  const segmentationLayerRef = useRef<HTMLDivElement>(null)

  const mediaUrl = media.clapUrl || media.assetUrlHd || media.assetUrl

  useEffect(() => {
    if (!stateRef.current.isInitialized && mediaUrl) {
      stateRef.current.isInitialized = true

      const fn = async () => {
        // TODO julian
        // there is a bug, we can't unpack the .clap when it's from a data-uri :/
        
        // open(mediaUrl)
        const mockClap = getMockClap()
        const mockArchive = await serializeClap(mockClap)
        // for some reason conversion to data uri doesn't work
        // const mockDataUri = await blobToDataUri(mockArchive, "application/x-gzip")
        // console.log("mockDataUri:", mockDataUri)
        open(mockArchive)
      }
      fn()
    }
  }, [mediaUrl])

  const isPlayingRef = useRef(isPlaying)
  isPlayingRef.current = isPlaying

  const scheduleOverlayInvisibility = () => {
    clearTimeout(overlayTimerRef.current)
    overlayTimerRef.current = setTimeout(() => {
      if (isPlayingRef.current) {
        setOverlayVisible(!isPlayingRef.current)
      }
      clearTimeout(overlayTimerRef.current)
    }, 1000)
  }

  /*
  useEffect(() => {
    if (isPlaying) {
      scheduleOverlayInvisibility()
    } else {
      clearTimeout(overlayTimerRef.current)
      setOverlayVisible(true)
    }

    return () => {
      clearTimeout(overlayTimerRef.current)
    }
  }, [isPlaying])
  */

  useEffect(() => {
    if (!videoLayerRef.current) { return }
 
    // note how in both cases we are pulling from the videoLayerRef
    // that's because one day everything will be a video, but for now we
    // "fake it until we make it"
    const videoElements = Array.from(
      videoLayerRef.current.querySelectorAll('.latent-video')
    ) as HTMLVideoElement[]
    setVideoElement(videoElements.at(0))

    // images are used for simpler or static experiences
    const imageElements = Array.from(
      videoLayerRef.current.querySelectorAll('.latent-image')
    ) as HTMLImageElement[]
    setImageElement(imageElements.at(0))


    if (!segmentationLayerRef.current) { return }
 
     const segmentationElements = Array.from(
       segmentationLayerRef.current.querySelectorAll('.segmentation-canvas')
     ) as HTMLCanvasElement[]
     setSegmentationElement(segmentationElements.at(0))

  })

  useEffect(() => {
    setContainerDimension({ width: width || 256, height: height || 256 })
  }, [width, height])


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
      {/* <Gsplat /> */}

      {/* main content container */}
      <ContentLayer
        className="pointer-events-auto"
        width={width}
        height={height}
        ref={videoLayerRef}
        onClick={onClickOnSegmentationLayer}
      >{videoLayer}</ContentLayer>


      <ContentLayer
        className="pointer-events-none"
        width={width}
        height={height}
        ref={segmentationLayerRef}
      ><canvas
        className="segmentation-canvas"
        style={{ width, height }}
      ></canvas></ContentLayer>

      {/*
      <ContentLayer
        className="pointer-events-auto"
        width={width}
        height={height}
  >{interfaceLayer}</ContentLayer>
  */}
      
      {/* content overlay, with the gradient, buttons etc */}
      <div className={cn(`
        absolute
        mt-0 mb-0 ml-0 mr-0
        flex flex-col
        items-center justify-end
        pt-5 px-3 pb-1
        transition-opacity duration-300 ease-in-out
        pointer-events-none
      `,
      isOverlayVisible ? "opacity-100" : "opacity-0"
      )}
      onMouseMove={() => {
        setOverlayVisible(true)
        scheduleOverlayInvisibility()
      }}
      style={{ width, height, boxShadow: "rgba(0, 0, 0, 1) 0px -77px 100px 15px inset" }}>
        {/* bottom slider and button bar */}
        <div className={cn(`
          flex flex-col
          self-end items-center justify-center
          w-full
        `)}>

          {/* the (optional) timeline slider bar */}
          <div className={cn(`
          flex flex-row
          items-center
          w-full h-0.5
          bg-gray-100/50
          `)}>
          <div className={cn(`
            flex flex-row
            items-center
            h-full
            `, {
              'bg-yellow-500/100': isInteractive,
              'bg-red-500/100': isLive,
            })}
            style={{
              width: "100%" // <-- TODO: compute the % of progression within the experience
            }}
            >
            </div>

          </div>

          {/* button bar */}
          <div className={cn(`
          flex flex-row flex-none
          w-full h-14
          items-center justify-between
          pointer-events-auto
          `)}>

            {/* left-side buttons */}
            <div className={cn(`
            flex flex-none
            items-center justify-center
             h-full
            `)}>
              <PlayPauseButton
                isToggledOn={isPlaying}
                onClick={togglePlayPause}
              />
              <StreamTag
                streamType={streamType}
                size="md"
                className=""
              />
            </div>


            {/* right-side buttons */}
            <div className={cn(`
            flex flex-none flex-row space-x-2
            items-center justify-center
             w-32 h-full
            `)}>
              {/*

              TODO: put a fullscreen button (and mode) here

             */}
             <div className="mono text-xs text-center">playback: {Math.round(simulationVideoPlaybackFPS * 100) / 100} FPS</div>
             <div className="mono text-xs text-center">rendering: {Math.round(simulationRenderingTimeFPS * 100) / 100} FPS</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LatentEngine