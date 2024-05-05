import { SignJWT } from "jose"

import { secretKey, issuer, audience } from "./config"

// https://jmswrnr.com/blog/protecting-next-js-api-routes-query-parameters

export async function getToken(data: Record<string, any> = {}): Promise<string> {

  const jwtToken = await new SignJWT(data)
   .setProtectedHeader({
    alg: 'HS256'
   }) // algorithm
   .setIssuedAt()
   .setIssuer(issuer) // issuer
   .setAudience(audience) // audience
   .setExpirationTime("1 day") // token expiration time - to prevent hackers from re-using our URLs more than a day
   .sign(secretKey) // secretKey generated from previous step

  return jwtToken
}
