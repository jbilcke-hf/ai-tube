import { jwtVerify } from "jose"

import { secretKey } from "./config"
import { parseToken } from "./parseToken"

export async function throwIfInvalidToken(input?: any): Promise<boolean> {

  // note: this performs a decodeURI, but I'm not sure we need to
  const token = parseToken(input)

  // verify token
  const { payload, protectedHeader } = await jwtVerify(token, secretKey, {
    issuer: `${process.env.API_SECRET_JWT_ISSUER || ""}`, // issuer
    audience: `${process.env.API_SECRET_JWT_AUDIENCE || ""}`, // audience
  })

  // log values to console
  console.log(payload)
  console.log(protectedHeader)

  return true
}