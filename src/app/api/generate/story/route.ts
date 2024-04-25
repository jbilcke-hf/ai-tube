import { NextResponse, NextRequest } from "next/server"

import { generateClapFromSimpleStory } from "@/lib/clap/generateClapFromSimpleStory"
import { serializeClap } from "@/lib/clap/serializeClap"
import { getValidNumber } from "@/lib/utils/getValidNumber"
import { newClap } from "@/lib/clap/newClap"
import { predict } from "../../providers/huggingface/predictWithHuggingFace"
import { systemPrompt } from "./systemPrompt"
import { parseRawStringToYAML } from "../../utils/parseRawStringToYAML"
import { newSegment } from "@/lib/clap/newSegment"

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

  const clap = newClap({
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

    currentSegmentDurationInMs += defaultSegmentDurationInMs
  }

  // TODO replace by Clap file streaming
  return new NextResponse(await serializeClap(clap), {
    status: 200,
    headers: new Headers({ "content-type": "application/x-gzip" }),
  })
}
