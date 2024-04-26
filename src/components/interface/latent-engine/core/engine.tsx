"use client"

import React, { MouseEventHandler, useEffect, useRef, useState } from "react"
import { useLocalStorage } from "usehooks-ts"

import { cn } from "@/lib/utils/cn"
import { MediaInfo } from "@/types/general"

import { useLatentEngine } from "./useLatentEngine"
import { PlayPauseButton } from "../components/play-pause-button"
import { StaticOrInteractiveTag } from "../../static-or-interactive-tag"
import { ContentLayer } from "../components/content-layer"
import { localStorageKeys } from "@/app/state/localStorageKeys"
import { defaultSettings } from "@/app/state/defaultSettings"
import { useStore } from "@/app/state/useStore"
import { ClapProject, generateClapFromSimpleStory, serializeClap } from "@aitube/clap"

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
  // used to prevent people from opening multiple sessions at the same time
  // note: this should also be enforced with the Hugging Face ID
  const [multiTabsLock, setMultiTabsLock] = useLocalStorage<number>(
    "AI_TUBE_ENGINE_MULTI_TABS_LOCK",
    Date.now()
  )

  const [huggingfaceApiKey, setHuggingfaceApiKey] = useLocalStorage<string>(
    localStorageKeys.huggingfaceApiKey,
    defaultSettings.huggingfaceApiKey
  )
  
  // note here how we transfer the info from one store to another
  const jwtToken = useStore(s => s.jwtToken)
  const setJwtToken = useLatentEngine(s => s.setJwtToken)
  useEffect(() => {
    setJwtToken(jwtToken)
  }, [jwtToken])


  const setContainerDimension = useLatentEngine(s => s.setContainerDimension)
  const isLoaded = useLatentEngine(s => s.isLoaded)
  const imagine = useLatentEngine(s => s.imagine)
  const open = useLatentEngine(s => s.open)

  const videoSimulationVideoPlaybackFPS = useLatentEngine(s => s.videoSimulationVideoPlaybackFPS)
  const videoSimulationRenderingTimeFPS = useLatentEngine(s => s.videoSimulationRenderingTimeFPS)

  const isLoop = useLatentEngine(s => s.isLoop)
  const isStatic = useLatentEngine(s => s.isStatic)
  const isLive = useLatentEngine(s => s.isLive)
  const isInteractive = useLatentEngine(s => s.isInteractive)

  const isPlaying = useLatentEngine(s => s.isPlaying)
  const togglePlayPause = useLatentEngine(s => s.togglePlayPause)

  const videoLayers = useLatentEngine(s => s.videoLayers)
  const interfaceLayers = useLatentEngine(s => s.interfaceLayers)

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
        const mockClap: ClapProject = generateClapFromSimpleStory()
        const mockArchive: Blob = await serializeClap(mockClap)
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
    }, 3000)
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
      >{videoLayers.map(({ id }) => (
        <video
          key={id}
          id={id}
          style={{ width, height }}
          className={cn(
            `video-buffer`,
            `video-buffer-${id}`,
          )}
          data-segment-id="0"
          data-segment-start-at="0"
          data-z-index-depth="0"
          playsInline={true}
          muted={true}
          autoPlay={false}
          loop={true}
          src="/blanks/blank_1sec_512x288.webm"
      />))}
      </ContentLayer>
        
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
     >{interfaceLayers.map(({ id, element }) => (
      <div
        key={id}
        id={id}
        style={{ width, height }}
        className={`interface-layer-${id}`}>{element}</div>))}</ContentLayer>
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
              <StaticOrInteractiveTag
                isInteractive={isInteractive}
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
             <div className="mono text-xs text-center">playback: {Math.round(videoSimulationVideoPlaybackFPS * 100) / 100} FPS</div>
             <div className="mono text-xs text-center">rendering: {Math.round(videoSimulationRenderingTimeFPS * 100) / 100} FPS</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LatentEngine