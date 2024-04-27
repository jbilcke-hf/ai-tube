import { NextResponse, NextRequest } from "next/server"
import { ClapProject, getValidNumber, newClap, newSegment, serializeClap } from "@aitube/clap"

import { predict } from "@/app/api/providers/huggingface/predictWithHuggingFace"
import { parseRawStringToYAML } from "@/app/api/utils/parseRawStringToYAML"

import { systemPrompt } from "./systemPrompt"

export type LatentStory = {
  title: string
  image: string
  voice: string
}

// a helper to generate Clap stories from a few sentences
// this is mostly used by external apps such as the Stories Factory
export async function POST(req: NextRequest) {

  const request = await req.json() as {
    prompt: string
    width: number
    height: number
    // can add more stuff for the V2 of Stories Factory
  }
  
  const prompt = `${request?.prompt || ""}`.trim()

  console.log("[api/generate/story] request:", request)

  if (!prompt.length) { throw new Error(`please provide a prompt`) }

  const width = getValidNumber(request?.width, 256, 8192, 1024)
  const height = getValidNumber(request?.height, 256, 8192, 576)

  const userPrompt = `Video story to generate: ${prompt}`

  // TODO use streaming for the Hugging Face prediction
  //
  // note that a Clap file is actually a YAML stream of documents
  // so technically we could stream everything from end-to-end
  // (but I haven't coded the helpers to do this yet)
  const rawString = await predict({
    systemPrompt,
    userPrompt,
    nbMaxNewTokens: 1200,
    prefix: "```yaml\n",
  })

  console.log("[api/generate/story] rawString: ", rawString)

  const shots = parseRawStringToYAML<LatentStory[]>(rawString, [])

  console.log("[api/generate/story] generated shots: ", shots)

  // this is approximate - TTS generation will determine the final duration of each shot
  const defaultSegmentDurationInMs = 5000

  let currentElapsedTimeInMs = 0
  let currentSegmentDurationInMs = defaultSegmentDurationInMs

  const clap: ClapProject = newClap({
    meta: {
      title: "Not needed", // we don't need a title actually
      description: "This video has been generated using AI",
      synopsis: "",
      licence: "Non Commercial",
      orientation: "vertical",
      width,
      height,
      isInteractive: false,
      isLoop: false,
      durationInMs: shots.length * defaultSegmentDurationInMs,
      defaultVideoModel: "AnimateDiff-Lightning",
    }
  })

  for (const { title, image, voice } of shots) {

    console.log(`[api/generate/story]  - ${title}`)

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
      startTimeInMs: currentSegmentDurationInMs,
      assetDurationInMs: defaultSegmentDurationInMs,
      category: "storyboard",
      prompt: image,
      outputType: "image"
    }))

    clap.segments.push(newSegment({
      track: 2,
      startTimeInMs: currentSegmentDurationInMs,
      assetDurationInMs: defaultSegmentDurationInMs,
      category: "interface",
      prompt: title,
      // assetUrl: `data:text/plain;base64,${btoa(title)}`,
      assetUrl: title,
      outputType: "text"
    }))

    clap.segments.push(newSegment({
      track: 3,
      startTimeInMs: currentSegmentDurationInMs,
      assetDurationInMs: defaultSegmentDurationInMs,
      category: "dialogue",
      prompt: voice,
      outputType: "audio"
    }))

    // the presence of a camera is mandatory
    clap.segments.push(newSegment({
      track: 4,
      startTimeInMs: currentSegmentDurationInMs,
      assetDurationInMs: defaultSegmentDurationInMs,
      category: "camera",
      prompt: "vertical video",
      outputType: "text"
    }))

    currentSegmentDurationInMs += defaultSegmentDurationInMs
  }

  // TODO replace by Clap file streaming
  return new NextResponse(await serializeClap(clap), {
    status: 200,
    headers: new Headers({ "content-type": "application/x-gzip" }),
  })
}
