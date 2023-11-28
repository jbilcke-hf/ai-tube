import { useCallback, useEffect, useRef, useState } from 'react';

// Helper Types
type UseAudioResponse = {
  playback: (base64Data?: string, isLastTrackOfPlaylist?: boolean) => Promise<boolean>;
  progress: number;
  isLoaded: boolean;
  isPlaying: boolean;
  isSwitchingTracks: boolean; // when audio is temporary cut (but it's not a real pause)
  togglePause: () => void;
};

export function useAudio(): UseAudioResponse {
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const [progress, setProgress] = useState(0.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSwitchingTracks, setSwitchingTracks] = useState(false);
  const startTimeRef = useRef(0);
  const pauseTimeRef = useRef(0);
  
  const stopAudio = useCallback(() => {
    try {
      audioContextRef.current?.close();
    } catch (err) {
      // already closed probably
    }
    setSwitchingTracks(false);

    sourceNodeRef.current = null;
    sourceNodeRef.current = null;

    // setProgress(0); // Reset progress
  }, []);

  // Helper function to handle conversion from Base64 to an ArrayBuffer
  async function base64ToArrayBuffer(base64: string): Promise<ArrayBuffer> {
    const response = await fetch(base64);
    return response.arrayBuffer();
  }

  const playback = useCallback(
    async (base64Data?: string, isLastTrackOfPlaylist?: boolean): Promise<boolean> => {
      stopAudio(); // Stop any playing audio first

      // If no base64 data provided, we don't attempt to play any audio
      if (!base64Data) {
        return false;
      }

      // Initialize AudioContext
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      // Format Base64 string if necessary and get ArrayBuffer
      const formattedBase64 =
        base64Data.startsWith('data:audio/wav') || base64Data.startsWith('data:audio/wav;base64,')
          ? base64Data
          : `data:audio/wav;base64,${base64Data}`;

      console.log(`formattedBase64: ${formattedBase64.slice(0, 50)} (len: ${formattedBase64.length})`);

      const arrayBuffer = await base64ToArrayBuffer(formattedBase64);

      return new Promise((resolve, reject) => {
        // Decode the audio data and play
        audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
          // Create a source node and gain node
          const source = audioContext.createBufferSource();
          const gainNode = audioContext.createGain();
          
          // Set buffer and gain
          source.buffer = audioBuffer;
          gainNode.gain.value = 1.0; 

          // Connect nodes
          source.connect(gainNode);
          gainNode.connect(audioContext.destination);

          // Assign source node to ref for progress tracking
          sourceNodeRef.current = source;
          source.start(0, pauseTimeRef.current % audioBuffer.duration); // Start at the correct offset if paused previously
          startTimeRef.current = audioContextRef.current!.currentTime - pauseTimeRef.current;
          
          setSwitchingTracks(false);
          setProgress(0);
          setIsLoaded(true);
          setIsPlaying(true);

          // Set up progress interval
          const totalDuration = audioBuffer.duration;
          const updateProgressInterval = setInterval(() => {
            if (sourceNodeRef.current && audioContextRef.current) {
              const currentTime = audioContextRef.current.currentTime;
              const currentProgress = currentTime / totalDuration;
              setProgress(currentProgress);
              if (currentProgress >= 1.0) {
                clearInterval(updateProgressInterval);
              }
            }
          }, 50); // Update every 50ms
          
          if (source) {
            source.onended = () => {
              // used to indicate a temporary stop, while we switch tracks
              if (!isLastTrackOfPlaylist) {
                setSwitchingTracks(true);
              }
              setIsPlaying(false);
              clearInterval(updateProgressInterval);
              stopAudio();
              resolve(true);
            };
          }
        }, (error) => {
          console.error('Error decoding audio data:', error);
          reject(error);
        });
      })
    },
    [stopAudio]
  );

  const togglePause = useCallback(() => {
    if (!audioContextRef.current || !sourceNodeRef.current) {
      return; // Do nothing if audio is not initialized
    }

    if (isPlaying) {
      // Pause the audio
      pauseTimeRef.current += audioContextRef.current.currentTime - startTimeRef.current;
      sourceNodeRef.current.stop(); // This effectively "pauses" the audio, but it also means the sourceNode will be unusable
      sourceNodeRef.current = null; // As the node is now unusable, we nullify it
      setIsPlaying(false);
    } else {
      // Resume playing
      audioContextRef.current.resume().then(() => {
        playback(); // This will pick up where we left off due to pauseTimeRef
      });
    }
  }, [audioContextRef, sourceNodeRef, isPlaying, playback]);

  // Effect to handle cleanup on component unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  return { playback, isPlaying, isSwitchingTracks, isLoaded, progress, togglePause };
}