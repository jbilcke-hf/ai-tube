import YAML from "yaml"
import { v4 as uuidv4 } from "uuid"

import { ClapHeader, ClapMeta, ClapModel, ClapProject, ClapSegment } from "./types"
import { getValidNumber } from "@/lib/getValidNumber"

/**
 * import a Clap file (from a plain text string)
 * 
 * note: it is not really async, because for some reason YAML.parse is a blocking call like for JSON,
 * they is no async version although we are now in the 20s not 90s
 */
export async function parseClap(inputStringOrBlob: string | Blob): Promise<ClapProject> {

  // Decompress the input blob using gzip
  const decompressor = new DecompressionStream('gzip');

  const inputBlob =
    typeof inputStringOrBlob === "string"
    ? new Blob([inputStringOrBlob], { type: "application/x-yaml" })
    : inputStringOrBlob;

  const decompressedStream = inputBlob.stream().pipeThrough(decompressor);

  // Convert the stream to text using a Response object
  const text = await new Response(decompressedStream).text();
  
  // Parse YAML string to raw data
  const rawData = YAML.parse(text);

  if (!Array.isArray(rawData) || rawData.length < 2) {
    throw new Error("invalid clap file (need a clap format header block and project metadata block)")
  }

  const maybeClapHeader = rawData[0] as ClapHeader

  if (maybeClapHeader.format !== "clap-0") {
    throw new Error("invalid clap file (sorry, but you can't make up version numbers like that)")
  }


  const maybeClapMeta = rawData[1] as ClapMeta

  const clapMeta: ClapMeta = {
    id: typeof maybeClapMeta.title === "string" ? maybeClapMeta.id : uuidv4(),
    title: typeof maybeClapMeta.title === "string" ? maybeClapMeta.title : "",
    description: typeof maybeClapMeta.description === "string" ? maybeClapMeta.description : "",
    licence: typeof maybeClapMeta.licence === "string" ? maybeClapMeta.licence : "",
    orientation: maybeClapMeta.orientation === "portrait" ? "portrait" : maybeClapMeta.orientation === "square" ? "square" : "landscape",
    width: getValidNumber(maybeClapMeta.width, 256, 8192, 1024),
    height: getValidNumber(maybeClapMeta.height, 256, 8192, 576),
    defaultVideoModel: typeof maybeClapMeta.defaultVideoModel === "string" ? maybeClapMeta.defaultVideoModel : "SVD",
    extraPositivePrompt: Array.isArray(maybeClapMeta.extraPositivePrompt) ? maybeClapMeta.extraPositivePrompt : []
  }

  /*
  in case we want to support streaming (mix of models and segments etc), we could do it this way:

  const maybeModelsOrSegments = rawData.slice(2)
  maybeModelsOrSegments.forEach((unknownElement: any) => {
    if (isValidNumber(unknownElement?.track)) {
      maybeSegments.push(unknownElement as ClapSegment)
    } else {
      maybeModels.push(unknownElement as ClapModel)
    }
  })
  */


  const expectedNumberOfModels = maybeClapHeader.numberOfModels || 0
  const expectedNumberOfSegments = maybeClapHeader.numberOfSegments || 0

  // note: we assume the order is strictly enforced!
  // if you implement streaming (mix of models and segments) you will have to rewrite this!

  const afterTheHeaders = 2
  const afterTheModels = afterTheHeaders + expectedNumberOfModels

  // note: if there are no expected models, maybeModels will be empty
  const maybeModels = rawData.slice(afterTheHeaders, afterTheModels) as ClapModel[]

  const maybeSegments = rawData.slice(afterTheModels) as ClapSegment[]

  const clapModels: ClapModel[] = maybeModels.map(({
    id,
    category,
    triggerName,
    label,
    description,
    author,
    thumbnailUrl,
    seed,
    assetSourceType,
    assetUrl,
    age,
    gender,
    region,
    appearance,
    voiceVendor,
    voiceId,
  }) => ({
    // TODO: we should verify each of those, probably
    id,
    category,
    triggerName,
    label,
    description,
    author,
    thumbnailUrl,
    seed,
    assetSourceType,
    assetUrl,
    age,
    gender,
    region,
    appearance,
    voiceVendor,
    voiceId,
  }))


  const clapSegments: ClapSegment[] = maybeSegments.map(({
    id,
    track,
    startTimeInMs,
    endTimeInMs,
    category,
    modelId,
    prompt,
    outputType,
    renderId,
    status,
    assetUrl,
    outputGain,
    seed,
  }) => ({
    // TODO: we should verify each of those, probably
    id,
    track,
    startTimeInMs,
    endTimeInMs,
    category,
    modelId,
    prompt,
    outputType,
    renderId,
    status,
    assetUrl,
    outputGain,
    seed,
  }))

  return {
    meta: clapMeta,
    models: clapModels,
    segments: clapSegments
  }
}

