import type { Metadata } from 'next'
import Script from "next/script"
import { Roboto } from 'next/font/google'

import { cn } from '@/lib/utils/cn'

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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          href="/icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
        <Script>{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5ZGS5FDG');`}</Script>
      </Head>
      <body className={cn(
        `h-full w-full overflow-auto`,
        `dark text-neutral-100 bg-neutral-950`,
        roboto.className
        )}>
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5ZGS5FDG"
height="0" width="0" style={{ display: "none", visibility: "hidden" }}></iframe></noscript>
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
