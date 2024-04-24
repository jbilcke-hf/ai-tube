
import React, { useState, useEffect, useRef } from 'react';

interface VideoLoopProps {
  className?: string;
  playlist?: string[];
  playbackSpeed?: number;
}

export const VideoLoop: React.FC<VideoLoopProps> = ({
  className = "",
  playlist = [],
  playbackSpeed = 1.0
}) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnd = () => {
    // Loop only if there is more than one video
    if (playlist.length > 1) {
      setCurrentVideoIndex(prevIndex => (prevIndex + 1) % playlist.length);
    }
  };

  // Setup and handle changing playback rate and video source
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
      videoRef.current.src = playlist[currentVideoIndex] || ''; // Resort to empty string if undefined
      videoRef.current.load();
      if (videoRef.current.src) {
        videoRef.current.play().catch(error => {
          console.error('Video play failed', error);
        });
      } else {
        console.log("VideoLoop: cannot start (no video)")
      }
    }
  }, [playbackSpeed, currentVideoIndex, playlist]);

  // Handle native video controls interaction
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || playlist.length === 0) return;

    const handlePlay = () => {
      if (videoElement.paused && !videoElement.ended) {
        if (videoRef.current?.src) {
          videoElement.play().catch((error) => {
            console.error('Error playing the video', error);
          });
        } else {
          console.log("VideoLoop: cannot start (no video)")
        }
      }
    };

    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('ended', handleVideoEnd);

    return () => {
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('ended', handleVideoEnd);
    };
  }, [playlist]);

  // Handle UI case for empty playlists
  if (playlist.length === 0 || !playlist[currentVideoIndex]) {
    return <></>
  }

  return (
    <video
      ref={videoRef}
      loop={false}
      className={className}
      playsInline
      muted
      autoPlay
      src={playlist[currentVideoIndex]}
    />
  );
};