import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'

import { cn } from '@/lib/utils'

import './globals.css'

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: '🍿 AI Tube',
  description: '🍿 AI Tube',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn(
        `h-full w-full overflow-auto`,
        roboto.className
        )}>
        {children}
      </body>
    </html>
  )
}
