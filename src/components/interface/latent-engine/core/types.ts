import { ClapProject, ClapSegment, ClapStreamType } from "@/lib/clap/types"
import { ReactNode } from "react"

export type LatentEngineStatus =
  | "idle"
  | "loading"
  | "loaded"
  | "failed"

export type LatentNode = {
  prompt: string

  // HTML example
  example: string

  // React output
  result: ReactNode
}

export type LayerCategory =
  | "interface"
  | "segmentation"
  | "video"
  | "splat"

export type LatentComponentResolver = (segment: ClapSegment, clap: ClapProject) => Promise<JSX.Element>

export type LatentEngineStore = {
  width: number
  height: number

  clap: ClapProject

  streamType: ClapStreamType

  // just some aliases for convenience
  isStatic: boolean
  isLive: boolean
  isInteractive: boolean

  // our "this is AI.. gasp!" disclaimer
  hasDisclaimer: boolean
  hasPresentedDisclaimer: boolean

  // for convenience the status is split into separate booleans,
  // including their boolean opposites
  isLoading: boolean // true when a .clap is being downloaded and/or generated
  isLoaded: boolean // true if a clap is loaded
  isPlaying: boolean
  isPaused: boolean

  simulationPromise?: Promise<void>
  simulationPending: boolean // used as a "lock"

  renderingIntervalId: NodeJS.Timeout | string | number | undefined
  renderingIntervalDelayInMs: number

  positionInMs: number
  durationInMs: number 

  videoLayerElement?: HTMLDivElement
  imageElement?: HTMLImageElement
  videoElement?: HTMLVideoElement

  videoLayer: ReactNode
  videoBuffer: "A" | "B"
  videoBufferA: ReactNode
  videoBufferB: ReactNode

  segmentationLayer: ReactNode

  interfaceLayer: ReactNode
  interfaceBuffer: "A" | "B"
  interfaceBufferA: ReactNode
  interfaceBufferB: ReactNode

  setContainerDimension: ({ width, height }: { width: number; height: number }) => void
  openLatentClapFile: (prompt: string) => Promise<void>
  openClapFile: (clap: ClapProject) => void

  setVideoLayerElement: (videoLayerElement?: HTMLDivElement) => void
  setImageElement: (imageElement?: HTMLImageElement) => void
  setVideoElement: (videoElement?: HTMLVideoElement) => void

  togglePlayPause: () => boolean
  play: () => boolean
  pause: () => boolean

  // a slow rendering function (async - might call a third party LLM)
  runSimulationLoop: () => Promise<void>
  
  // a fast rendering function; whose sole role is to filter the component
  // list to put into the buffer the one that should be displayed
  runRenderingLoop: () => void

  jumpTo: (positionInMs: number) => void
  jumpToStart: () => void

}
