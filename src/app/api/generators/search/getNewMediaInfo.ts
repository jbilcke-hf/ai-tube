import { v4 as uuidv4 } from "uuid"

import {
  ChannelInfo,
  MediaInfo,
} from "@/types/general"
import { defaultChannel } from "./defaultChannel"
import { defaultImageRatio } from "@aitube/clap"

export function getNewMediaInfo(params: Partial<MediaInfo> = {}): MediaInfo {

  const channel = defaultChannel

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
    label: "",

    /**
     * Human readable description for the media
     */
    description: "",

    /**
     * Content prompt
     */
    prompt: "",

    /**
     * URL to the media thumbnail
     */
    thumbnailUrl: "",

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
     * Arbitrary string tags to label the content
     */
    tags: [],

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
    duration: 2,

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
    orientation: defaultImageRatio,

    /**
     * Media projection (cartesian by default)
     */
    projection: "latent",

    ...params,
  }

  return mediaInfo
}