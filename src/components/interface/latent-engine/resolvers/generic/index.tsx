"use client"

import { v4 as uuidv4 } from "uuid"

import { ClapProject, ClapSegment } from "@/lib/clap/types"

import { LayerElement } from "../../core/types"

export async function resolve(segment: ClapSegment, clap: ClapProject): Promise<LayerElement> {
  return {
    id: uuidv4(),
    element: <div className="w-full h-full" />
  }
}