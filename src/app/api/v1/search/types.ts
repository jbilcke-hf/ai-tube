
// for latent search we need to get rough results fast
export type BasicSearchResult = {
  // note: the absence of ID means this is a new, latent result
  id?: string
  title: string
  tags: string[]
}

export type ExtendedSearchResult = {
  id?: string
  title: string
  description: string
  cover: string
  tags: string[]
}
