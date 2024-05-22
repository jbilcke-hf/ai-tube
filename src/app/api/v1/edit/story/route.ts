import { NextResponse, NextRequest } from "next/server"
import queryString from "query-string"
import { ClapProject, ClapSegment, ClapSegmentCategory, newClap, parseClap, serializeClap } from "@aitube/clap"

import { parseCompletionMode } from "@/app/api/parsers/parseCompletionMode"
import { throwIfInvalidToken } from "@/app/api/v1/auth/throwIfInvalidToken"

import { ClapCompletionMode } from "@aitube/client"
import { parseTurbo } from "@/app/api/parsers/parseTurbo"
import { parsePrompt } from "@/app/api/parsers/parsePrompt"
import { extendClapStory } from "./extendClapStory"
import { parseNumericTime } from "@/app/api/parsers/parseNumericTime"

// a helper to extend a story
//
// we can assume it will be used to extend existing projects,
// so it is strongly recommended to NOT send the storyboards and videos!
export async function POST(req: NextRequest) {
  await throwIfInvalidToken(req.headers.get("Authorization"))

  const qs = queryString.parseUrl(req.url || "")
  const query = (qs || {}).query

  const prompt = parsePrompt(query?.p, false) // <- false, to make it non-mandatory
  const mode = parseCompletionMode(query?.c)
  const turbo = parseTurbo(query?.t)
  
  const startTimeInMs = parseNumericTime(query?.s, 0, 0, 0)
  const endTimeInMs = parseNumericTime(query?.e, 0, 0, 0)

  const blob = await req.blob()

  const existingClap: ClapProject = await parseClap(blob)

  if (!existingClap?.segments) { throw new Error(`no segment found in the provided clap!`) }
  
  const newerClap = mode === ClapCompletionMode.FULL ? existingClap : newClap({
    meta: existingClap.meta
  })

    // console.log(`api/v1/edit/story(): detected ${existingClap.segments.length} segments`)
  
    const allShotsSegments: ClapSegment[] = existingClap.segments.filter(s => s.category === ClapSegmentCategory.CAMERA)
    console.log(`api/v1/edit/story(): detected ${allShotsSegments.length} shots`)
  
    await extendClapStory({
      prompt,
      startTimeInMs: startTimeInMs > 0 ? startTimeInMs : undefined,
      endTimeInMs: endTimeInMs > 0 ? endTimeInMs : undefined,
      existingClap,
      newerClap,
      mode,
      turbo,
    })

  // console.log("DEBUG:", newerClap.segments)

  // console.log(`[api/v1/edit/storyboards] returning the clap augmented with storyboards`)

  return new NextResponse(await serializeClap(newerClap), {
    status: 200,
    headers: new Headers({ "content-type": "application/x-gzip" }),
  })
}
