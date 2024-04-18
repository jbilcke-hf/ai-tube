import React from "react"


import { cn } from "@/lib/utils/cn"

import { arimoBold, arimoNormal } from "@/lib/fonts"
import { ClapStreamType } from "@/lib/clap/types"

export function ThisIsAI({
  streamType,
}: {
  streamType?: ClapStreamType
} = {}) {

  return (
  <div className={cn(`
  @container
  flex flex-col flex-1
  items-center justify-center
  w-full

  bg-emerald-700
  text-center
  transition-all duration-200 ease-in-out
  font-medium uppercase
  tracking-wide
  [text-shadow:_0_2px_0_rgb(0_0_0_/_30%)]
  `,
  arimoNormal.className
  )}>
    <div className="
    flex flex-col
    transition-all duration-200 ease-in-out
    ">
      <div className={cn(`
       flex flex-col items-center justify-center
      transition-all duration-200 ease-in-out
      `)}>
        <div className="
        flex flex-row items-end justify-center
        text-xs @xl:text-sm @2xl:text-base @3xl:text-lg @4xl:text-xl
        leading-none @lg:leading-none @xl:leading-none @2xl:leading-none @3xl:leading-none @4xl:leading-none
        ">
          The following <div className={cn(`
          flex flex-row items-end justify-center
          text-sm @lg:text-base @xl:text-lg @2xl:text-xl @3xl:text-2xl @4xl:text-3xl
          leading-none @lg:leading-none @xl:leading-none @2xl:leading-none @3xl:leading-none @4xl:leading-none
          transition-all duration-200 ease-in-out
          font-semibold
          mx-0.5 @lg:mx-1 @xl:mx-1 @2xl:mx-1.5 @3xl:mx-2 @4xl:mx-2.5
          `,
          arimoBold.className
          )}>
            {
              /*
          isDynamic
          ? "dynamic"
          : "static"
            */
            } content
          </div> {
          streamType !== "static"
          ? "will be"
          : "has been"
          } <div className={cn(`
          flex flex-row items-end justify-center
          text-sm @lg:text-base @xl:text-lg @2xl:text-xl @3xl:text-2xl @4xl:text-3xl
          leading-none @lg:leading-none @xl:leading-none @2xl:leading-none @3xl:leading-none @4xl:leading-none
          transition-all duration-200 ease-in-out
          font-semibold
          mx-0.5 @lg:mx-1 @xl:mx-1 @2xl:mx-1.5 @3xl:mx-2 @4xl:mx-2.5
         
          `,
          arimoBold.className
          )}>
            synthesized
          </div>
          using
        </div>
        <div className={cn(`
        flex flex-row items-end justify-center
        text-lg @xl:text-xl @2xl:text-2xl @3xl:text-3xl @4xl:text-4xl
        leading-loose @lg:leading-loose @xl:leading-loose @2xl:leading-loose @3xl:leading-loose @4xl:leading-loose
        transition-all duration-200 ease-in-out
        font-semibold
        `,
        arimoBold.className
        )}>
          artificial intelligence
        </div>
        <div className="
        flex flex-row items-end justify-center
        text-xs @xl:text-sm @2xl:text-base @3xl:text-lg @4xl:text-xl
        leading-none @lg:leading-none @xl:leading-none @2xl:leading-none @3xl:leading-none @4xl:leading-none
        ">
          and may contain hallucinations or factual inaccuracies.
          </div>
      </div>
    </div>
  </div>
  )
}