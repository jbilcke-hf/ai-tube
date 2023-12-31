"use server"

import { WhoAmIUser, whoAmI } from "@/huggingface/hub/src"
import {  UserInfo } from "@/types/general"
import { adminApiKey } from "./config"
import { redis } from "./redis"

export async function getCurrentUser(apiKey: string): Promise<UserInfo> {
  if (!apiKey) {
    throw new Error(`the apiKey is required`)
  }

  const credentials = { accessToken: apiKey }
  
  const huggingFaceUser = await whoAmI({ credentials }) as unknown as WhoAmIUser

  const id = huggingFaceUser.id

  const user: UserInfo = {
    id,
    type: apiKey === adminApiKey ? "admin" : "normal",
    userName: huggingFaceUser.name,
    fullName: huggingFaceUser.fullname,
    thumbnail: huggingFaceUser.avatarUrl,
    channels: [],
    hfApiToken: apiKey, // <- on purpose, and safe (only this user sees their token)
  }
  
  await redis.set(`users:${id}`, user)

  // the user id is not available in the channel info, only user name (slug)
  // so we use this projection to recover the ID from a slug
  // alternatively we could also use a Redis index, to avoid doing two calls
  // (for get id and get user)
  await redis.set(`userSlugToId:${user.userName}`, user.id)

  return user
}

/**
 * Attention this returns the *full* user, including the API key
 * 
 * We use the API on behalf of the user, but it is confidential nevertheless,
 * so we should not share it with 3rd parties unbeknownst to the user
 * 
 * @param hfUserId 
 * @returns 
 */
export async function getUserFromId(hfUserId: string): Promise<UserInfo | undefined> {

  const maybeUser = await redis.get<UserInfo>(`users:${hfUserId}`)

  if (maybeUser?.id) {
    return maybeUser
  }

  return undefined
}

export async function getUserIdFromSlug(hfUserSlugName: string): Promise<string> {

  // the user id is not available in the channel info, only user name (slug)
  // so we use a projection to recover the ID from a slug
  const maybeUserId = await redis.get<string>(`userSlugToId:${hfUserSlugName}`)
  return maybeUserId || ""
}

/**
 * This function doesn NOT return the user apiKey, for security reasons
 * 
 * We use the API on behalf of the user, but it is confidential nevertheless,
 * so we should not share it with 3rd parties unbeknownst to the user
 * 
 * @param userIdOrSlugName 
 * @returns 
 */
export async function getUser(userIdOrSlugName: string): Promise<UserInfo | undefined> {
  // the user id is not available in the channel info, only user name (slug)
  // so we use a projection to recover the ID from a slug
  // alternatively, we could also use a Redis index, to avoid doing two calls
  // (for get id and get user)
  let maybeUserId = await getUserIdFromSlug(userIdOrSlugName)
  
  maybeUserId ||= userIdOrSlugName

  const maybeUser = await getUserFromId(maybeUserId)

  // sanitize the output a bit
  if (maybeUser) {
    const publicFacingUser: UserInfo = {
      ...maybeUser,
      hfApiToken: undefined, // <-- important!
    }
    delete publicFacingUser.hfApiToken
    return publicFacingUser
  }

  return undefined
}

export async function getUsers(ids: string[]): Promise<Record<string, UserInfo>> {
  try {
    const maybeUsers = await redis.mget<UserInfo[]>(ids.map(userId => `users:${userId}`))

    const usersById: Record<string, UserInfo> = {}

    maybeUsers.forEach((user, index) => {
      if (user?.id) {
        const publicFacingUser: UserInfo = {
          ...user,
          hfApiToken: undefined, // <-- important!
        }
        delete publicFacingUser.hfApiToken
        usersById[user.id] = publicFacingUser
      }
    })

    return usersById
  } catch (err) {
    return {}
  }
}