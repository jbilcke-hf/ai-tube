export const showBetaFeatures = `${
  process.env.NEXT_PUBLIC_SHOW_BETA_FEATURES || ""
}`.trim().toLowerCase() === "true"