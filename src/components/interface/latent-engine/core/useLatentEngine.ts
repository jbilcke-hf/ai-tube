
import { create } from "zustand"

import { ClapEntity, ClapProject, ClapSegment, newClap, parseClap } from "@aitube/clap"

import { LatentEngineStore } from "./types"
import { resolveSegments } from "../resolvers/resolveSegments"
import { fetchLatentClap } from "./generators/fetchLatentClap"

import { InteractiveSegmenterResult, MPMask } from "@mediapipe/tasks-vision"
import { segmentFrame } from "@/lib/on-device-ai/segmentFrameOnClick"
import { drawSegmentation } from "../utils/canvas/drawSegmentation"
import { filterImage } from "@/lib/on-device-ai/filterImage"
import { getZIndexDepth } from "../utils/data/getZIndexDepth"
import { getSegmentStartAt } from "../utils/data/getSegmentStartAt"
import { getSegmentId } from "../utils/data/getSegmentId"
import { getElementsSortedByStartAt } from "../utils/data/getElementsSortedByStartAt"
import { getSegmentEndAt } from "../utils/data/getSegmentEndAt"
import { getVideoPrompt } from "./prompts/getVideoPrompt"
import { setZIndexDepthId } from "../utils/data/setZIndexDepth"
import { setSegmentStartAt } from "../utils/data/setSegmentStartAt"
import { setSegmentEndAt } from "../utils/data/setSegmentEndAt"
import { setSegmentId } from "../utils/data/setSegmentId"

