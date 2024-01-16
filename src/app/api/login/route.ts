import querystring from "node:querystring"
import { NextResponse, NextRequest } from "next/server"

const defaultState = JSON.stringify({
  nonce: "",
  redirectUri: "https://aitube.at/api/login",
  state: JSON.stringify({ redirectTo: "/" })
})

export async function GET(req: NextRequest) {
 // we are going to pass the whole thing unchanged to the AI Tube frontend
 const params = req.url.split("/api/login").pop() || ""

  
 const query = querystring.parse(params)

  console.log("Received GET /api/login:", params)
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

  return NextResponse.redirect(`https://aitube.at${redirectTo}${params}`)
}

export async function POST(req: NextRequest, res: NextResponse) {
  // we are going to pass the whole thing unchanged to the AI Tube frontend
  const params = req.url.split("/api/login").pop() || ""

  
  const query = querystring.parse(params)

  console.log("Received POST /api/login:", params)
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
  // const redirectTo = `${state.redirectTo || "/"}`

  // for now we have to always return to /account, since this is where
  // the oauth "finisher" code resides
  const redirectTo = "/account"


  return NextResponse.redirect(`https://aitube.at${redirectTo}${params}`)
}