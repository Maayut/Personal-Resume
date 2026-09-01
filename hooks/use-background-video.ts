import { useEffect, useRef, useState } from 'react';

export function useBackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || typeof window === 'undefined') return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (reducedMotion) {
      const stopVideo = () => {
        video.pause();
        video.currentTime = 0;
      };
      stopVideo();
      video.addEventListener('loadedmetadata', stopVideo);
      return () => video.removeEventListener('loadedmetadata', stopVideo);
    }

    if (window.innerWidth < 1024) {
      void video.play().catch(() => undefined);
      return;
    }

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

    window.addEventListener('mousemove', scrub, { passive: true });
    return () => window.removeEventListener('mousemove', scrub);
  }, []);

  return { videoRef, failed, markFailed: () => setFailed(true) };
}
