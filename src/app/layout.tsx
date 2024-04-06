import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'

import { cn } from '@/lib/utils'

import './globals.css'
import Head from 'next/head'

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: '🍿 AiTube',
  description: '🍿 AiTube',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=0.86, maximum-scale=5.0, minimum-scale=0.86" />
      </Head>
      <body className={cn(
        `h-full w-full overflow-auto`,
        `dark text-neutral-100 bg-neutral-950`,
        roboto.className
        )}>
        {children}
      </body>

        {/*
        TODO: use a new tracker

        import Script from "next/script"

        This is the kind of project on which we want custom analytics!
        <Script src="https://www.googletagmanager.com/gtag/js?id=GTM-NJ2ZZFBX" />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
    
            gtag('config', 'GTM-NJ2ZZFBX');
          `}
        </Script>
        */}
    </html>
  )
}
