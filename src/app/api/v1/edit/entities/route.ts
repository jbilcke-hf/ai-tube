import { NextResponse, NextRequest } from "next/server"
import queryString from "query-string"
import { newClap, parseClap, serializeClap } from "@aitube/clap"

import { getToken } from "@/app/api/auth/getToken"
import { parseCompletionMode } from "@/app/api/parsers/parseCompletionMode"

import { editEntities } from "."

export async function POST(req: NextRequest) {

  const qs = queryString.parseUrl(req.url || "")
  const query = (qs || {}).query

  const mode = parseCompletionMode(query?.c)
  // const prompt = parsePrompt(query?.p)

  const jwtToken = await getToken({ user: "anonymous" })

  const blob = await req.blob()

  const existingClap = await parseClap(blob)

  const newerClap = mode === "full" ? existingClap : newClap()

  await editEntities({
    existingClap,
    newerClap,
    mode
  })
  
  console.log(`[api/edit/entities] returning the newer clap extended with the entities`)

  return new NextResponse(await serializeClap(newerClap), {
    status: 200,
    headers: new Headers({ "content-type": "application/x-gzip" }),
  })
}
