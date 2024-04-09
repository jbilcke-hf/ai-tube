import { computeSha256 } from "./computeSha256"

const secretFingerprint = `${process.env.FINGERPRINT_KEY || ""}`

export function computeSecretFingerprint(input: string) {
  return computeSha256(`${secretFingerprint}_${input}`)
}