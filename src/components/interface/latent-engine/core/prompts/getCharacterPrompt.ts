import { ClapModel } from "@aitube/clap"

export function getCharacterPrompt(model: ClapModel): string {

  let characterPrompt = ""
  if (model.description) {
    characterPrompt = [
      // the label (character name) can help making the prompt more unique
      // this might backfires however, if the name is
      // something like "SUN", "SILVER" etc
      // I'm not sure stable diffusion really needs this,
      // so let's skip it for now (might still be useful for locations, though)
      // we also want to avoid triggering "famous people" (BARBOSSA etc)
      // model.label,

      model.description
    ].join(", ")
  } else {
    characterPrompt = [
      model.gender !== "object" ? model.gender : "",
      model.age ? `aged ${model.age}yo` : '',
      model.label ? `named ${model.label}` : '',
    ].map(i => i.trim()).filter(i => i).join(", ")
  }
  return characterPrompt
}