import YAML from "yaml"
import { v4 as uuidv4 } from "uuid"

import { ClapHeader, ClapMeta, ClapProject, ClapSegment } from "@/types/clap"
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
    width: getValidNumber(maybeClapMeta.width, 256, 4096, 1024),
    height: getValidNumber(maybeClapMeta.height, 256, 4096, 1024),
    defaultVideoModel: typeof maybeClapMeta.defaultVideoModel === "string" ? maybeClapMeta.defaultVideoModel : "SVD",
  }

  const maybeSegments = rawData.slice(2) as ClapSegment[]

  const clapSegments: ClapSegment[] = Array.isArray(maybeSegments) ? maybeSegments.map(({
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
  })) : []

  return {
    meta: clapMeta,
    segments: clapSegments
  }
}
