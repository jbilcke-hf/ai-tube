
import {  intervalToDuration } from 'date-fns'

export function formatDuration(seconds: number) {
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 })

  const zeroPad = (num: any) => String(num).padStart(2, '0')
  
  const formatted = `${zeroPad(duration.minutes)}:${zeroPad(duration.seconds)}`

  return formatted
}