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
  console.log(`[api/v1/export] sending clap to https://jbilcke-hf-ai-tube-clap-exporter.hf.space?f=${format}`)

  const result = await fetch(
    // `http://localhost:7860?f=${format}`,
    `https://jbilcke-hf-ai-tube-clap-exporter.hf.space?f=${format}`,
    { method: "POST", body: await req.blob() }
  )

  console.log(`[api/v1/export] API responded: ${result.status} ${result.statusText}`)
  
  if (result.status !== 200) {
    let errorMessage = "unknown 500 error"
    try {
      let resp = await req.json()
      if (resp?.error) {
        errorMessage = resp?.error
      }
    } catch (err) {}

    console.log(`[api/v1/export] failed to generate the video (${errorMessage})`)
   
    return NextResponse.json({
      "error": errorMessage
    }, {
      status: 500,
    })
  }

  const blob = await result.blob()

  return new NextResponse(blob, {
    status: 200,
    headers: new Headers({ "content-type": `video/${format}` }),
  })
}