"use client"

import { useTransition } from "react"
import { useLocalStorage } from "usehooks-ts"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { localStorageKeys } from "@/app/state/localStorageKeys"
import { defaultSettings } from "@/app/state/defaultSettings"

export function UserAccountView() {
  const [huggingfaceApiKey, setHuggingfaceApiKey] = useLocalStorage<string>(
    localStorageKeys.huggingfaceApiKey,
    defaultSettings.huggingfaceApiKey
  )

  return (
    <div className={cn(
      `flex flex-col space-y-4`
    )}>
      <div className="flex flex-col space-y-2 max-w-4xl">
        <div className="flex flex-row space-x-2 items-center">
          <label className="flex w-64">Hugging Face token:</label>
          <Input
            placeholder="Hugging Face token (with WRITE access)"
            type="password"
            className="font-mono"
            onChange={(x) => {
              setHuggingfaceApiKey(x.target.value)
            }}
            value={huggingfaceApiKey}
          />
        </div>
        <p className="text-neutral-100/70">
          Note: your Hugging Face token must be a <span className="font-bold font-mono text-yellow-300">WRITE</span> access token.
        </p>
      </div>
      {huggingfaceApiKey
        ? <p>You are ready to go!</p>
        : <p>Please setup your account (see above) to get started</p>}
    </div>
  )
}