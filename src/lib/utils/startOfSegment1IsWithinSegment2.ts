import { ClapSegment } from "../clap/types"

export function startOfSegment1IsWithinSegment2(s1: ClapSegment, s2: ClapSegment) {
  const startOfSegment1 = s1.startTimeInMs 
  return s2.startTimeInMs <= startOfSegment1 && startOfSegment1 <= s2.endTimeInMs
}