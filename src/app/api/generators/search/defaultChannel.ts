import { ChannelInfo } from "@/types/general"
import { defaultMediaOrientation } from "@aitube/clap"

export const defaultChannel: ChannelInfo = {
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
 orientation: defaultMediaOrientation
}