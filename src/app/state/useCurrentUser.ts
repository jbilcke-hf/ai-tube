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
    let huggingfaceTemporaryApiKey = localStorage.getItem(localStorageKeys.huggingfaceTemporaryApiKey) || ""
    
    console.log("huggingfaceTemporaryApiKey:", huggingfaceTemporaryApiKey)
    if (huggingfaceApiKey.startsWith('"')) {
      console.log("the key has been corrupted..")
      localStorage.setItem(localStorageKeys.huggingfaceTemporaryApiKey, JSON.parse(huggingfaceApiKey))
      huggingfaceTemporaryApiKey = localStorage.getItem(localStorageKeys.huggingfaceTemporaryApiKey) || ""
      console.log(`the recovered key is: ${huggingfaceTemporaryApiKey}`)
    }
    // new way: try to use the safer temporary key whenever possible
    if (huggingfaceTemporaryApiKey) {
      try {

        console.log(`calling getCurrentUser()`, { huggingfaceTemporaryApiKey })

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
      // await login("/")
    }

    return undefined
  }

  // can be called many times, but won't do the API call if not necessary
  const main = (isLoginRequired: boolean) => {
    // already logged-in, no need to spend an API call
    // although it is worth noting that the API token might be expired at this stage
    if (userId) {
      console.log("we are already logged-in")
      return
    }

    startTransition(async () => {
  
      console.log("useCurrentUser(): yes, we need to call synchronizeSession()")
    
      await checkSession(isLoginRequired)
    })
  }

  useEffect(() => {
    main(isLoginRequired)
  }, [isLoginRequired, huggingfaceApiKey, huggingfaceTemporaryApiKey, userId])

  useEffect(() => {

    // DIY
    try {
      localStorage.setItem(
        "huggingface.co:oauth:nonce",
        localStorage.getItem("aitube.at:oauth:nonce") || ""
      )
      // localStorage.removeItem("aitube.at:oauth:nonce")
      localStorage.setItem(
        "huggingface.co:oauth:code_verifier",
        localStorage.getItem("aitube.at:oauth:code_verifier") || ""
      )
            // localStorage.removeItem("aitube.at:oauth:code_verifier")
    } catch (err) {
      console.log("no pending oauth flow to finish")
    }

    console.log("useCurrentUser()")
    const searchParams = new URLSearchParams(window.location.search);

    console.log("debug:", {
      "window.location.search:": window.location.search,
      searchParams,
    })
 
    const fn = async () => {
      try {
        const res = await oauthHandleRedirectIfPresent()
        console.log("result of oauthHandleRedirectIfPresent:", res)
        if (res) {
          console.log("oauthHandleRedirectIfPresent returned something!", res)
          setOauthResult(res)
          console.log("debug:", { accessToken: res.accessToken })
          setHuggingfaceTemporaryApiKey(res.accessToken)
          startTransition(async () => {
            console.log("TODO julian do something, eg. reload the page, remove the things in the URL etc")
            // await checkSession(isLoginRequired)
          })
        }
        
      } catch (err) {
        console.error(err)
      }
    }

    fn()
  }, [isLoginRequired])


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

    // DIY
    localStorage.setItem(
      "aitube.at:oauth:nonce",
      localStorage.getItem("huggingface.co:oauth:nonce") || ""
    )
    localStorage.setItem(
      "aitube.at:oauth:code_verifier",
      localStorage.getItem("huggingface.co:oauth:code_verifier") || ""
    )

    // should we open this in a new tab?
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