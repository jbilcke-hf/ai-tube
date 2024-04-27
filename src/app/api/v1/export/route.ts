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

  NextResponse.redirect(`${
    process.env.AI_TUBE_CLAP_EXPORTER_URL || "http://localhost:7860"
  }?f=${format}`)
}
/*
Alternative solution (in case the redirect doesn't work):

We could also grab the blob and forward it, like this:

  const data = fetch(
    "https://jbilcke-hf-ai-tube-clap-exporter.hf.space",
    { method: "POST", body: await req.blob() }
  )
  const blob = data.blob()

Then return the blob with the right Content-Type using NextResponse
*/