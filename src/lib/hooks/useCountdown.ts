"use client"

import { useEffect, useRef, useState } from "react"

export function useCountdown({
  isActive,
  timerId,
  durationInSec,
  onEnd = () => {},
}: {
  isActive: boolean
  timerId: string | number
  durationInSec: number
  onEnd: () => void
}) {
  const intervalRef = useRef<NodeJS.Timer>()
  const startedAt = useRef<Date>()
  const [elapsedTimeInMs, setElapsedTimeInMs] = useState<number>(0)

  const durationInMs = durationInSec * 1000

  useEffect(() => {
    clearInterval(intervalRef.current)
    setElapsedTimeInMs(0)
    startedAt.current = new Date()

    if (isActive) {
      intervalRef.current = setInterval(() => {
        const now = new Date()
        const newElapsedInMs = Math.min(durationInMs, now.getTime() - startedAt.current!.getTime())
        setElapsedTimeInMs(newElapsedInMs)
        if (elapsedTimeInMs > durationInMs) {
          // console.log("end of timer")
          clearInterval(intervalRef.current)
          onEnd()
        }
      }, 100)
    }

    return () => {
      // console.log("destruction of timer")
      clearInterval(intervalRef.current)
    }
  }, [isActive, timerId, durationInMs])

  const remainingTimeInMs = Math.max(0, durationInMs - elapsedTimeInMs)

  const progressRatio = elapsedTimeInMs / durationInMs
  const progressPercent = progressRatio * 100

  return {
    elapsedTimeInMs,
    remainingTimeInMs,
    elapsedTimeInSec: Math.round(elapsedTimeInMs / 1000),
    remainingTimeInSec: Math.round(remainingTimeInMs / 1000),
    progressRatio,
    progressPercent,
    timeIsUp: remainingTimeInMs <= 0,
  }
}