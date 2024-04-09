import { useState, useEffect } from "react"

export function useCanvasImage(url: string): HTMLImageElement | null {
  const [imageSrc, setImageSrc] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();

    img.onload = () => {
      setImageSrc(img);
    };

    img.src = url;
    
    return () => {
      img.onload = null;
      img.src = '';
    };
  }, [url]);

  return imageSrc;
}