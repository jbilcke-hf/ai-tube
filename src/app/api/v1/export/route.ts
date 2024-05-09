import { NextResponse, NextRequest } from "next/server"
import queryString from "query-string"

import { parseSupportedExportFormat } from "@/app/api/parsers/parseSupportedExportFormat"
import { throwIfInvalidToken } from "@/app/api/v1/auth/throwIfInvalidToken"
import { parseTurbo } from "../../parsers/parseTurbo"

// we hide/wrap the micro-service under a unified AiTube API
export async function POST(req: NextRequest, res: NextResponse) {
  await throwIfInvalidToken(req.headers.get("Authorization"))

  const qs = queryString.parseUrl(req.url || "")
  const query = (qs || {}).query

  const format = parseSupportedExportFormat(query?.f)
  const turbo = parseTurbo(query?.t)

  // the AI Tube Clap Exporter doesn't support turbo mode
  // this could be implemented by reducing the resolution, for instance
  // or rather, the non-turbo mode could be the one where we upscale

  // let's call our micro-service, which is currently open bar.
  // console.log("[api/v1/export] sending blob to ai-tube-clap-exporter.hf.space")

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