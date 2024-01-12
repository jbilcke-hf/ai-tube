import { useEffect, useState } from "react"

import { oauthHandleRedirectIfPresent, oauthLoginUrl } from "@huggingface/hub"

export function useHuggingFaceLogin(onLogin?: (data: any) => void) {
  const [isLoggedIn, setLoggedIn] = useState(false)
  const [oauthResult, setOauthResult] = useState<any>({})

  useEffect(() => {
    const fn = async () => {
      const res = await oauthHandleRedirectIfPresent()
      if (res) {
        setOauthResult(res)
        setLoggedIn(true)
        onLogin?.(res)
      }
    }
    fn()
  }, [])

  const login = async () => {
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
      redirectUrl: "https://jbilcke-hf-ai-tube.hf.space",

      /**
       * State to pass to the OAuth provider, which will be returned in the call to `oauthLogin` after the redirect.
       */
      // state: ""
    })

    console.log("oauthUrl:", oauthUrl)
    window.location.href = oauthUrl
  }

  console.log(JSON.stringify(oauthResult, null, 2))

  return {
    isLoggedIn,
    login,
    oauthResult,
  }
}