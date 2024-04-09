import React, { useEffect, useRef } from "react"
import * as SPLAT from "gsplat"

type GsplatStatus =
  | "idle"
  | "loading"
  | "loaded"
  | "failed"

export function Gsplat({
  url,
  width,
  height,
  className = "" }: {
  url: string
  width?: number
  height?: number
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<SPLAT.Scene>()
  const cameraRef = useRef<SPLAT.Camera>()
  const controlsRef = useRef<SPLAT.OrbitControls>()
  const rendererRef = useRef<SPLAT.WebGLRenderer>()
  const frameIdRef = useRef<number>(0)
  const statusRef = useRef<GsplatStatus>("idle")

  function animate() {
    const renderer = rendererRef.current
    const scene = sceneRef.current
    const camera = cameraRef.current
    const controls = controlsRef.current
    if (!scene || !renderer || !camera || !controls) { return }


    controls.update()
    renderer.render(scene, camera)
    frameIdRef.current = requestAnimationFrame(animate)
  }

  async function loadScene() {
    const canvas = canvasRef.current
    if (!canvas) { return }

    const status = statusRef.current
    if (!status || status === "loaded" || status === "loading" || status === "failed") {
      console.log(`Gsplat: a scene is already loading or loaded: skipping..`)
      return
    }

    statusRef.current = "loading"

    try {
      const renderer = rendererRef.current = new SPLAT.WebGLRenderer(canvas)
      
      let fileUrl = url.trim()
      let fileExt = fileUrl.toLowerCase().split(".").pop() || "splat"
      const isVideo = fileExt === "splatv"

      if (isVideo) {
        console.log("Gsplat: loading video splat..")

        renderer.addProgram(new SPLAT.VideoRenderProgram(renderer))

        const scene = sceneRef.current = new SPLAT.Scene()
        const camera = cameraRef.current = new SPLAT.Camera()
        const controls = controlsRef.current = new SPLAT.OrbitControls(camera, renderer.canvas)
    
        await SPLAT.SplatvLoader.LoadAsync(url, scene, camera, (progress) => {
          console.log(`${Math.round(progress * 100)}%`)
        })

        controls.setCameraTarget(camera.position.add(camera.forward.multiply(5)))
      } else {
        console.log("Gsplat: loading static splat..")
        const scene = sceneRef.current = new SPLAT.Scene()
        const camera = cameraRef.current = new SPLAT.Camera()
        const controls = controlsRef.current = new SPLAT.OrbitControls(camera, renderer.canvas)
    
        await SPLAT.Loader.LoadAsync(url, scene, (progress) => {
          console.log(`${Math.round(progress * 100)}%`)
        })
      }
      
      console.log("Gsplat: finished loading! rendering..")
      statusRef.current = "loaded"
    } catch (err) {
      console.error(`Gsplat: failed to load the content`)
      statusRef.current = "failed"
      return
    }
   
    animate()
  };

  useEffect(() => {
    if (!canvasRef.current) { return }
    loadScene()
    return () => { cancelAnimationFrame(frameIdRef?.current || 0) }
  }, [])

  // responsive width and height
  useEffect(() => {
    const canvas = canvasRef.current
    const renderer = rendererRef.current

    if (!canvas || !renderer) { return }

    // renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    renderer.setSize(
      width || canvas.clientWidth,
      height || canvas.clientHeight
    )
  }, [width, height])
  return (
    <div style={{ width, height }} className={className}>
      <canvas ref={canvasRef} style={{ width, height}}></canvas>
    </div>
  );
}
