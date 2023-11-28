import { Ubuntu } from "next/font/google"
import localFont from "next/font/local"

export const actionman = localFont({
  src: "../fonts/Action-Man/Action-Man.woff2",
  variable: "--font-action-man"
})

// https://nextjs.org/docs/pages/building-your-application/optimizing/fonts 
// If loading a variable font, you don"t need to specify the font weight
export const fonts = {
  actionman,
  // ubuntu: Ubuntu
}

// https://nextjs.org/docs/pages/building-your-application/optimizing/fonts 
// If loading a variable font, you don"t need to specify the font weight
export const fontList = Object.keys(fonts)

export type FontName = keyof typeof fonts

export const defaultFont = "actionman" as FontName

export const classNames = Object.values(fonts).map(font => font.className)

export const className = classNames.join(" ")

export type FontClass =
  | "font-actionman"
