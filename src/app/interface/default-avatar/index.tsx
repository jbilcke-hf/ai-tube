"use client"

import dynamic from "next/dynamic"

export const DefaultAvatar = dynamic(() => import("./impl"), {
  loading: () => null,
})
