import { ClapSegmentCategory } from "@aitube/clap"

export type LatentEntity = {
  name: string
  category: ClapSegmentCategory
  image: string
  audio: string
  shots: number[]
} 

export type LatentStory = {
  comment: string
  image: string
  voice: string
}
