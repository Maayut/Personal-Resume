import { useEffect, useRef } from 'react';

import { useMediaQuery } from '@/hooks/use-media-query';

const MAX_SHIFT_X = 18;
const MAX_SHIFT_Y = 10;
const FOLLOW_EASE = 0.12;
const SETTLE_EPSILON = 0.05;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function useHeroPointerFollow<T extends HTMLElement = HTMLElement>() {
  const surfaceRef = useRef<T>(null);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const desktop = useMediaQuery('(min-width: 1024px)');

  useEffect(() => {
    const surface = surfaceRef.current;
    if (!surface || reducedMotion || !desktop) return;

    let rect: DOMRect | null = null;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frameId: number | null = null;

    const cancelFrame = () => {
      if (frameId === null) return;
      window.cancelAnimationFrame(frameId);
      frameId = null;
    };

    const apply = () => {
      frameId = null;
      if (document.visibilityState === 'hidden') return;

      currentX += (targetX - currentX) * FOLLOW_EASE;
      currentY += (targetY - currentY) * FOLLOW_EASE;
      surface.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;

      if (
        Math.abs(targetX - currentX) > SETTLE_EPSILON ||
        Math.abs(targetY - currentY) > SETTLE_EPSILON
      ) {
        frameId = window.requestAnimationFrame(apply);
      }
    };

    const schedule = () => {
      if (frameId !== null || document.visibilityState === 'hidden') return;
      frameId = window.requestAnimationFrame(apply);
    };

    const updateTarget = (event: PointerEvent) => {
      if (document.visibilityState === 'hidden') return;
      if (!rect) rect = surface.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const normalizedX = clamp(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -1,
        1,
      );
      const normalizedY = clamp(
        ((event.clientY - rect.top) / rect.height) * 2 - 1,
        -1,
        1,
      );

      targetX = normalizedX * MAX_SHIFT_X;
      targetY = normalizedY * MAX_SHIFT_Y;
      schedule();
    };

    const onPointerEnter = (event: PointerEvent) => {
      rect = surface.getBoundingClientRect();
      updateTarget(event);
    };

    const onPointerLeave = () => {
      targetX = 0;
      targetY = 0;
      schedule();
    };

    const onResize = () => {
      rect = null;
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        cancelFrame();
        return;
      }

      rect = null;
      schedule();
    };

    surface.addEventListener('pointerenter', onPointerEnter);
    surface.addEventListener('pointermove', updateTarget);
    surface.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      cancelFrame();
      surface.removeEventListener('pointerenter', onPointerEnter);
      surface.removeEventListener('pointermove', updateTarget);
      surface.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      surface.style.transform = '';
    };
  }, [desktop, reducedMotion]);

  return { surfaceRef };
}
