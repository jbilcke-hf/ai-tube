import React from "react"
import Image from 'next/image'

import { cn } from "@/lib/utils/cn"

import latentEngineLogo from "./latent-engine.png"

export function PoweredBy() {

  return (
  <div className={cn(`
  flex flex-col flex-1
  items-center justify-center
  w-full h-full

  bg-black
  `,
  )}>
  
    <div className={cn(`
       flex flex-col items-center justify-center
    `)}>
      <Image
        src={latentEngineLogo}
        alt="Latent Engine logo"
        className="w-[80%]"
      />
    </div>
  </div>
  )
}