
import { Credentials } from "@/lib/huggingface/hub/src"

export const adminApiKey = `${process.env.ADMIN_HUGGING_FACE_API_TOKEN || ""}`
export const adminUsername = `${process.env.ADMIN_HUGGING_FACE_USERNAME || ""}`

export const adminCredentials: Credentials = { accessToken: adminApiKey }

export const redisUrl = `${process.env.UPSTASH_REDIS_REST_URL || ""}`
export const redisToken = `${process.env.UPSTASH_REDIS_REST_TOKEN || ""}`

export const developerMode = `${
  process.env.NEXT_PUBLIC_DEVELOPER_MODE || ""
}`.trim().toLowerCase() === "true"
