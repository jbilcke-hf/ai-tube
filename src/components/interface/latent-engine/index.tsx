import React, { useEffect, useRef } from "react"
import { useLatentEngine } from "./useLatentEngine"
import { mockClap } from "@/lib/clap/mockClap"
import { Gsplat } from "../gsplat"

export type LatentEngineStatus =
  | "idle"
  | "loading"
  | "loaded"
  | "failed"

export function LatentEngine({
  url,
  width,
  height,
  className = "" }: {
  url: string
  width?: number
  height?: number
  className?: string
}) {
  const le = useLatentEngine()

  useEffect(() => {
    if (!le.loaded) {
      console.log("let's load an experience")
      le.load(mockClap())
    }
  }, [le.loaded])

  return (
    <div style={{ width, height }} className={className}>
      {/* <Gsplat /> */}
    </div>
  );
}
