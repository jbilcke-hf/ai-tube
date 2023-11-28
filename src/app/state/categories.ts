export const videoCategoriesWithLabels = {
 // "random": "Random",
  // "lofi": "Lofi Hip-Hop",
  "sports": "Sports",
  "education": "Education",
  "timetravel": "Time Travel", // vlogs etc
  "gaming": "Gaming",
  "trailers": "Trailers",
  "aitubers": "AI tubers",
  "ads": "100% Ads",
}

export type VideoCategory = keyof typeof videoCategoriesWithLabels

export const videoCategories = Object.keys(videoCategoriesWithLabels) as VideoCategory[] 