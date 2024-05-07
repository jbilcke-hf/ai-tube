"use server"

import { ClapProject, getValidNumber, newClap, newSegment, ClapSegmentCategory, ClapOutputType } from "@aitube/clap"

import { sleep } from "@/lib/utils/sleep"
import { predict } from "@/app/api/providers/huggingface/predictWithHuggingFace"
import { parseRawStringToYAML } from "@/app/api/parsers/parseRawStringToYAML"
import { LatentStory } from "@/app/api/v1/types"

import { systemPrompt } from "./systemPrompt"

// a helper to generate Clap stories from a few sentences
// this is mostly used by external apps such as the Stories Factory
export async function create(request: {
  prompt?: string
  width?: number
  height?: number
}= {
  prompt: "",
  width: 1024,
  height: 576,
}): Promise<ClapProject> {
  const prompt = `${request?.prompt || ""}`.trim()

  console.log("api/v1/create(): request:", request)

  if (!prompt.length) { throw new Error(`please provide a prompt`) }

  const width = getValidNumber(request?.width, 256, 8192, 1024)
  const height = getValidNumber(request?.height, 256, 8192, 576)

  const userPrompt = `Movie story to generate: ${prompt}

Output: `

  const prefix = "```yaml\n"
  const nbMaxNewTokens = 1400

  // TODO use streaming for the Hugging Face prediction
  //
  // note that a Clap file is actually a YAML stream of documents
  // so technically we could stream everything from end-to-end
  // (but I haven't coded the helpers to do this yet)
  let rawString = await predict({
    systemPrompt,
    userPrompt,
    nbMaxNewTokens,
    prefix,
  })

  console.log("api/v1/create(): rawString: ", rawString)

  let shots: LatentStory[] = []
  
  let maybeShots = parseRawStringToYAML<LatentStory[]>(rawString, [])

  if (!Array.isArray(maybeShots) || maybeShots.length === 0) {
    console.log(`api/v1/create(): failed to generate shots.. trying again`)
    
    await sleep(2000)

    rawString = await predict({
      systemPrompt,
      userPrompt: userPrompt + ".", // we trick the Hugging Face cache
      nbMaxNewTokens,
      prefix,
    })
  
    console.log("api/v1/create(): rawString: ", rawString)
  
    maybeShots = parseRawStringToYAML<LatentStory[]>(rawString, [])
    if (!Array.isArray(maybeShots) || maybeShots.length === 0) {
      console.log(`api/v1/create(): failed to generate shots for the second time, which indicates an issue with the Hugging Face API`)
    }
  }

  if (maybeShots.length) {
    shots = maybeShots
  } else {
    throw new Error(`Hugging Face Inference API failure (the model failed to generate the shots)`)
  }

  console.log(`api/v1/create(): generated ${shots.length} shots`)

  // this is approximate - TTS generation will determine the final duration of each shot
  const defaultSegmentDurationInMs = 7000

  let currentElapsedTimeInMs = 0

  const clap: ClapProject = newClap({
    meta: {
      title: "Not needed", // we don't need a title actually
      description: "This video has been generated using AI",
      synopsis: "",
      licence: "",
      orientation: width > height ? "landscape" : height > width ? "portrait" : "square",
      width,
      height,
      isInteractive: false,
      isLoop: false,
      durationInMs: shots.length * defaultSegmentDurationInMs,
      defaultVideoModel: "AnimateDiff-Lightning",
    }
  })

  for (const { title, image, voice } of shots) {

    console.log(`api/v1/create():  - ${title}`)

    // note: it would be nice if we could have a convention saying that
    // track 0 is for videos and track 1 storyboards
    // 
    // however, that's a bit constraining as people will generate .clap
    // using all kind of tools and development experience,
    // and they may not wish to learn the Clap protocol format completely
    //
    // TL;DR: 
    // we should fix the Clap file editor to make it able to react videos
    // from any track number


    /*
    we disable it, because we don't generate animated videos yet
    clap.segments.push(newSegment({
      track: 0,
      category: "video",
      prompt: image,
      outputType: "video"
    }))
    */

    clap.segments.push(newSegment({
      track: 1,
      startTimeInMs: currentElapsedTimeInMs,
      assetDurationInMs: defaultSegmentDurationInMs,
      category: ClapSegmentCategory.STORYBOARD,
      prompt: image,
      outputType: ClapOutputType.IMAGE,
    }))

    clap.segments.push(newSegment({
      track: 2,
      startTimeInMs: currentElapsedTimeInMs,
      assetDurationInMs: defaultSegmentDurationInMs,
      category: "interface",
      prompt: title,
      // assetUrl: `data:text/plain;base64,${btoa(title)}`,
      assetUrl: title,
      outputType: "text"
    }))

    clap.segments.push(newSegment({
      track: 3,
      startTimeInMs: currentElapsedTimeInMs,
      assetDurationInMs: defaultSegmentDurationInMs,
      category: "dialogue",
      prompt: voice,
      outputType: "audio"
    }))

    // the presence of a camera is mandatory
    clap.segments.push(newSegment({
      track: 4,
      startTimeInMs: currentElapsedTimeInMs,
      assetDurationInMs: defaultSegmentDurationInMs,
      category: "camera",
      prompt: "video",
      outputType: "text"
    }))

    currentElapsedTimeInMs += defaultSegmentDurationInMs
  }

  return clap
}
