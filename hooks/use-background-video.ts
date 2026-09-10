import { useEffect, useRef, useState } from 'react';

import { useMediaQuery } from '@/hooks/use-media-query';

export function useBackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    const video = videoRef.current;
    if (!video || typeof window === 'undefined') return;

    const stopVideo = () => {
      video.pause();
      video.currentTime = 0;
    };

    if (reducedMotion) {
      stopVideo();
      video.addEventListener('loadedmetadata', stopVideo);
      return () => video.removeEventListener('loadedmetadata', stopVideo);
    }

    let active = true;
    void video.play().then(
      () => {
        if (active) setFailed(false);
      },
      () => {
        if (active) setFailed(true);
      },
    );

    return () => {
      active = false;
    };
  }, [reducedMotion]);

  return { videoRef, failed, markFailed: () => setFailed(true) };
}
