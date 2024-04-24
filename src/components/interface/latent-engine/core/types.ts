import { ClapProject, ClapSegment } from "@/lib/clap/types"
import { InteractiveSegmenterResult } from "@mediapipe/tasks-vision"
import { MouseEventHandler, ReactNode } from "react"

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

export type LatentComponentResolver = (segment: ClapSegment, clap: ClapProject) => Promise<LayerElement>

export type LayerElement = {
  id: string;
  element: JSX.Element;
}

export type LatentEngineStore = {
  // the token use to communicate with the NextJS backend
  // note that this isn't the Hugging Face token,
  // it is something more anynomous
  jwtToken: string

  width: number
  height: number

  clap: ClapProject
  debug: boolean

  // whether the engine is headless or not
  // (pure chatbot apps won't need the live UI for instance)
  headless: boolean

  // just some aliases for convenience
  isLoop: boolean
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

  videoSimulationPromise?: Promise<void>
  videoSimulationPending: boolean // used as a "lock"
  videoSimulationStartedAt: number
  videoSimulationEndedAt: number
  videoSimulationDurationInMs: number
  videoSimulationVideoPlaybackFPS: number
  videoSimulationRenderingTimeFPS: number

  interfaceSimulationPromise?: Promise<void>
  interfaceSimulationPending: boolean // used as a "lock"
  interfaceSimulationStartedAt: number
  interfaceSimulationEndedAt: number
  interfaceSimulationDurationInMs: number

  entitySimulationPromise?: Promise<void>
  entitySimulationPending: boolean // used as a "lock"
  entitySimulationStartedAt: number
  entitySimulationEndedAt: number
  entitySimulationDurationInMs: number

  renderingIntervalId: NodeJS.Timeout | string | number | undefined
  renderingIntervalDelayInMs: number
  renderingLastRenderAt: number

  // for our calculations to be correct
  // those need to match the actual output from the API
  // don't trust the parameters you send to the API,
  // instead check the *actual* values with VLC!!
  videoModelFPS: number
  videoModelNumOfFrames: number
  videoModelDurationInSec: number

  playbackSpeed: number

  positionInMs: number
  durationInMs: number 

  // this is the "buffer size"
  videoLayers: LayerElement[]
  videoElements: HTMLVideoElement[]

  interfaceLayers: LayerElement[]

  setJwtToken: (jwtToken: string) => void

  setContainerDimension: ({ width, height }: { width: number; height: number }) => void
  imagine: (prompt: string) => Promise<void>
  open: (src?: string | ClapProject | Blob) => Promise<void>

  setVideoElements: (videoElements?: HTMLVideoElement[]) => void
  processClickOnSegment: (data: InteractiveSegmenterResult) => void
  onClickOnSegmentationLayer: MouseEventHandler<HTMLDivElement> 
  
  togglePlayPause: () => boolean
  play: () => boolean
  pause: () => boolean

  // a slow simulation function (async - might call a third party LLM)
  runVideoSimulationLoop: () => Promise<void>
  
  // a slow simulation function (async - might call a third party LLM)
  runInterfaceSimulationLoop: () => Promise<void>
  
  // a slow simulation function (async - might call a third party LLM)
  runEntitySimulationLoop: () => Promise<void>
  
  // a fast rendering function; whose sole role is to filter the component
  // list to put into the buffer the one that should be displayed
  runRenderingLoop: () => void

  jumpTo: (positionInMs: number) => void
  jumpToStart: () => void

}
