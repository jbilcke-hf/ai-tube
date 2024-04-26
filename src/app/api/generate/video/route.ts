import { NextResponse, NextRequest } from "next/server"

// we hide/wrap the micro-service under a unified AiTube API
export async function POST(req: NextRequest, res: NextResponse) {

  NextResponse.redirect(`${process.env.AI_TUBE_CLAP_EXPORTER_URL || "http://localhost:7860"}`)
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