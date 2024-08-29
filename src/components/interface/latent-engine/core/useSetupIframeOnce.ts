'use client'

import { useEffect, useRef } from 'react'
import { useChildController } from './useChildController'

/**
 * You should only call this once, at the root of the react tree
 */
export function useSetupIframeOnce() {
  const ref = useRef<HTMLIFrameElement>(null)
  const setDomElement = useChildController(s => s.setDomElement)
  const canUseBellhop = useChildController((s) => s.canUseBellhop)
  const setCanUseBellhop = useChildController((s) => s.setCanUseBellhop)
  const isConnectedToChild = useChildController((s) => s.isConnectedToChild)
  const setHasLoadedBellhop = useChildController((s) => s.setHasLoadedBellhop)
  const onMessage = useChildController((s) => s.onMessage)
  const sendMessage = useChildController((s) => s.sendMessage)


  // TODO: maybe we should add a JWT token to secure this, make it only embeddable
  // on a certain website (eg. AiTube.at), and if people want to
  // embed the player somewhere's else they will have to deploy their own

  const domElement = ref.current

  useEffect(() => {
    if (!domElement || !isConnectedToChild) {
      // when we are detecting that we are not in an iframe

      if (canUseBellhop) {
        setCanUseBellhop(false)
      }
      return
    }

    if (!canUseBellhop) {
      setCanUseBellhop(true)
    }

    if (isConnectedToChild) {
      // no need to connect twice
      return
    } else {
      // we only try this once
      

      try {
        setDomElement(domElement)
        setHasLoadedBellhop(true)

        onMessage('something', function (event: any) {
          // generate the first scene of an OpenClap file from the prompt
        })

        sendMessage('status', { isReady: true })
      } catch (err) {
        console.error(`failed to initialize bellhop`)
        setHasLoadedBellhop(false)
        setCanUseBellhop(false)
      }
    }
  }, [domElement, canUseBellhop, isConnectedToChild])

  return useChildController
}
