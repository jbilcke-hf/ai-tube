import YAML from "yaml"
import { v4 as uuidv4 } from "uuid"

import { ClapHeader, ClapMeta, ClapModel, ClapProject, ClapScene, ClapSegment, ClapStreamType } from "./types"
import { getValidNumber } from "@/lib/utils/getValidNumber"
import { dataUriToBlob } from "@/app/api/utils/dataUriToBlob"

type StringOrBlob = string | Blob

/**
 * Import a clap file from various data sources into an ClapProject
 * 
 * Inputs can be:
 * - a Clap project (which is an object)
 * - an URL to a remote .clap file
 * - a string containing a YAML array
 * - a data uri containing a gzipped YAML array
 * - a Blob containing a gzipped YAML array
 * 
 * note: it is not really async, because for some reason YAML.parse is a blocking call like for JSON,
 * there is no async version although we are now in the 20s not 90s
 */
export async function parseClap(src?: ClapProject | string | Blob, debug = false): Promise<ClapProject> {

  try {
    if (typeof src === "object" && Array.isArray(src?.scenes) && Array.isArray(src?.models)) {
      if (debug) {
        console.log("parseClap: input is already a Clap file, nothing to do:", src)
      }
      // we can skip verification
      return src as ClapProject
    }
  } catch (err) {
    // well, this is not a clap project
  }

  let stringOrBlob = (src || "") as StringOrBlob

  // both should work
  const dataUriHeader1 = "data:application/x-gzip;base64,"
  const dataUriHeader2 = "data:application/octet-stream;base64,"

  const inputIsString = typeof stringOrBlob === "string"
  const inputIsDataUri = typeof stringOrBlob === "string" ? stringOrBlob.startsWith(dataUriHeader1) || stringOrBlob.startsWith(dataUriHeader2) : false
  const inputIsRemoteFile = typeof stringOrBlob === "string" ? (stringOrBlob.startsWith("http://") || stringOrBlob.startsWith("https://")) : false

  let inputIsBlob = typeof stringOrBlob !== "string"

  let inputYamlArrayString = ""

  if (debug) {
    console.log(`parseClap: pre-analysis: ${JSON.stringify({
      inputIsString,
      inputIsBlob,
      inputIsDataUri,
      inputIsRemoteFile
    }, null, 2)}`)
  }

  if (typeof stringOrBlob === "string") {
    if (debug) {
      console.log("parseClap: input is a string ", stringOrBlob.slice(0, 120))
    }
    if (inputIsDataUri) {
      if (debug) {
        console.log(`parseClap: input is a data uri archive`)
      }
      stringOrBlob = dataUriToBlob(stringOrBlob, "application/x-gzip")
      if (debug) {
        console.log(`parseClap: inputBlob = `, stringOrBlob)
      }
      inputIsBlob = true
    } else if (inputIsRemoteFile) {
      try {
        if (debug) {
          console.log(`parseClap: input is a remote .clap file`)
        }
        const res = await fetch(stringOrBlob)
        stringOrBlob = await res.blob()
        if (!stringOrBlob) { throw new Error("blob is empty") }
        inputIsBlob = true
      } catch (err) {
        // url seems invalid
        throw new Error(`failed to download the .clap file (${err})`)
      }
    } else {
      if (debug) {
        console.log("parseClap: input is a text string containing a YAML array")
      }
      inputYamlArrayString = stringOrBlob
      inputIsBlob = false
    }
  }

  if (typeof stringOrBlob !== "string" && stringOrBlob) {
    if (debug) {
      console.log("parseClap: decompressing the blob..")
    }
    // Decompress the input blob using gzip
    const decompressedStream = stringOrBlob.stream().pipeThrough(new DecompressionStream('gzip'))

    try {
      // Convert the stream to text using a Response object
      const decompressedOutput = new Response(decompressedStream)
      // decompressedOutput.headers.set("Content-Type", "application/x-gzip")
      if (debug) {
        console.log("parseClap: decompressedOutput: ", decompressedOutput)
      }
      // const blobAgain = await decompressedOutput.blob()
      inputYamlArrayString = await decompressedOutput.text()

      if (debug && inputYamlArrayString) {
        console.log("parseClap: successfully decompressed the blob!")
      }
    } catch (err) {
      const message = `parseClap: failed to decompress (${err})`
      console.error(message)
      throw new Error(message)
    }
  }

  // we don't need this anymore I think
  // new Blob([inputStringOrBlob], { type: "application/x-yaml" })

  let maybeArray: any = {}
  try {
    if (debug) {
      console.log("parseClap: parsing the YAML array..")
    }
    // Parse YAML string to raw data
    maybeArray = YAML.parse(inputYamlArrayString)
  } catch (err) {
    throw new Error("invalid clap file (input string is not YAML)")
  }

  if (!Array.isArray(maybeArray) || maybeArray.length < 2) {
    throw new Error("invalid clap file (need a clap format header block and project metadata block)")
  }

  if (debug) {
    console.log("parseClap: the YAML seems okay, continuing decoding..")
  }

  const maybeClapHeader = maybeArray[0] as ClapHeader

  if (maybeClapHeader.format !== "clap-0") {
    throw new Error("invalid clap file (sorry, but you can't make up version numbers like that)")
  }


  const maybeClapMeta = maybeArray[1] as ClapMeta

  const clapMeta: ClapMeta = {
    id: typeof maybeClapMeta.title === "string" ? maybeClapMeta.id : uuidv4(),
    title: typeof maybeClapMeta.title === "string" ? maybeClapMeta.title : "",
    description: typeof maybeClapMeta.description === "string" ? maybeClapMeta.description : "",
    synopsis: typeof maybeClapMeta.synopsis === "string" ? maybeClapMeta.synopsis : "",
    licence: typeof maybeClapMeta.licence === "string" ? maybeClapMeta.licence : "",
    orientation: maybeClapMeta.orientation === "portrait" ? "portrait" : maybeClapMeta.orientation === "square" ? "square" : "landscape",
    width: getValidNumber(maybeClapMeta.width, 256, 8192, 1024),
    height: getValidNumber(maybeClapMeta.height, 256, 8192, 576),
    defaultVideoModel: typeof maybeClapMeta.defaultVideoModel === "string" ? maybeClapMeta.defaultVideoModel : "SVD",
    extraPositivePrompt: Array.isArray(maybeClapMeta.extraPositivePrompt) ? maybeClapMeta.extraPositivePrompt : [],
    screenplay: typeof maybeClapMeta.screenplay === "string" ? maybeClapMeta.screenplay : "",
    streamType: (typeof maybeClapMeta.streamType == "string" ? maybeClapMeta.streamType : "static") as ClapStreamType,
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
  const expectedNumberOfScenes = maybeClapHeader.numberOfScenes || 0
  const expectedNumberOfSegments = maybeClapHeader.numberOfSegments || 0

  // note: we assume the order is strictly enforced!
  // if you implement streaming (mix of models and segments) you will have to rewrite this!

  const afterTheHeaders = 2
  const afterTheModels = afterTheHeaders + expectedNumberOfModels

  const afterTheScenes = afterTheModels + expectedNumberOfScenes

  // note: if there are no expected models, maybeModels will be empty
  const maybeModels = maybeArray.slice(afterTheHeaders, afterTheModels) as ClapModel[]

  // note: if there are no expected scenes, maybeScenes will be empty
  const maybeScenes = maybeArray.slice(afterTheModels, afterTheScenes) as ClapScene[]

  const maybeSegments = maybeArray.slice(afterTheScenes) as ClapSegment[]

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

  const clapScenes: ClapScene[] = maybeScenes.map(({
    id,
    scene,
    line,
    rawLine,
    sequenceFullText,
    sequenceStartAtLine,
    sequenceEndAtLine,
    startAtLine,
    endAtLine,
    events,
  }) => ({
    id,
    scene,
    line,
    rawLine,
    sequenceFullText,
    sequenceStartAtLine,
    sequenceEndAtLine,
    startAtLine,
    endAtLine,
    events: events.map(e => e)
  }))
  
  const clapSegments: ClapSegment[] = maybeSegments.map(({
    id,
    track,
    startTimeInMs,
    endTimeInMs,
    category,
    modelId,
    sceneId,
    prompt,
    label,
    outputType,
    renderId,
    status,
    assetUrl,
    assetDurationInMs,
    createdBy,
    editedBy,
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
    sceneId,
    prompt,
    label,
    outputType,
    renderId,
    status,
    assetUrl,
    assetDurationInMs,
    createdBy,
    editedBy,
    outputGain,
    seed,
  }))

  if (debug) {
    console.log(`parseClap: successfully parsed ${clapModels.length} models, ${clapScenes.length} scenes and ${clapSegments.length} segments`)
  }
  return {
    meta: clapMeta,
    models: clapModels,
    scenes: clapScenes,
    segments: clapSegments
  }
}
