"use client"

import RunCSS, { extendRunCSS } from "runcss"

import { ClapProject, ClapSegment } from "@/lib/clap/types"
import { generateHtml } from "./generateHtml"
import { ThisIsAI } from "../../components/disclaimers/this-is-ai"

let state = {
  runCSS: RunCSS({}),
  isWatching: false,
}

export async function resolve(segment: ClapSegment, clap: ClapProject): Promise<JSX.Element> {

  const { prompt } = segment

  if (prompt.toLowerCase() === "<builtin:disclaimer>") {
    return <ThisIsAI streamType={clap.meta.streamType} />
  }

  let dangerousHtml = ""
  try {
    console.log(`resolveInterface: generating html for: ${prompt}`)

    dangerousHtml = await generateHtml(prompt)

    console.log(`resolveInterface: generated ${dangerousHtml}`)

  } catch (err) {
    console.log(`resolveInterface failed (${err})`)
  }

  const { processClasses, startWatching, stopWatching, exportCSS } = state.runCSS

  //
  // call the API
  // dynamically *new* classes into the current page
  
  // https://github.com/mudgen/runcss

  // Start watching for changes
  // TODO: we should only watch the 
  // startWatching(document.getElementById('hello')) // if not specified, fallback to document.body

  if (!state.isWatching) {
    console.log("resolveInterface: TODO: starting the CSS watcher..")
    // startWatching(targetNode)
  }

  return (
    <div
      className="w-full h-full"
      dangerouslySetInnerHTML={{ __html: dangerousHtml }}
    />
  )
}
