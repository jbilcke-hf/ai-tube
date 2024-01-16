import { useEffect, useState, useTransition } from "react"
import { OAuthResult, oauthHandleRedirectIfPresent, oauthLoginUrl } from "@huggingface/hub"

import { useLocalStorage } from "usehooks-ts"

import { UserInfo } from "@/types/general"

import { useStore } from "./useStore"

import { localStorageKeys } from "./localStorageKeys"
import { defaultSettings } from "./defaultSettings"
import { getCurrentUser } from "../server/actions/users"

export function useCurrentUser({
  isLoginRequired = false
}: {
  // set this to true, and the page will automatically redirect to the
  // HF login page if the session is expired
  isLoginRequired?: boolean
} = {}): {
  user?: UserInfo
  login: (redirectUrl?: string) => void
  checkSession: (isLoginRequired: boolean) => Promise<UserInfo | undefined>
  apiKey: string
  oauthResult?: OAuthResult

  // the long standing API is a temporary solution for "PRO" users of AI Tube
  // (users who use Clap files using external tools,
  // or want ot use their own HF account to generate videos)
  longStandingApiKey: string
  setLongStandingApiKey: (apiKey: string, loginOnFailure: boolean) => void
 } {
  const [_pending, startTransition] = useTransition()

  const user = useStore(s => s.currentUser)
  const setCurrentUser = useStore(s => s.setCurrentUser)
  const [oauthResult, setOauthResult] = useState<OAuthResult>()

  const userId = `${user?.id || ""}`

  // this is the legacy, long-standing API key
  // which is still required for long generation of Clap files
  const [huggingfaceApiKey, setHuggingfaceApiKey] = useLocalStorage<string>(
    localStorageKeys.huggingfaceApiKey,
    defaultSettings.huggingfaceApiKey
  )

  // this is the new recommended API to use, with short expiration rates
  // in the future this API key will be enough for all our use cases
  const [huggingfaceTemporaryApiKey, setHuggingfaceTemporaryApiKey] = useLocalStorage<string>(
    localStorageKeys.huggingfaceTemporaryApiKey,
    defaultSettings.huggingfaceTemporaryApiKey
  )

  // force the API call
  const checkSession = async (isLoginRequired: boolean = false): Promise<UserInfo | undefined> => {

    console.log("useCurrentUser.checkSession()")
    // new way: try to use the safer temporary key whenever possible
    if (huggingfaceTemporaryApiKey) {
      try {

        const user = await getCurrentUser(huggingfaceTemporaryApiKey)

        setCurrentUser(user)

        return user // we stop there, no need to try the legacy key

      } catch (err) {
        console.error("failed to log in using the temporary key:", err)
        setCurrentUser(undefined)
      }
    }

    // deprecated: the old static key which is harder to renew
    if (huggingfaceApiKey) {
      try {

        const user = await getCurrentUser(huggingfaceApiKey)

        setCurrentUser(user)

        return user
      } catch (err) {
        console.error("failed to log in using the static key:", err)
        setCurrentUser(undefined)
      }
    }

    // when we reach this stage, we know that none of the API tokens were valid
    // we are given the choice to request a login or not
    // (depending on if it's a secret page or not)

    if (isLoginRequired) {
      await login("/")
    }

    return undefined
  }

  // can be called many times, but won't do the API call if not necessary
  const main = async (isLoginRequired: boolean) => {

    console.log("useCurrentUser()")
    const searchParams = new URLSearchParams(window.location.search);


    console.log("debug:", {
      "window.location.search:": window.location.search,
      searchParams,
    })
 
    try {
      const res = await oauthHandleRedirectIfPresent()
      console.log("result of oauthHandleRedirectIfPresent:", res)
      if (res) {
        console.log("useCurrentUser(): we just received an oauth login!")
        setOauthResult(res)
        setHuggingfaceTemporaryApiKey(res.accessToken)
        await checkSession(isLoginRequired)
        return
      }
    } catch (err) {
    }
    
    // already logged-in, no need to spend an API call
    // although it is worth noting that the API token might be expired at this stage
    if (userId) {
      return
    }

    console.log("useCurrentUser(): yes, we need to call synchronizeSession()")
    await checkSession(isLoginRequired)
  }

  useEffect(() => {
    startTransition(async () => { await main(isLoginRequired) })
  }, [isLoginRequired, huggingfaceApiKey, huggingfaceTemporaryApiKey, userId])


  const login = async (
    // used to redirect the user back to the route they were browsing
    redirectTo: string = ""
  ) => {

    const oauthUrl = await oauthLoginUrl({
      /**
       * OAuth client ID.
       *
       * For static Spaces, you can omit this and it will be loaded from the Space config, as long as `hf_oauth: true` is present in the README.md's metadata.
       * For other Spaces, it is available to the backend in the OAUTH_CLIENT_ID environment variable, as long as `hf_oauth: true` is present in the README.md's metadata.
       *
       * You can also create a Developer Application at https://huggingface.co/settings/connected-applications and use its client ID.
       */
      clientId: process.env.NEXT_PUBLIC_AI_TUBE_OAUTH_CLIENT_ID,

      // hubUrl?: string;

      /**
       * OAuth scope, a list of space separate scopes.
       *
       * For static Spaces, you can omit this and it will be loaded from the Space config, as long as `hf_oauth: true` is present in the README.md's metadata.
       * For other Spaces, it is available to the backend in the OAUTH_SCOPES environment variable, as long as `hf_oauth: true` is present in the README.md's metadata.
       *
       * Defaults to "openid profile".
       *
       * You can also create a Developer Application at https://huggingface.co/settings/connected-applications and use its scopes.
       *
       * See https://huggingface.co/docs/hub/oauth for a list of available scopes.
       */
      scopes: "openid profile",

      /**
       * Redirect URI, defaults to the current URL.
       *
       * For Spaces, any URL within the Space is allowed.
       *
       * For Developer Applications, you can add any URL you want to the list of allowed redirect URIs at https://huggingface.co/settings/connected-applications.
       */
      redirectUrl: "https://aitube.at/api/login",

      /**
       * State to pass to the OAuth provider, which will be returned in the call to `oauthLogin` after the redirect.
       */
      state: JSON.stringify({ redirectTo })
    })

    window.location.href = oauthUrl
  }

  const setLongStandingApiKey = (apiKey: string, loginOnFailure: boolean) => {
    (async () => {
      try {
        const user = await getCurrentUser(apiKey)
        setHuggingfaceApiKey(apiKey)
        setCurrentUser(user)
      } catch (err) {
        console.error("failed to log in using the long standing key:", err)
        setHuggingfaceApiKey("")
        setCurrentUser(undefined)
        if (loginOnFailure) {
          // login()
        }
      }
    })()
  }

  // this may correspond to either a short or a long standing api key
  // in the future it may always be a short api key with auto renewal
  const apiKey = user?.hfApiToken || ""


  // for now, we still need to keep track of a logn api, but this is purely optional
  const longStandingApiKey = huggingfaceApiKey

  return {
    user,
    login,
    checkSession,
    oauthResult,
    apiKey,
    longStandingApiKey,
    setLongStandingApiKey,
  }
}