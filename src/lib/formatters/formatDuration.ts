
import {  intervalToDuration } from 'date-fns'
import { isValidNumber } from '../utils/isValidNumber'

export function formatDuration(seconds: number): string {
  if (!isValidNumber(seconds)) {
    return '0:0'
  }

  const duration = intervalToDuration({ start: 0, end: seconds * 1000 })

  const zeroPad = (num: any) => String(num).padStart(2, '0')
  
  if (!isValidNumber(duration.minutes) || !isValidNumber(duration.seconds)) {
    return '00:00'
  }

  const formatted = `${zeroPad(duration.minutes)}:${zeroPad(duration.seconds)}`

  return formatted
}