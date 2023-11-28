import { VideoCategory } from "./app/state/categories"

export type ProjectionMode = 'cartesian' | 'spherical'

export type MouseEventType = "hover" | "click"

export type MouseEventHandler = (type: MouseEventType, x: number, y: number) => Promise<void>

export type CacheMode = "use" | "renew" | "ignore"

export interface RenderRequest {
  prompt: string

  // whether to use video segmentation
  // disabled (default)
  // firstframe: we only analyze the first frame
  // allframes: we analyze all the frames
  segmentation: 'disabled' | 'firstframe' | 'allframes'

  // segmentation will only be executed if we have a non-empty list of actionnables
  // actionnables are names of things like "chest", "key", "tree", "chair" etc
  actionnables: string[]

  // note: this is the number of frames for Zeroscope,
  // which is currently configured to only output 3 seconds, so:
  // nbFrames=8 -> 1 sec
  // nbFrames=16 -> 2 sec
  // nbFrames=24 -> 3 sec
  nbFrames: number // min: 1, max: 24

  nbSteps: number // min: 1, max: 50

  seed: number

  width: number // fixed at 1024 for now
  height: number // fixed at 512 for now

  // upscaling factor
  // 0: no upscaling
  // 1: no upscaling
  // 2: 2x larger
  // 3: 3x larger
  // 4x: 4x larger, up to 4096x4096 (warning: a PNG of this size can be 50 Mb!)
  upscalingFactor: number

  projection: ProjectionMode

  /**
   * Use turbo mode
   * 
   * At the time of writing this will use SSD-1B + LCM
   * https://huggingface.co/spaces/jbilcke-hf/fast-image-server
   */
  turbo: boolean

  cache: CacheMode

  wait: boolean // wait until the job is completed

  analyze: boolean // analyze the image to generate a caption (optional)
}

export interface ImageSegment {
  id: number
  box: number[]
  color: number[]
  label: string
  score: number 
}

export type RenderedSceneStatus =
  | "pending"
  | "completed"
  | "error"

export interface RenderedScene {
  renderId: string
  status: RenderedSceneStatus
  assetUrl: string 
  alt: string
  error: string
  maskUrl: string
  segments: ImageSegment[]
}

export interface ImageAnalysisRequest {
  image: string // in base64
  prompt: string
}

export interface ImageAnalysisResponse {
  result: string
  error?: string
}

export type RenderingEngine =
  | "VIDEOCHAIN"
  | "OPENAI"
  | "REPLICATE"

export type PostVisibility =
  | "featured" // featured by admins
  | "trending" // top trending / received more than 10 upvotes
  | "normal" // default visibility

export type Post = {
  postId: string
  appId: string
  prompt: string
  model: string
  previewUrl: string
  assetUrl: string
  createdAt: string
  visibility: PostVisibility
  upvotes: number
  downvotes: number
}

export type CreatePostResponse = {
  success?: boolean
  error?: string
  post: Post
}

export type GetAppPostsResponse = {
  success?: boolean
  error?: string
  posts: Post[]
}

export type GetAppPostResponse = {
  success?: boolean
  error?: string
  post: Post
}

// vendor-specific types

export type HotshotImageInferenceSize =
| '320x768'
| '384x672'
| '416x608'
| '512x512'
| '608x416'
| '672x384'
| '768x320'
| '1024x1024' // custom ratio - this isn't supported / supposed to work properly
| '1024x512' // custom panoramic ratio - this isn't supported / supposed to work properly
| '1024x576' // movie ratio (16:9) this isn't supported / supposed to work properly
| '576x1024' // tiktok ratio (9:16) this isn't supported / supposed to work properly

export type VideoOptions = {
  positivePrompt: string

  negativePrompt?: string

  size?: HotshotImageInferenceSize
  
  /**
   * Must be a model *name*
   */
  huggingFaceLora?: string

  replicateLora?: string

  triggerWord?: string
  
  nbFrames?: number // FPS (eg. 8)
  duration?: number // in milliseconds

  steps?: number

  key?: string // a semi-unique key to prevent abuse from some users
}

/**
 * A channel is a video generator
 * 
 * Video will be uploaded to a dataset
 */
export type ChannelInfo = {
  /**
   * We actually use the dataset ID for the channel ID.
   */
  id: string

  /**
   * The name used in the URL for the channel
   */
  slug: string
  label: string
  thumbnail: string
  prompt: string
  likes: number
}

export type VideoInfo = {
  id: string
  label: string
  thumbnailUrl: string
  assetUrl: string
  numberOfViews: number
  createdAt: string
  categories: VideoCategory[]
  channelId: string
}

export type FullVideoInfo = VideoInfo & {
  channel: ChannelInfo
}

export type InterfaceDisplayMode =
  | "desktop"
  | "tv"

export type InterfaceView =
  | "home"
  | "channels_admin"
  | "channels_public"
  | "channel_admin" // for a user to admin their channels
  | "channel_public" // public view of a channel
  | "video_public" // public view of a video