
import React, { useEffect, useRef } from 'react';

export function BasicVideo({
  className = "",
  src,
  playbackSpeed = 1.0,
  playsInline = true,
  muted = true,
  autoPlay = true,
  loop = true,
}: {
  className?: string
  src?: string
  playbackSpeed?: number
  playsInline?: boolean
  muted?: boolean
  autoPlay?: boolean
  loop?: boolean
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  // Setup and handle changing playback rate and video source
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [videoRef.current, playbackSpeed]);


  // Handle UI case for empty playlists
  if (!src || typeof src !== "string") {
    return <></>
  }

  return (
    <video
      ref={videoRef}
      className={className}
      playsInline={playsInline}
      muted={muted}
      autoPlay={autoPlay}
      loop={loop}
      src={src}
    />
  );
};