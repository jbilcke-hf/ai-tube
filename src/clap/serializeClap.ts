import YAML from "yaml"
import { v4 as uuidv4 } from "uuid"

import { ClapHeader, ClapMeta, ClapModel, ClapProject, ClapSegment } from "./types"
import { getValidNumber } from "@/lib/getValidNumber"

export async function serializeClap({
  meta, // ClapMeta
  models, // ClapModel[]
  segments, // ClapSegment[]
}: ClapProject): Promise<Blob> {
  
  // we play it safe, and we verify the structure of the parameters,
  // to make sure we generate a valid clap file
  const clapModels: ClapModel[] = models.map(({
    id,
    imageType,
    audioType,
    category,
    triggerName,
    label,
    description,
    author,
    thumbnailUrl,
    storageUrl,
    imagePrompt,
    audioPrompt,
  }) => ({
    id,
    imageType,
    audioType,
    category,
    triggerName,
    label,
    description,
    author,
    thumbnailUrl,
    storageUrl,
    imagePrompt,
    audioPrompt,
  }))

  const clapSegments: ClapSegment[] = segments.map(({
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

  const clapHeader: ClapHeader = {
    format: "clap-0",
    numberOfModels: clapModels.length,
    numberOfSegments: clapSegments.length,
  }

  const clapMeta: ClapMeta = {
    id: meta.id || uuidv4(),
    title: typeof meta.title === "string" ? meta.title : "Untitled",
    description: typeof meta.description === "string" ? meta.description : "",
    licence: typeof meta.licence === "string" ? meta.licence : "",
    orientation: meta.orientation === "portrait" ? "portrait" : meta.orientation === "square" ? "square" : "landscape",
    width: getValidNumber(meta.width, 256, 8192, 1024),
    height: getValidNumber(meta.height, 256, 8192, 576),
    defaultVideoModel:  typeof meta.defaultVideoModel === "string" ? meta.defaultVideoModel : "SVD",
    extraPositivePrompt: Array.isArray(meta.extraPositivePrompt) ? meta.extraPositivePrompt : [],
  }

  const entries = [
    clapHeader,
    clapMeta,
    ...clapModels,
    ...clapSegments
  ]

  const strigifiedResult = YAML.stringify(entries)

  // Convert the string to a Blob
  const blobResult = new Blob([strigifiedResult], { type: "application/x-yaml" })

   // Create a stream for the blob
   const readableStream = blobResult.stream();

   // Compress the stream using gzip
   const compressionStream = new CompressionStream('gzip');
   const compressedStream = readableStream.pipeThrough(compressionStream);

   // Create a new blob from the compressed stream
   const compressedBlob = await new Response(compressedStream).blob();

  return compressedBlob
}