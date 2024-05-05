import { createSecretKey } from "node:crypto"

export const secretKey = createSecretKey(`${process.env.API_SECRET_JWT_KEY || ""}`, 'utf-8')
export const issuer = `${process.env.API_SECRET_JWT_ISSUER || ""}`
export const audience = `${process.env.API_SECRET_JWT_AUDIENCE || ""}`