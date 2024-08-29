"use client"

import dynamic from "next/dynamic"

export const LatentEngine = dynamic(() => import("./core/engine-clapper"), {
  loading: () => null,
})
