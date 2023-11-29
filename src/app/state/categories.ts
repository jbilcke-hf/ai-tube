

// TODO:
// this is obsolete, we should search on the Hugging Face platform instead

export const videoCategoriesWithLabels = {
 // "random": "Random",
  // "lofi": "Lofi Hip-Hop",
  "Sports": "Sports",
  "Education": "Education",
  "Time Travel": "Time Travel", // vlogs etc
  // "gaming": "Gaming",
  // "trailers": "Trailers",
  // "aitubers": "AI tubers",
  // "ads": "100% Ads",
}

export type VideoCategory = keyof typeof videoCategoriesWithLabels

export const videoCategories = Object.keys(videoCategoriesWithLabels) as VideoCategory[] 