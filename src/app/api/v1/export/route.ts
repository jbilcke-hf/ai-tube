import { NextResponse, NextRequest } from "next/server"
import queryString from "query-string"

import { parseSupportedExportFormat } from "@/app/api/parsers/parseSupportedExportFormat"
import { throwIfInvalidToken } from "@/app/api/v1/auth/throwIfInvalidToken"

// we hide/wrap the micro-service under a unified AiTube API
export async function POST(req: NextRequest, res: NextResponse) {
  await throwIfInvalidToken(req.headers.get("Authorization"))

  const qs = queryString.parseUrl(req.url || "")
  const query = (qs || {}).query

  const format = parseSupportedExportFormat(query?.f)

  // let's call our micro-service, which is currently open bar.
  const result = await fetch(
    `https://jbilcke-hf-ai-tube-clap-exporter.hf.space?f=${format}`,
    { method: "POST", body: await req.blob() }
  )

  const blob = await result.blob()

  return new NextResponse(blob, {
    status: 200,
    headers: new Headers({ "content-type": `video/${format}` }),
  })
}