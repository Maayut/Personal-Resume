import { useEffect, useRef, useState, type RefObject } from 'react';

import { useMediaQuery } from '@/hooks/use-media-query';

const SEEK_INTERVAL = 1000 / 30;
// The bundled video has 24 independently decodable frames per second.
const FRAME_DURATION = 1 / 24;

export function useBackgroundVideo(surfaceRef: RefObject<HTMLElement | null>) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const supportsHover = useMediaQuery('(hover: hover) and (pointer: fine)');

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

    if (supportsHover) {
      const surface = surfaceRef.current;
      if (!surface) return;

      video.pause();
      let bounds: DOMRect | null = null;
      let targetProgress: number | null = null;
      let frameId: number | null = null;
      let seekPending = false;
      let lastSeekAt = -Infinity;

      const cancelFrame = () => {
        if (frameId !== null) window.cancelAnimationFrame(frameId);
        frameId = null;
      };

      const hasMetadata = () =>
        Number.isFinite(video.duration) && video.duration > 0;

      const schedule = () => {
        if (
          frameId !== null ||
          seekPending ||
          video.seeking ||
          targetProgress === null ||
          !hasMetadata() ||
          document.visibilityState === 'hidden'
        ) {
          return;
        }
        frameId = window.requestAnimationFrame(seekToPointer);
      };

      const seekToPointer = (timestamp: number) => {
        frameId = null;
        if (
          targetProgress === null ||
          seekPending ||
          video.seeking ||
          !hasMetadata() ||
          document.visibilityState === 'hidden'
        ) {
          return;
        }

        if (timestamp - lastSeekAt < SEEK_INTERVAL) {
          schedule();
          return;
        }

        const lastFrameTime = Math.max(0, video.duration - FRAME_DURATION);
        const nextTime = Math.min(
          lastFrameTime,
          Math.round((targetProgress * lastFrameTime) / FRAME_DURATION) *
            FRAME_DURATION,
        );
        if (Math.abs(nextTime - video.currentTime) < FRAME_DURATION / 2) return;

        // Decode only the latest target, and wait for it before requesting another.
        // This avoids continually interrupting in-flight seeks on slower devices.
        seekPending = true;
        lastSeekAt = timestamp;
        video.currentTime = nextTime;
      };

      const onPointerMove = (event: PointerEvent) => {
        if (event.pointerType === 'touch') return;
        bounds ??= surface.getBoundingClientRect();
        if (!bounds.width) return;
        targetProgress = Math.min(
          1,
          Math.max(0, (event.clientX - bounds.left) / bounds.width),
        );
        schedule();
      };
      const onPointerEnter = (event: PointerEvent) => {
        bounds = surface.getBoundingClientRect();
        onPointerMove(event);
      };
      const onPointerLeave = () => {
        targetProgress = null;
        bounds = null;
        cancelFrame();
      };
      const onSeeked = () => {
        seekPending = false;
        setFailed(false);
        schedule();
      };
      const invalidateBounds = () => {
        bounds = null;
      };
      const onVisibilityChange = () => {
        if (document.visibilityState === 'hidden') cancelFrame();
        else schedule();
      };

      surface.addEventListener('pointerenter', onPointerEnter);
      surface.addEventListener('pointermove', onPointerMove);
      surface.addEventListener('pointerleave', onPointerLeave);
      video.addEventListener('loadedmetadata', schedule);
      video.addEventListener('seeked', onSeeked);
      window.addEventListener('resize', invalidateBounds, { passive: true });
      document.addEventListener('visibilitychange', onVisibilityChange);

      return () => {
        cancelFrame();
        surface.removeEventListener('pointerenter', onPointerEnter);
        surface.removeEventListener('pointermove', onPointerMove);
        surface.removeEventListener('pointerleave', onPointerLeave);
        video.removeEventListener('loadedmetadata', schedule);
        video.removeEventListener('seeked', onSeeked);
        window.removeEventListener('resize', invalidateBounds);
        document.removeEventListener('visibilitychange', onVisibilityChange);
      };
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
  }, [reducedMotion, supportsHover, surfaceRef]);

  return { videoRef, failed, markFailed: () => setFailed(true) };
}
