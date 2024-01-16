import querystring from "node:querystring"
import { NextResponse, NextRequest } from "next/server"

const defaultState = JSON.stringify({
  nonce: "",
  redirectUri: "https://aitube.at/api/login",
  state: JSON.stringify({ redirectTo: "/" })
})

export async function GET(req: NextRequest) {

  const query = querystring.parse(req.url)

  console.log("Received GET /api/login:", req.url)
  console.log(query)


  // we are only interested in our own data, actually
  // const code = `${query.code || ""}` // <-- ignored, we will send it as-is
  const {
    // nonce, // <-- ignored, we will send it as-is
    // redirectUri, // <-- ignored, we will send it as-is
    state // <-- this is defined by us!
  } = JSON.parse(`${query.state || defaultState}`)

  // this is the path of the AI Tube page which the user was browser
  // eg. this can be /account, /, or nothing
  const redirectTo = `${state.redirectTo || "/"}`

  // we are going to pass the whole thing unchanged to the AI Tube frontend
  const rest = req.url.split("/api/login").pop()

  return NextResponse.redirect(`https://aitube.at${redirectTo}${rest}`)
}

export async function POST(req: NextRequest, res: NextResponse) {
  const query = querystring.parse(req.url)

  console.log("Received POST /api/login:", req.url)
  console.log(query)


  // we are only interested in our own data, actually
  // const code = `${query.code || ""}` // <-- ignored, we will send it as-is
  const {
    // nonce, // <-- ignored, we will send it as-is
    // redirectUri, // <-- ignored, we will send it as-is
    state // <-- this is defined by us!
  } = JSON.parse(`${query.state || defaultState}`)

  // this is the path of the AI Tube page which the user was browser
  // eg. this can be /account, /, or nothing
  const redirectTo = `${state.redirectTo || "/"}`

  // we are going to pass the whole thing unchanged to the AI Tube frontend
  const rest = req.url.split("/api/login").pop()

  return NextResponse.redirect(`https://aitube.at${redirectTo}${rest}`)
}