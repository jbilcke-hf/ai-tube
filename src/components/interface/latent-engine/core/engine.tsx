"use client"

import React, { useEffect, useRef, useState } from "react"

import { mockClap } from "@/lib/clap/mockClap"
import { cn } from "@/lib/utils/cn"

import { useLatentEngine } from "../store/useLatentEngine"
import { PlayPauseButton } from "../components/play-pause-button"
import { StreamTag } from "../../stream-tag"
import { ContentLayer } from "../components/content-layer"

function LatentEngine({
  url,
  width,
  height,
  className = "" }: {
  url: string
  width?: number
  height?: number
  className?: string
}) {
  const setContainerDimension = useLatentEngine(s => s.setContainerDimension)
  const isLoaded = useLatentEngine(s => s.isLoaded)
  const openLatentClapFile = useLatentEngine(s => s.openLatentClapFile)
  const openClapFile = useLatentEngine(s => s.openClapFile)

  const setImageElement = useLatentEngine(s => s.setImageElement)
  const setVideoElement = useLatentEngine(s => s.setVideoElement)

  const streamType = useLatentEngine(s => s.streamType)
  const isStatic = useLatentEngine(s => s.isStatic)
  const isLive = useLatentEngine(s => s.isLive)
  const isInteractive = useLatentEngine(s => s.isInteractive)

  const isPlaying = useLatentEngine(s => s.isPlaying)
  const togglePlayPause = useLatentEngine(s => s.togglePlayPause)

  const videoLayer = useLatentEngine(s => s.videoLayer)
  const segmentationLayer = useLatentEngine(s => s.segmentationLayer)
  const interfaceLayer = useLatentEngine(s => s.interfaceLayer)

  const stateRef = useRef({ isInitialized: false })

  const [isOverlayVisible, setOverlayVisible] = useState(true)

  const overlayTimerRef = useRef<NodeJS.Timeout>()

  const videoLayerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!stateRef.current.isInitialized) {
      stateRef.current.isInitialized = true
      console.log("let's load an experience")
      // openClapFile(mockClap({ showDisclaimer: true }))
      openLatentClapFile("short story about a podracer race")
    }
  }, [])

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
 
    const videoElements = Array.from(videoLayerRef.current.querySelectorAll('.latent-video')) as HTMLVideoElement[]
    setVideoElement(videoElements.at(0))

    // images are used for simpler or static experiences
    const imageElements = Array.from(videoLayerRef.current.querySelectorAll('.latent-image')) as HTMLImageElement[]
    setImageElement(imageElements.at(0))
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
        className=""
        width={width}
        height={height}
        ref={videoLayerRef}
      >{videoLayer}</ContentLayer>

      <ContentLayer
        className=""
        width={width}
        height={height}
      >{segmentationLayer}</ContentLayer>

      <ContentLayer
        className=""
        width={width}
        height={height}
      >{interfaceLayer}</ContentLayer>

      
      {/* content overlay, with the gradient, buttons etc */}
      <div className={cn(`
        absolute
        mt-0 mb-0 ml-0 mr-0
        flex flex-col
        items-center justify-end
        pt-5 px-3 pb-1
        transition-opacity duration-300 ease-in-out
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
            flex flex-none
            items-center justify-center
             w-14 h-full
            `)}>
              {/*

              TODO: put a fullscreen button (and mode) here

             */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LatentEngine