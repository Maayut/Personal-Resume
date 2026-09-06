import { useEffect, useRef, useState } from 'react';

import { useMediaQuery } from '@/hooks/use-media-query';

const SMOOTHING = 0.14;
const MIN_TIME_DELTA = 0.012;
const MIN_PROGRESS_DELTA = 0.001;

export function useBackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const desktop = useMediaQuery('(min-width: 1024px)');
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

    if (!desktop) {
      void video.play().catch(() => undefined);
      return;
    }

    let targetProgress = 0;
    let currentProgress = 0;
    let frameId: number | null = null;
    let boundsWidth = window.innerWidth;

    const schedule = () => {
      if (frameId !== null || document.visibilityState === 'hidden') return;
      frameId = window.requestAnimationFrame(step);
    };

    const step = () => {
      frameId = null;
      if (document.visibilityState === 'hidden') return;

      if (!Number.isFinite(video.duration) || video.duration <= 0) {
        schedule();
        return;
      }

      currentProgress += (targetProgress - currentProgress) * SMOOTHING;
      const nextTime = currentProgress * video.duration;
      if (Math.abs(nextTime - video.currentTime) >= MIN_TIME_DELTA) {
        video.currentTime = nextTime;
      }

      if (Math.abs(targetProgress - currentProgress) > MIN_PROGRESS_DELTA) {
        schedule();
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      targetProgress = Math.min(1, Math.max(0, event.clientX / boundsWidth));
      schedule();
    };
    const onResize = () => {
      boundsWidth = window.innerWidth;
    };

    video.pause();
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, [desktop, reducedMotion]);

  return { videoRef, failed, markFailed: () => setFailed(true) };
}