export const useLatentEngine = create<LatentEngineStore>((set, get) => ({
  jwtToken: "",

  width: 512,
  height: 288,

  clap: newClap(),
  debug: true,

  headless: false, // false by default

  isLoop: false,
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

  videoSimulationPromise: undefined,
  videoSimulationPending: false,
  videoSimulationStartedAt: performance.now(),
  videoSimulationEndedAt: performance.now(),
  videoSimulationDurationInMs: 0,
  videoSimulationVideoPlaybackFPS: 0,
  videoSimulationRenderingTimeFPS: 0,

  interfaceSimulationPromise: undefined,
  interfaceSimulationPending: false,
  interfaceSimulationStartedAt: performance.now(),
  interfaceSimulationEndedAt: performance.now(),
  interfaceSimulationDurationInMs: 0,

  entitySimulationPromise: undefined,
  entitySimulationPending: false,
  entitySimulationStartedAt: performance.now(),
  entitySimulationEndedAt: performance.now(),
  entitySimulationDurationInMs: 0,

  renderingIntervalId: undefined,
  renderingIntervalDelayInMs: 150, // 0.2s
  renderingLastRenderAt: performance.now(),

  // for our calculations to be correct
  // those need to match the actual output from the API
  // don't trust the parameters you send to the API,
  // instead check the *actual* values with VLC!!
  videoModelFPS: 24,
  videoModelNumOfFrames: 60, // 80,
  videoModelDurationInSec: 2.584,

  playbackSpeed: 1,

  positionInMs: 0,
  durationInMs: 0,

  // this is the "buffer size"
  videoLayers: [
    {
      id: "video-buffer-0",
      element: null as unknown as JSX.Element,
    },
    {
      id: "video-buffer-1",
      element: null as unknown as JSX.Element,
    },
    /*
    {
      id: "video-buffer-2",
      element: null as unknown as JSX.Element,
    },
    {
      id: "video-buffer-3",
      element: null as unknown as JSX.Element,
    },
    */
  ],
  videoElements: [],

  interfaceLayers: [],

  setJwtToken: (jwtToken: string) => {
    set({
      jwtToken
    })
  },

  setContainerDimension: ({ width, height }: { width: number; height: number }) => {
    set({
      width,
      height
    })
  },

  imagine: async (prompt: string): Promise<void> => {
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

    get().open(clap)
  },


  open: async (src?: string | ClapProject | Blob) => {
    const { debug } = get()
    set({
      isLoaded: false,
      isLoading: true, 
    })

    let clap: ClapProject | undefined = undefined

    try {
      clap = await parseClap(src, debug)
    } catch (err) {
      console.error(`failed to open the Clap: ${err}`)
      set({
        isLoading: false,
      })
    }

    if (!clap) { return }
 
    set({
      clap,
      isLoading: false,
      isLoaded: true,
      isLoop: clap.meta.isLoop,
      isStatic: !clap.meta.isInteractive,
      isLive: false,
      isInteractive: clap.meta.isInteractive,
    })
  },

  setVideoElements: (videoElements: HTMLVideoElement[] = []) => { set({ videoElements }) },

  processClickOnSegment: (result: InteractiveSegmenterResult) => {
    console.log(`processClickOnSegment: user clicked on something:`, result)

    const { videoElements, debug } = get()

    if (!result?.categoryMask) {
      if (debug) {
        console.log(`processClickOnSegment: no categoryMask, so we skip the click`)
      }
      return
    }

    try {
      if (debug) {
        console.log(`processClickOnSegment: callling drawSegmentation`)
      }

      const firstVisibleVideo = videoElements.find(element => 
        getZIndexDepth(element) > 0
      )

      const segmentationElements = Array.from(
        document.querySelectorAll('.segmentation-canvas')
      ) as HTMLCanvasElement[]

      const segmentationElement = segmentationElements.at(0)
   
      const canvasMask: HTMLCanvasElement = drawSegmentation({
        mask: result.categoryMask,
        canvas: segmentationElement,
        backgroundImage: firstVisibleVideo,
        fillStyle: "rgba(255, 255, 255, 1.0)"
      })
      // TODO: read the canvas te determine on what the user clicked

      if (debug) {
        console.log(`processClickOnSegment: filtering the original image`)
      }
      // filterImage(imageElement, canvasMask)

      if (debug) {
        console.log("processClickOnSegment: TODO call data.close() to free the memory!")
      }
      result.close()
    } catch (err) {
      console.error(`processClickOnSegment: something failed ${err}`)
    }
  },
  onClickOnSegmentationLayer: (event) => {

    const { videoElements, debug } = get()
    if (debug) {
      console.log("onClickOnSegmentationLayer")
    }

    const firstVisibleVideo = videoElements.find(element => 
      getZIndexDepth(element) > 0
    )
    if (!firstVisibleVideo) { return }

    const box = event.currentTarget.getBoundingClientRect()

    const px = event.clientX
    const py = event.clientY

    const x = px / box.width
    const y = py / box.height
    console.log(`onClickOnSegmentationLayer: user clicked on `, { x, y, px, py, box, videoElements })

    const fn = async () => {
      // todo julian: this should use the visible element instead
      const results: InteractiveSegmenterResult = await segmentFrame(firstVisibleVideo, x, y)
      get().processClickOnSegment(results)
    }
    fn()
  },
  
  togglePlayPause: (): boolean => {
    const { isLoaded, isPlaying, playbackSpeed, renderingIntervalId, videoElements } = get()
    if (!isLoaded) { return false }
    
    const newValue = !isPlaying

    clearInterval(renderingIntervalId)

    const firstVisibleVideo = videoElements.find(element => 
      getZIndexDepth(element) > 0
    )

    // Note Julian: we could also let the background scheduler
    // (runRenderingLoop) do its work of advancing the cursor here

    if (newValue) {
      if (firstVisibleVideo) {
        try {
          firstVisibleVideo.playbackRate = playbackSpeed
          firstVisibleVideo.play()
        } catch (err) {
          console.error(`togglePlayPause: failed to start the video (${err})`)
        }
      }
      set({
        isPlaying: true,
        renderingIntervalId: setTimeout(() => { get().runRenderingLoop() }, 0)
      })
    } else {
      if (firstVisibleVideo) {
        try {
          firstVisibleVideo.playbackRate = playbackSpeed
          firstVisibleVideo.pause()
        } catch (err) {
          console.error(`togglePlayPause: failed to pause the video (${err})`)
        }
      }
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
  runVideoSimulationLoop: async () => {
    const {
      isLoaded,
      isPlaying,
      clap,
      playbackSpeed,
      positionInMs,
      videoModelFPS,
      videoModelNumOfFrames,
      videoModelDurationInSec,
      videoElements,
      jwtToken,
    } = get()

    if (!isLoaded || !isPlaying) {
      set({ videoSimulationPending: false })
      return
    }

    set({
      videoSimulationPending: true,
      videoSimulationStartedAt: performance.now(),
    })

    const videosSortedByStartAt = getElementsSortedByStartAt(videoElements)

    // videos whose timestamp is behind the current cursor
    let toRecycle: HTMLVideoElement[] = []
    let toPlay: HTMLVideoElement[] = []
    let toPreload: HTMLVideoElement[] = []
    
    for (let i = 0; i < videosSortedByStartAt.length; i++) {
      const video = videosSortedByStartAt[i]
      
      const segmentStartAt = getSegmentStartAt(video)
      const segmentEndAt = getSegmentEndAt(video)

      // this segment has been spent, it should be discared
      if (segmentEndAt < positionInMs) {
        toRecycle.push(video)
      } else if (segmentStartAt < positionInMs) {
        toPlay.push(video)
        video.play()
        setZIndexDepthId(video, 10)
      } else {
        toPreload.push(video)
        video.pause()
        setZIndexDepthId(video, 0)
      }
    }

    const videoDurationInMs = videoModelDurationInSec * 1000

    // TODO julian: this is an approximation
    // to grab the max number of segments
    const maxBufferDurationInMs = positionInMs + (videoDurationInMs * 4)
    console.log(`DEBUG: `, {
      positionInMs,
      videoModelDurationInSec,
      videoDurationInMs,
      "(videoDurationInMs * 4)":  (videoDurationInMs * 4),
      maxBufferDurationInMs,
      segments: clap.segments
    })
    
    const prefilterSegmentsForPerformanceReasons: ClapSegment[] = clap.segments.filter(s =>
      s.startTimeInMs >= positionInMs &&
      s.startTimeInMs < maxBufferDurationInMs
    )

    console.log(`prefilterSegmentsForPerformanceReasons: `, prefilterSegmentsForPerformanceReasons)

    // this tells us how much time is left
    let remainingTimeInMs = Math.max(0, clap.meta.durationInMs - positionInMs)
    // to avoid interruptions, we should jump to the beginning of the project
    // as soo as we are start playing back the "last" video segment

    // now, we need to recycle spent videos,
    // by discarding their content and replacing it with fresh one
    //
    // yes: I know the code is complex and not intuitive - sorry about that

    const extraPositivePrompt: string[] = ["high quality", "crisp", "detailed"]

    let bufferAheadOfCurrentPositionInMs = positionInMs

    for (let i = 0; i < toRecycle.length; i++) {
      console.log(`got a spent video to recycle`)
      
      // we select the segments in the current shot

      const shotSegmentsToPreload: ClapSegment[] = prefilterSegmentsForPerformanceReasons.filter(s =>
        s.startTimeInMs >= bufferAheadOfCurrentPositionInMs &&
        s.startTimeInMs < (bufferAheadOfCurrentPositionInMs + videoDurationInMs)
      )
      
      bufferAheadOfCurrentPositionInMs += videoDurationInMs

      const prompt = getVideoPrompt(shotSegmentsToPreload, clap.entityIndex, extraPositivePrompt)

      console.log(`video prompt: ${prompt}`)
      // could also be the camera
      // after all, we don't necessarily have a shot,
      // this could also be a gaussian splat
      const shotData = shotSegmentsToPreload.find(s => s.category === "video")

      console.log(`shotData:`, shotData)

      if (!prompt || !shotData) { continue }
  
      const recycled = toRecycle[i]

      recycled.pause()

      setSegmentId(recycled, shotData.id)
      setSegmentStartAt(recycled, shotData.startTimeInMs)
      setSegmentEndAt(recycled, shotData.endTimeInMs)
      setZIndexDepthId(recycled, 0)

      // this is the best compromise for now in term of speed
      const width = 512
      const height = 288

      // this is our magic trick: we let the browser do the token-secured,
      // asynchronous and parallel video generation call for us
      //
      // one issue with this approach is that it hopes the video
      // will be downloaded in time, but it's not an exact science
      //
      // first, generation time varies between 4sec and 7sec,
      // then some people will get 300ms latency due to their ISP,
      // and finally the video itself is a 150~200 Kb payload)
      recycled.src = `/api/resolvers/video?t=${

      // to prevent funny people from using this as a free, open-bar video API
      // we have this system of token with a 24h expiration date
      // we might even make it tighter in the future
        jwtToken
      }&w=${
        width

      }&h=${
        height
      }&p=${
        // let's re-use the best ideas from the Latent Browser:
        // a text uri equals a latent resource
        encodeURIComponent(prompt)
      }`

      toPreload.push(recycled)
    }

    const videoSimulationEndedAt = performance.now()
    const videoSimulationDurationInMs = videoSimulationEndedAt - get().videoSimulationStartedAt 
    const videoSimulationDurationInSec = videoSimulationDurationInMs / 1000

    const videoSimulationVideoPlaybackFPS = videoModelFPS * playbackSpeed
    const videoSimulationRenderingTimeFPS = videoModelNumOfFrames / videoSimulationDurationInSec
    set({
      videoSimulationPending: false,
      videoSimulationEndedAt,
      videoSimulationDurationInMs,
      videoSimulationVideoPlaybackFPS,
      videoSimulationRenderingTimeFPS,
    })
  },


  // a slow rendering function (async - might call a third party LLM)
  runInterfaceSimulationLoop: async () => {
    const {
      isLoaded,
      isPlaying,
      clap,
    } = get()

    if (!isLoaded || !isPlaying) {
      set({ interfaceSimulationPending: false })
      return
    }

    set({
      interfaceSimulationPending: true,
      interfaceSimulationStartedAt: performance.now(),
    })
 
    try {
      if (get().isPlaying) {
        // console.log(`runSimulationLoop: rendering UI layer..`)

        // note: for now we only display one panel at a time,
        // later we can try to see if we should handle more
        // for nice gradient transition,
        const interfaceLayers = await resolveSegments(clap, "interface", 1)

        if (get().isPlaying) {
          set({
            interfaceLayers
          })

          // console.log(`runSimulationLoop: rendered UI layer`)
        }
      }
    } catch (err) {
      console.error(`runInterfaceSimulationLoop failed to render UI layer ${err}`)
    }

    const interfaceSimulationEndedAt = performance.now()
    const interfaceSimulationDurationInMs = interfaceSimulationEndedAt - get().interfaceSimulationStartedAt

    set({
      interfaceSimulationPending: false,
      interfaceSimulationEndedAt,
      interfaceSimulationDurationInMs,
    })
  },


  // a slow rendering function (async - might call a third party LLM)
  runEntitySimulationLoop: async () => {
    const {
      isLoaded,
      isPlaying,
      clap,
    } = get()


    if (!isLoaded || !isPlaying) {
      set({ entitySimulationPending: false })
      return
    }

    set({
      entitySimulationPending: true,
      entitySimulationStartedAt: performance.now(),
    })

    const entitySimulationEndedAt = performance.now()
    const entitySimulationDurationInMs = entitySimulationEndedAt - get().entitySimulationStartedAt 

    set({
      entitySimulationPending: false,
      entitySimulationEndedAt,
      entitySimulationDurationInMs,
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
      renderingLastRenderAt,
      positionInMs,
      videoSimulationPending,
      runVideoSimulationLoop,
      interfaceSimulationPending,
      runInterfaceSimulationLoop,
      entitySimulationPending,
      runEntitySimulationLoop,
    } = get()
    if (!isLoaded || !isPlaying) { return }

    // TODO julian: don't do this here, this is inneficient
    const videoElements = Array.from(
      document.querySelectorAll('.video-buffer')
    ) as HTMLVideoElement[]
 
    const newRenderingLastRenderAt = performance.now()
    const elapsedInMs = newRenderingLastRenderAt - renderingLastRenderAt

    // let's move inside the Clap file timeline
    const newPositionInMs = positionInMs + elapsedInMs

    clearInterval(renderingIntervalId)

    set({
      isPlaying: true,
      renderingLastRenderAt: newRenderingLastRenderAt,
      positionInMs: newPositionInMs,

      videoElements: videoElements,
      // TODO: use requestAnimationFrame somehow
      // https://developers.google.com/mediapipe/solutions/vision/image_segmenter/web_js
      renderingIntervalId: setTimeout(() => { get().runRenderingLoop() }, renderingIntervalDelayInMs)
    })

    // note that having this second set() also helps us to make sure previously values are properly stored
    // in the state when the simulation loop runs
    if (!videoSimulationPending) {
      set({ videoSimulationPromise: runVideoSimulationLoop() }) // <-- note: this is a fire-and-forget operation!
    }
    if (!interfaceSimulationPending) {
      set({ interfaceSimulationPromise: runInterfaceSimulationLoop() }) // <-- note: this is a fire-and-forget operation!
    }
    if (!entitySimulationPending) {
      set({ entitySimulationPromise: runEntitySimulationLoop() }) // <-- note: this is a fire-and-forget operation!
    }
  },

  jumpTo: (positionInMs: number) => {
    set({ positionInMs })
  },
  jumpToStart: () => {
    set({ positionInMs: 0 })
  },
}))