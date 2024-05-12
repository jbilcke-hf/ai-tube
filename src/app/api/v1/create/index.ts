"use server"

import { ClapProject, getValidNumber, newClap, newSegment, ClapSegmentCategory, ClapOutputType, ClapMediaOrientation } from "@aitube/clap"

import { sleep } from "@/lib/utils/sleep"
import { predict } from "@/app/api/providers/huggingface/predictWithHuggingFace"
import { parseRawStringToYAML } from "@/app/api/parsers/parseRawStringToYAML"
import { LatentStory } from "@/app/api/v1/types"

import { systemPrompt } from "./systemPrompt"
import { generateMusicPrompts } from "../edit/music/generateMusicPrompt"
import { clapToLatentStory } from "../edit/entities/clapToLatentStory"

// a helper to generate Clap stories from a few sentences
// this is mostly used by external apps such as the Stories Factory
export async function create(request: {
  prompt?: string
  width?: number
  height?: number
  turbo?: boolean
}= {
  prompt: "",
  width: 1024,
  height: 576,
  turbo: false,
}): Promise<ClapProject> {

  // we limit to 512 characters
  const prompt = `${request?.prompt || ""}`.trim().slice(0, 512)

  console.log("api/v1/create(): request:", request)

  if (!prompt.length) { throw new Error(`please provide a prompt`) }

  const width = getValidNumber(request?.width, 256, 8192, 1024)
  const height = getValidNumber(request?.height, 256, 8192, 576)
  const turbo = request?.turbo ? true : false
  
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
    turbo,
  })

  // console.log("api/v1/create(): rawString: ", rawString)

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
      turbo,
    })
  
    // console.log("api/v1/create(): rawString: ", rawString)
  
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
      title: prompt.split(",").shift() || "",
      description: prompt,
      synopsis: "",
      licence: "",
      orientation:
        width > height ? ClapMediaOrientation.LANDSCAPE :
        height > width ? ClapMediaOrientation.PORTRAIT :
        ClapMediaOrientation.SQUARE,
      width,
      height,
      isInteractive: false,
      isLoop: false,
      durationInMs: shots.length * defaultSegmentDurationInMs,
      defaultVideoModel: "AnimateDiff-Lightning",
    }
  })

  for (const { comment, image, voice } of shots) {

    console.log(`api/v1/create():  - ${comment}`)

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

    clap.segments.push(newSegment({
      track: 0,
      startTimeInMs: currentElapsedTimeInMs,
      endTimeInMs: currentElapsedTimeInMs + defaultSegmentDurationInMs,
      assetDurationInMs: defaultSegmentDurationInMs,
      category: ClapSegmentCategory.VIDEO,
      prompt: image,
      outputType: ClapOutputType.VIDEO,
      status: "to_generate",
    }))

    clap.segments.push(newSegment({
      track: 1,
      startTimeInMs: currentElapsedTimeInMs,
      endTimeInMs: currentElapsedTimeInMs + defaultSegmentDurationInMs,
      assetDurationInMs: defaultSegmentDurationInMs,
      category: ClapSegmentCategory.STORYBOARD,
      prompt: image,
      outputType: ClapOutputType.IMAGE,
      status: "to_generate",
    }))

    clap.segments.push(newSegment({
      track: 2,
      startTimeInMs: currentElapsedTimeInMs,
      endTimeInMs: currentElapsedTimeInMs + defaultSegmentDurationInMs,
      assetDurationInMs: defaultSegmentDurationInMs,
      category: ClapSegmentCategory.INTERFACE,
      prompt: comment,
      // assetUrl: `data:text/plain;base64,${btoa(comment)}`,
      assetUrl: comment,
      outputType: ClapOutputType.TEXT,
      status: "to_generate",
    }))

    clap.segments.push(newSegment({
      track: 3,
      startTimeInMs: currentElapsedTimeInMs,
      endTimeInMs: currentElapsedTimeInMs + defaultSegmentDurationInMs,
      assetDurationInMs: defaultSegmentDurationInMs,
      category: ClapSegmentCategory.DIALOGUE,
      prompt: voice,
      outputType: ClapOutputType.AUDIO,
      status: "to_generate",
    }))

    // the presence of a camera is mandatory
    clap.segments.push(newSegment({
      track: 4,
      startTimeInMs: currentElapsedTimeInMs,
      endTimeInMs: currentElapsedTimeInMs + defaultSegmentDurationInMs,
      assetDurationInMs: defaultSegmentDurationInMs,
      category: ClapSegmentCategory.CAMERA,
      prompt: "video",
      outputType: ClapOutputType.TEXT,
      status: "to_generate",
    }))

    currentElapsedTimeInMs += defaultSegmentDurationInMs
  }

  // one more thing: music!
  let musicPrompts: string[] = []
  
  try {
    musicPrompts = await generateMusicPrompts({
      prompt,
      latentStory: await clapToLatentStory(clap)
    })
    const musicPrompt = musicPrompts.at(0)
    if (!musicPrompt) { throw new Error(`not enough music prompts`) }

    // console.log("musicPrompt:", musicPrompt)

    clap.segments.push(newSegment({
      track: 5,
      startTimeInMs: 0,
      endTimeInMs: currentElapsedTimeInMs,
      assetDurationInMs: currentElapsedTimeInMs,
      category: ClapSegmentCategory.MUSIC,
      prompt: musicPrompt,
      outputType: ClapOutputType.AUDIO,
      status: "to_generate",
    }))
  } catch (err) {
    console.error(`[api/v1/create] failed to generate music prompts`)
    musicPrompts.push("lofi hiphop loop")
  }

  return clap
}
