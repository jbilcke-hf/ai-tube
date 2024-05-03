export type ClapCompletionMode =
  // the full .clap is returned, containing both previous data and also new entries
  // this isn't the most optimized mode, obviously
  | "full"

  // only changes are
  | "partial"

