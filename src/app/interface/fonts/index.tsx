"use client"

import { Grandstander, Klee_One } from 'next/font/google'

// If loading a variable font, you don't need to specify the font weight
export const headingFont = Grandstander({ subsets: ['latin'] })
export const paragraphFont = Klee_One({ subsets: ['latin'], weight: "600" })
