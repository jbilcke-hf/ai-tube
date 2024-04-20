import { v4 as uuidv4 } from "uuid"

import {
  ChannelInfo,
  MediaInfo,
  VideoStatus,
  VideoGenerationModel,
  MediaProjection,
  VideoOrientation
} from "@/types/general"

import { LatentSearchResult, LatentSearchResults } from "./types"
import { newRender } from "../../providers/videochain/renderWithVideoChain"

const channel: ChannelInfo = {
 /**
   * We actually use the dataset ID for the channel ID.
   * 
   */
 id: "d25efcc1-3cc2-4b41-9f41-e3a93300ae5f",

 /**
  * The name used in the URL for the channel
  * 
  * eg: my-time-travel-journeys
  */
 slug: "latent",

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
 datasetUser: "",

 /**
  * dataset slug of the Hugging Face dataset
  * 
  * eg: ai-tube-my-time-travel-journeys
  */
 datasetName: "",

 label: "Latent",

 description: "Latent",

 thumbnail: "",

 model: "SDXL",

 lora: "",
 
 style: "",

 voice: "",

 music: "",

 /**
  * The system prompt
  */
 prompt: "",

 likes: 0,

 tags: [],

 updatedAt: new Date().toISOString(),

 /**
  * Default video orientation
  */
 orientation: "landscape"
}

export async function searchResultToMediaInfo(searchResult: LatentSearchResult): Promise<MediaInfo> {
  
  const renderResult = await newRender({
    prompt: searchResult.thumbnail,
    negativePrompt: "",
    nbFrames: 1,
    nbFPS: 1,
    nbSteps: 4,
    width: 1024,
    height: 576,
    turbo: true,
    shouldRenewCache: false,
    seed: searchResult.seed,
  })

  const thumbnailUrl: string = renderResult.assetUrl || ""
  
  const mediaInfo: MediaInfo = {
    /**
     * UUID (v4)
     */
    id: uuidv4(),

    /**
     * Status of the media
     */
    status: "published",

    /**
     * Human readable title for the media
     */
    label: searchResult.label,

    /**
     * Human readable description for the media
     */
    description: searchResult.summary,

    /**
     * Content prompt
     */
    prompt: searchResult.summary,

    /**
     * URL to the media thumbnail
     */
    thumbnailUrl,

    /**
     * URL to a clap file
     */
    clapUrl: "",

    assetUrl: "",

    /**
     * This is contain the storage URL of the higher-resolution content
     */
    assetUrlHd: "",

    /**
     * Counter for the number of views
     * 
     * Note: should be managed by the index to prevent cheating
     */
    numberOfViews: 0,

    /**
     * Counter for the number of likes
     * 
     * Note: should be managed by the index to prevent cheating
     */
    numberOfLikes: 0,

    /**
     * Counter for the number of dislikes
     * 
     * Note: should be managed by the index to prevent cheating
     */
    numberOfDislikes: 0,

    /**
     * When was the media updated
     */
    updatedAt: new Date().toISOString(),

    /**
     * Arbotrary string tags to label the content
     */
    tags: searchResult.tags,

    /**
     * Model name
     */
    model: "SDXL",

    /**
     * LoRA name
     */
    lora: "",

    /**
     * style name
     */
    style: "",

    /**
     * Music prompt
     */
    music: "",

    /**
     * Voice prompt
     */
    voice: "",

    /**
     * The channel
     */
    channel,

    /**
     * Media duration (in seconds)
     */
    duration: 60,

    /**
     * Media width (eg. 1024)
     */
    width: 1024,

    /**
     * Media height (eg. 576)
     */
    height: 576,

    /**
     * General media aspect ratio
     */
    orientation: "landscape",

    /**
     * Media projection (cartesian by default)
     */
    projection: "latent"
  }

  return mediaInfo
}