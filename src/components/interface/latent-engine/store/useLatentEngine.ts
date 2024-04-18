
import { create } from "zustand"

import { ClapProject } from "@/lib/clap/types"
import { newClap } from "@/lib/clap/newClap"
import { sleep } from "@/lib/utils/sleep"
import { getSegmentationCanvas } from "@/lib/on-device-ai/getSegmentationCanvas"

import { LatentEngineStore } from "../core/types"
import { resolveSegments } from "../resolvers/resolveSegments"
import { fetchLatentClap } from "../core/fetchLatentClap"

export const useLatentEngine = create<LatentEngineStore>((set, get) => ({
  width: 1024,
  height: 576,

  clap: newClap(),

  streamType: "static",
  isStatic: false,
  isLive: false,
  isInteractive: false,

  isLoading: false, // true when a .clap is being downloaded and/or generated
  isLoaded: false, // true if a clap is loaded
  isPlaying: false,
  isPaused: true,

  // our "this is AI.. gasp!" disclaimer
  hasDisclaimer: true,
  hasPresentedDisclaimer: false,

  simulationPromise: undefined,
  simulationPending: false,

  renderingIntervalId: undefined,
  renderingIntervalDelayInMs: 2000, // 2 sec
  
  positionInMs: 0,
  durationInMs: 0,

  videoLayerElement: undefined,
  imageElement: undefined,
  videoElement: undefined,

  videoLayer: undefined,
  videoBuffer: "A",
  videoBufferA: null,
  videoBufferB: undefined,

  segmentationLayer: undefined,

  interfaceLayer: undefined,
  interfaceBuffer: "A",
  interfaceBufferA: undefined,
  interfaceBufferB: undefined,

  setContainerDimension: ({ width, height }: { width: number; height: number }) => {
    set({
      width,
      height
    })
  },

  openLatentClapFile: async (prompt: string): Promise<void> => {
    set({
      isLoaded: false,
      isLoading: true, 
    })

    let clap: ClapProject | undefined = undefined

    try {
      clap = await fetchLatentClap(prompt)
    } catch (err) {
      console.error(`generateAndLoad failed (${err})`)
      set({
        isLoading: false,
      })
    }

    if (!clap) { return }

    get().openClapFile(clap)
  },

  openClapFile: (clap: ClapProject) => {
    set({
      clap,
      isLoading: false,
      isLoaded: true,
      streamType: clap.meta.streamType,
      isStatic: clap.meta.streamType !== "interactive" && clap.meta.streamType !== "live",
      isLive: clap.meta.streamType === "live",
      isInteractive: clap.meta.streamType === "interactive",
    })
  },

  setVideoLayerElement: (videoLayerElement?: HTMLDivElement) => { set({ videoLayerElement }) },
  setImageElement: (imageElement?: HTMLImageElement) => { set({ imageElement }) },
  setVideoElement: (videoElement?: HTMLVideoElement) => { set({ videoElement }) },

  togglePlayPause: (): boolean => {
    const { isLoaded, isPlaying, renderingIntervalId } = get()
    if (!isLoaded) { return false }
    
    const newValue = !isPlaying

    clearInterval(renderingIntervalId)

    if (newValue) {
      set({
        isPlaying: true,
        renderingIntervalId: setTimeout(() => { get().runRenderingLoop() }, 0)
      })
    } else {
      set({ isPlaying: false })
    }

    return newValue
  },


  play: (): boolean => {
    const { isLoaded, isPlaying, renderingIntervalId, renderingIntervalDelayInMs } = get()

    if (!isLoaded) { return false }

    if (isPlaying) { return true }

    clearInterval(renderingIntervalId)
    set({
      isPlaying: true,
      renderingIntervalId: setTimeout(() => { get().runRenderingLoop() }, 0)
    })

    return true
  },

  pause: (): boolean => {
    const { isLoaded, renderingIntervalId } = get()
    if (!isLoaded) { return false }

    clearInterval(renderingIntervalId)

    set({ isPlaying: false })

    return false
  },

  // a slow rendering function (async - might call a third party LLM)
  runSimulationLoop: async () => {
    const {
      isLoaded,
      isPlaying,
      clap,
      segmentationLayer,
      imageElement,
      videoElement,
      height,
      width,
    } = get()

    if (!isLoaded || !isPlaying) {
        
      set({
        simulationPending: false,
      })

      return
    }

    set({
      simulationPending: true,
    })

    try {

      // console.log("doing stuff")
      let timestamp = performance.now()

      if (imageElement) {
        // console.log("we have an image element:", imageElement)
        const segmentationLayer = await getSegmentationCanvas({
          frame: imageElement,
          timestamp,
          width,
          height,
        })
        set({ segmentationLayer })
      }

      await sleep(500)

      // note: since we are asynchronous, we need to regularly check if
      // the user asked to pause the system or no
      if (get().isPlaying) {
        // console.log(`runSimulationLoop: rendering video content layer..`)
        // we only grab the first one
        const videoLayer = (await resolveSegments(clap, "video", 1)).at(0)

        if (get().isPlaying) {
          set({
            videoLayer
          })

          console.log(`runSimulationLoop: rendered video content layer`)
        }
      }

    } catch (err) {
      console.error(`runSimulationLoop failed to render video layer ${err}`)
    }

    try {
      if (get().isPlaying) {
        console.log(`runSimulationLoop: rendering UI layer..`)

        // note: for now we only display one element, to avoid handing a list of html elements
        const interfaceLayer = (await resolveSegments(clap, "interface", 1)).at(0)
        if (get().isPlaying) {
          set({
            interfaceLayer
          })

          console.log(`runSimulationLoop: rendered UI layer`)
        }
      }
    } catch (err) {
      console.error(`runSimulationLoop failed to render UI layer ${err}`)
    }

    set({
      simulationPending: false,
    })
  },

  // a fast sync rendering function; whose sole role is to filter the component
  // list to put into the buffer the one that should be displayed
  runRenderingLoop: () => {
    const {
      isLoaded,
      isPlaying,
      renderingIntervalId,
      renderingIntervalDelayInMs,
      simulationPromise,
      simulationPending,
      runSimulationLoop,
      imageElement,
      videoElement,
    } = get()
    if (!isLoaded) { return }
    if (!isPlaying) { return }
    try {
      // console.log(`runRenderingLoop: starting..`)
    
      // TODO: some operations with
      // console.log(`runRenderingLoop: ended`)
    } catch (err) {
      console.error(`runRenderingLoop failed ${err}`)
    }
    clearInterval(renderingIntervalId)
    set({
      isPlaying: true,
      simulationPromise: simulationPending ? simulationPromise : runSimulationLoop(),

      // TODO: use requestAnimationFrame somehow
      // https://developers.google.com/mediapipe/solutions/vision/image_segmenter/web_js
      renderingIntervalId: setTimeout(() => { get().runRenderingLoop() }, renderingIntervalDelayInMs)
    })
    
  },

  jumpTo: (positionInMs: number) => {
    set({ positionInMs })
  },
  jumpToStart: () => {
    set({ positionInMs: 0 })
  },
}))