import { NextResponse, NextRequest } from "next/server"
import queryString from "query-string"
import { ClapProject, ClapSegment, ClapSegmentCategory, ClapSegmentStatus, newClap, parseClap, serializeClap } from "@aitube/clap"
import { ClapCompletionMode } from "@aitube/client"

import { parseCompletionMode } from "@/app/api/parsers/parseCompletionMode"
import { throwIfInvalidToken } from "@/app/api/v1/auth/throwIfInvalidToken"
import { parseTurbo } from "@/app/api/parsers/parseTurbo"

import { generateMusic } from "./generateMusic"

// a helper to generate speech for a Clap
export async function POST(req: NextRequest) {
  await throwIfInvalidToken(req.headers.get("Authorization"))

  const qs = queryString.parseUrl(req.url || "")
  const query = (qs || {}).query
  
  const mode = parseCompletionMode(query?.c)
  const turbo = parseTurbo(query?.t)
  
  const blob = await req.blob()

  const existingClap: ClapProject = await parseClap(blob)

  if (!existingClap?.segments) { throw new Error(`no segment found in the provided clap!`) }
  
  // console.log(`[api/edit/dialogues] detected ${existingClap.segments.length} segments`)
  
  const musicSegments: ClapSegment[] = existingClap.segments.filter(s => s.category === ClapSegmentCategory.MUSIC)
  // console.log(`[api/edit/dialogues] detected ${shotsSegments.length} shots`)

  const newerClap = mode === ClapCompletionMode.FULL ? existingClap : newClap({
    meta: existingClap.meta
  })
  
  const pendingMusicSegments = musicSegments.filter(s =>
    s.status === ClapSegmentStatus.TO_GENERATE
  )

  if (pendingMusicSegments.length > 1) {
    throw new Error(`Error, only one music track at a time can be generated with the V1 of the AiTube API`)
  }

  const musicSegment = pendingMusicSegments.at(0)

  await generateMusic({
    musicSegment,
    existingClap,
    newerClap,
    mode,
    turbo,
  })

  // console.log(`[api/edit/dialogues] returning the clap augmented with dialogues`)

  return new NextResponse(await serializeClap(newerClap), {
    status: 200,
    headers: new Headers({ "content-type": "application/x-gzip" }),
  })
}
