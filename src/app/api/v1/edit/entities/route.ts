import { NextResponse, NextRequest } from "next/server"
import queryString from "query-string"
import { newClap, parseClap, serializeClap } from "@aitube/clap"

import { parseCompletionMode } from "@/app/api/parsers/parseCompletionMode"
import { parseClapEntityPrompts } from "@/app/api/parsers/parseEntityPrompts"
import { throwIfInvalidToken } from "@/app/api/v1/auth/throwIfInvalidToken"

import { editEntities } from "."
import { ClapCompletionMode } from "@aitube/client"

export async function POST(req: NextRequest) {
  await throwIfInvalidToken(req.headers.get("Authorization"))

  const qs = queryString.parseUrl(req.url || "")
  const query = (qs || {}).query

  const mode = parseCompletionMode(query?.c)
  // const prompt = parsePrompt(query?.p)

  const entityPrompts = parseClapEntityPrompts(query?.e)

  const blob = await req.blob()

  const existingClap = await parseClap(blob)

  const newerClap = mode === ClapCompletionMode.FULL ? existingClap : newClap()

  await editEntities({
    existingClap,
    newerClap,
    entityPrompts,
    mode
  })
  
  console.log(`[api/edit/entities] returning the newer clap extended with the entities`)

  return new NextResponse(await serializeClap(newerClap), {
    status: 200,
    headers: new Headers({ "content-type": "application/x-gzip" }),
  })
}
