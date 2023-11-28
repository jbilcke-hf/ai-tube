"use client"

import { useEffect, useState } from "react"
import Head from "next/head"
import Script from "next/script"

import { cn } from "@/lib/utils"

import { Main } from "./main"

// https://nextjs.org/docs/pages/building-your-application/optimizing/fonts 

export default function Page() {
  const [isLoaded, setLoaded] = useState(false)
  useEffect(() => { setLoaded(true) }, [])
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=0.86, maximum-scale=5.0, minimum-scale=0.86" />
      </Head>
      <main className={cn(
        `light text-neutral-100`,
        // `bg-gradient-to-r from-green-500 to-yellow-400`,
        `bg-gradient-to-r from-neutral-950 to-neutral-950`,
        )}>
        {isLoaded && <Main />}
        {/*
        TODO: use a new tracker
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
      </main>
    </>
  )
}