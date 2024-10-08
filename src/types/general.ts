import type { ClapImageRatio } from "@aitube/clap"

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

  nbFrames: number
  nbFPS: number

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

  identityImage: string // reference image for the main entity
}

export interface ImageSegment {
  id: number
  box: number[]
  color: number[]
  label: string
  score: number 
}

export type RenderedSceneStatus =
  | "pending" // for retro-compatibility only, but this is deprecated
  | "to_generate"
  | "to_interpolate"
  | "to_upscale"
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
  durationInMs?: number
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
   * 
   */
  id: string

  /**
   * The name used in the URL for the channel
   * 
   * eg: my-time-travel-journeys
   */
  slug: string

  /**
   * username id of the Hugging Face dataset
   * 
   * ex: f9a38286ec3436a45edd2cca
   */
  // DISABLED FOR NOW
  // datasetUserId: string

  /**
   * username slug of the Hugging Face dataset
   * 
   * eg: jbilcke-hf
   */
  datasetUser: string

  /**
   * dataset slug of the Hugging Face dataset
   * 
   * eg: ai-tube-my-time-travel-journeys
   */
  datasetName: string

  label: string

  description: string

  thumbnail: string

  model: VideoGenerationModel

  lora: string
  
  style: string

  voice: string

  music: string

  /**
   * The system prompt
   */
  prompt: string

  likes: number

  tags: string[]

  updatedAt: string

  /**
   * Default video orientation
   */
  orientation: ClapImageRatio
}

export type VideoStatus =
  | "draft" // the video should be ignored for now
  | "submitted" // the video has been submitted, but is not added to the index queue yet
  | "queued" // the video has been added to the index queue, but is not processed yet. Once queued it cannot be modified.
  | "generating" // the video is being generated
  // TODO add a state to indicate the audio is being generated
  // this will be useful in case generation fails
  | "published" // success!
  | "error" // video failed to generate

/**
 * A video request, made by a user or robot on a channel
 */
export type VideoRequest = {
  /**
   * UUID (v4)
   */
  id: string

  // skip generation (mostly used for debugging)
  // skip?: boolean

  /**
   * Human readable title for the video
   */
  label: string

  /**
   * Human readable description for the video
   */
  description: string

  /**
   * Video prompt
   */
  prompt: string

  /**
   * URL to the video thumbnail
   */
  thumbnailUrl: string

  /**
   * URL to a clap file
   */
  clapUrl: string

  /**
   * When was the video updated
   */
  updatedAt: string

  /**
   * Arbotrary string tags to label the content
   */
  tags: string[]

  /**
   * Model name
   */
  model: VideoGenerationModel

  /**
   * LoRA name
   */
  lora: string

  /**
   * style name
   */
  style: string

  /**
   * Music prompt
   */
  music: string

  /**
   * Voice prompt
   */
  voice: string

  /**
   * ID of the channel
   */
  channel: ChannelInfo

  /**
   * Video orientation
   */
  orientation: ClapImageRatio

  /**
   * Video duration
   */
  duration: number
}

export type MediaProjection =
  | "cartesian" // this is the default
  | "equirectangular"
  | "gaussian"
  | "latent"


// TODO: renamed this to MediaInfo
export type MediaInfo = {
  /**
   * UUID (v4)
   */
  id: string

  /**
   * Status of the media
   */
  status: VideoStatus

  /**
   * Human readable title for the media
   */
  label: string

  /**
   * Human readable description for the media
   */
  description: string

  /**
   * Content prompt
   */
  prompt: string

  /**
   * URL to the media thumbnail
   */
  thumbnailUrl: string

  /**
   * URL to a clap file
   */
  clapUrl: string
  
  /**
   * URL to the binary file
   * 
   * This is the standard format
   * 
   * see width and height for details
   * 
   * (it will be something like 1024x576, 576x1024, 1024x512)
   * 
   */
  assetUrl: string

  /**
   * This is contain the storage URL of the higher-resolution content
   */
  assetUrlHd: string

  /**
   * Counter for the number of views
   * 
   * Note: should be managed by the index to prevent cheating
   */
  numberOfViews: number

  /**
   * Counter for the number of likes
   * 
   * Note: should be managed by the index to prevent cheating
   */
  numberOfLikes: number

  /**
   * Counter for the number of dislikes
   * 
   * Note: should be managed by the index to prevent cheating
   */
  numberOfDislikes: number

  /**
   * When was the media updated
   */
  updatedAt: string

  /**
   * Arbotrary string tags to label the content
   */
  tags: string[]

  /**
   * Model name
   */
  model: VideoGenerationModel

  /**
   * LoRA name
   */
  lora: string

  /**
   * style name
   */
  style: string

  /**
   * Music prompt
   */
  music: string

  /**
   * Voice prompt
   */
  voice: string

  /**
   * The channel
   */
  channel: ChannelInfo

  /**
   * Media duration
   */
  duration: number

  /**
   * Media width (eg. 1024)
   */
  width: number

  /**
   * Media height (eg. 576)
   */
  height: number

  /**
   * General media aspect ratio
   */
  orientation: ClapImageRatio

  /**
   * Media projection (cartesian by default)
   */
  projection: MediaProjection
}

