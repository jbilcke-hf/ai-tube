import { NextResponse, NextRequest } from "next/server"
import queryString from "query-string"

import { generateClap } from "../../generators/clap/generateClap"

export async function GET(req: NextRequest) {

const qs = queryString.parseUrl(req.url || "")
const query = (qs || {}).query

let prompt = ""
  try {
    prompt = decodeURIComponent(query?.p?.toString() || "").trim()
  } catch (err) {}
  if (!prompt) {
    return NextResponse.json({ error: 'no prompt provided' }, { status: 400 });
  }

  const blob = await generateClap({ prompt })

  return new NextResponse(blob, {
    status: 200,
    headers: new Headers({ "content-type": "application/x-gzip" }),
  })
}
