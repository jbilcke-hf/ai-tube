import { NextResponse, NextRequest } from "next/server"
import queryString from "query-string"

import { predict } from "../../providers/huggingface/predictWithHuggingFace"
import { systemPrompt } from "./systemPrompt"

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

  const userPrompt = `HTML snippet to generate: ${prompt}`

  const html = await predict({
    systemPrompt,
    userPrompt,
    nbMaxNewTokens: 400,
    prefix: "<div class=\"",
  })

  console.log("generated div: ", html)

  // const html = `<html><head></head><body></body></html>`

  return new NextResponse(html, {
    status: 200,
    headers: new Headers({ "content-type": "text/html" }),
  })
}
