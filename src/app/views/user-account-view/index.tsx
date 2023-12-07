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
      {/*
      <div className="flex flex-col space-y-2 max-w-4xl">
        <p>Do you want your model to be featured?</p>
        <p>If it's free and open-source, tell me about it, I might be able to add it!</p>
      </div>
      */}
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
        ? <><p>You are ready to go for the beta!</p>
          <p>Please contact HF user <span className="text-xs font-mono bg-neutral-600 rounded-lg py-1 px-1.5">@jbilcke-hf</span> to learn how to create your own channel!</p></>
        : <><p>This project is in beta, you will be invited to contact HF user <span className="text-xs font-mono bg-neutral-600 rounded-lg py-1 px-1.5">@jbilcke-hf</span> to get started.</p>
          <p>But you can already setup your account (see above) to get started.</p></>}
      
    </div>
  )
}