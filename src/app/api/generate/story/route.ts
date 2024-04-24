import { NextResponse, NextRequest } from "next/server"

import { generateClapFromSimpleStory } from "@/lib/clap/generateClapFromSimpleStory"
import { serializeClap } from "@/lib/clap/serializeClap"

// a helper to generate Clap stories from a few sentences
// this is mostly used by external apps such as the Stories Factory
export async function POST(req: NextRequest) {

  const request = await req.json() as {
    story: string[]
    // can add more stuff for the V2 of Stories Factory
  }
  
  const story = Array.isArray(request?.story) ? request.story : []

  if (!story.length) { throw new Error(`please provide at least oen sentence for the story`) }

  const clap = generateClapFromSimpleStory({
    story,
    // can add more stuff for the V2 of Stories Factory
  })

  return new NextResponse(await serializeClap(clap), {
    status: 200,
    headers: new Headers({ "content-type": "application/x-gzip" }),
  })
}
