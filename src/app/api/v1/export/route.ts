import { NextResponse, NextRequest } from "next/server"
import queryString from "query-string"

type SupportedExportFormat = "mp4" | "webm"
const defaultExportFormat = "mp4"

// we hide/wrap the micro-service under a unified AiTube API
export async function POST(req: NextRequest, res: NextResponse) {

  const qs = queryString.parseUrl(req.url || "")
  const query = (qs || {}).query

  let format: SupportedExportFormat = defaultExportFormat
  try {
    format = decodeURIComponent(query?.f?.toString() || defaultExportFormat).trim() as SupportedExportFormat
    if (format !== "mp4" && format !== "webm") {
      format = defaultExportFormat
    }
  } catch (err) {}

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