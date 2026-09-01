import { useEffect, useRef, useState } from 'react';

import { useMediaQuery } from '@/hooks/use-media-query';

export function useBackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const desktop = useMediaQuery('(min-width: 1024px)');
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    const video = videoRef.current;
    if (!video || typeof window === 'undefined') return;

    let previousX: number | undefined;
    const scrub = (event: MouseEvent) => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;

      const delta = previousX === undefined ? 0 : event.clientX - previousX;
      previousX = event.clientX;
      const targetTime = video.currentTime;
      video.currentTime = Math.min(
        video.duration,
        Math.max(
          0,
          targetTime + (delta / window.innerWidth) * 0.8 * video.duration,
        ),
      );
    };
    const stopVideo = () => {
      video.pause();
      video.currentTime = 0;
    };

    if (reducedMotion) {
      stopVideo();
      video.addEventListener('loadedmetadata', stopVideo);
      return () => video.removeEventListener('loadedmetadata', stopVideo);
    }

    if (!desktop) {
      void video.play().catch(() => undefined);
      return;
    }

    video.pause();
    window.addEventListener('mousemove', scrub, { passive: true });
    return () => window.removeEventListener('mousemove', scrub);
  }, [desktop, reducedMotion]);

  return { videoRef, failed, markFailed: () => setFailed(true) };
}
