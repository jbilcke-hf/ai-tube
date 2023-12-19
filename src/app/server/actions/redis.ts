import { Redis } from "@upstash/redis"

import { redisToken, redisUrl } from "./config"

export const redis = new Redis({
  url: redisUrl,
  token: redisToken
})