export type CollectionInfo = {
  /**
   * UUID (v4)
   */
  id: string

  /**
   * Human readable title for the video
   */
  label: string

  /**
   * Human readable description for the video
   */
  description: string

  /**
   * URL to the video thumbnail
   */
  thumbnailUrl: string

  /**
   * Counter for the number of views
   * 
   * Note: should be managed by the index to prevent cheating
   */
  numberOfViews: number

  /**
   * Counter for the number of likes
   * 
   * Note: should be managed by the index to prevent cheating
   */
  numberOfLikes: number

  /**
   * When was the video updated
   */
  updatedAt: string

  /**
   * Arbotrary string tags to label the content
   */
  tags: string[]

  /**
   * The owner channel
   */
  channel: ChannelInfo

  /**
   * Collection duration
   */
  duration: number

  items: Array<MediaInfo>[]
}

export type UserInfo = {
  id: string

  type: "creator" | "normal" | "admin"

  userName: string

  fullName: string
  
  thumbnail: string

  channels: ChannelInfo[]

  // the Hugging Face API token is confidential,
  // and will only be available for the current user
  hfApiToken?: string
}

export type CommentInfo = {
  id: string
  
  userId: string

  // only populated when rendering
  userInfo?: UserInfo

  // if the video comment is in response to another comment,
  // then "inReplyTo" will contain the other video comment id
  inReplyTo?: string

  createdAt: string
  updatedAt: string
  message: string

  // how many likes did the comment receive
  numberOfLikes: number

  // how many replies did the comment receive
  numberOfReplies: number

  // if the comment was appreciated by the original content poster
  likedByOriginalPoster: boolean
}

export type StoredCommentInfo = Omit<CommentInfo, "userInfo">

export type VideoGenerationModel =
  | "HotshotXL"
  | "SVD"
  | "LaVie"
  | "AnimateDiff"
  | "SDXL" // yep, we can use images!

export type InterfaceDisplayMode =
  | "desktop"
  | "tv"

export type InterfaceHeaderMode =
  | "hidden"
  | "normal"
  | "compact"

export type InterfaceMenuMode =
  | "slider_hidden"
  | "slider_text"
  | "normal_icon"
  | "normal_text"

export type InterfaceView =
  | "home"
  | "user_channels"
  | "user_channel" // for a user to admin their channels
  | "user_medias"
  | "user_media"
  | "user_account"
  | "public_channels"
  | "public_channel" // public view of a channel
  | "public_media" // public view of an individual media (video, gaussian splat, clap video)
  | "public_media_embed" // for integration into twitter etc
  | "public_music_videos" // public music videos - it's a special category, because music is *cool*
  | "public_latent_search" // public view of latent search results
  | "public_latent_media" // public view of an individual dream (a latent media, so it's not a "real" file)
  | "public_latent_media_embed" // for integration into twitter etc (which would be hardcore for our server load.. so maybe not)
  | "public_gaming" // for AiTube Gaming
  | "public_4d" // for AiTube 4D
  | "public_live" // for AiTube Live
  | "not_found"


export type Settings = {
  huggingfaceApiKey: string
  huggingfaceTemporaryApiKey: string
}

export type ParsedDatasetReadme = {
  license: string
  pretty_name: string
  model: VideoGenerationModel
  lora: string
  style: string
  thumbnail: string
  voice: string
  music: string
  tags: string[]
  hf_tags: string[]
  description: string
  prompt: string
  orientation: ClapImageRatio
}

export type ParsedMetadataAndContent = {
  metadata: {
    license: string,
    pretty_name: string,
    tags: string[]
  }
  content: string
}

export type ParsedDatasetPrompt = {
  title: string
  description: string
  prompt: string
  tags: string[]
  model: VideoGenerationModel
  lora: string
  style: string
  thumbnail: string
  voice: string
  music: string
  orientation: ClapImageRatio
}

export type UpdateQueueRequest = {
  channel?: ChannelInfo
  apiKey: string
}

export type UpdateQueueResponse = {
  error?: string
  nbUpdated: number
}


export type AppQueryProps = {
  params: { id: string }
  searchParams: {
    v?: string | string[], // video id (deprecated)
    m?: string | string[], // media id (a better term)
    c?: string | string[], // clap id (do we still need this?)
    [key: string]: string | string[] | undefined
  }
}

export type LatentQueryProps = {
  params: { jwtToken: string }
  searchParams: {
    p?: string | string[], // search result content (serialized to a base64 json)
    [key: string]: string | string[] | undefined
  }
}

export type MediaDisplayLayout =
  | "grid" // default mode, items goas back to the line
  | "horizontal" // will be used for a "Netflix" horizontal sliding mode
  | "vertical" // used in the right recommendation panel
  | "table" // used when shown in a table mode
  | "micro"

export type MediaRating = {
  isLikedByUser: boolean
  isDislikedByUser: boolean
  numberOfLikes: number
  numberOfDislikes: number
}