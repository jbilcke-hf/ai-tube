import { Redis } from "@upstash/redis"
import { Query } from "@upstash/query"

import { redisToken, redisUrl } from "./config"

export const redis = new Redis({
  url: redisUrl,
  token: redisToken
})

/*
const q = new Redis({
  url: redisUrl,
  token: redisToken,
  automaticDeserialization: false, // redis query needs it to false?
})
*/

