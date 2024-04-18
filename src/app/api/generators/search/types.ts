export type LatentSearchResult = {
  label: string
  summary: string
  thumbnail: string
  tags: string[]
  seed: number // static seed is necessary to ensure result consistency for the thumbnail
}

export type LatentSearchResults = LatentSearchResult[]