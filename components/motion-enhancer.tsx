export function installMotionEnhancements() {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;
  root.classList.add('motion-ready');

  const revealItems = [...document.querySelectorAll('[data-reveal]')];
  if (reducedMotion) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
    );

    revealItems.forEach((item) => observer.observe(item));
  }

  const updateScrollProgress = () => {
    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    root.style.setProperty(
      '--scroll-progress',
      String(Math.min(1, Math.max(0, progress))),
    );
  };
  updateScrollProgress();
  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  document
    .querySelectorAll<HTMLElement>('[data-spotlight]')
    .forEach((surface) => {
      let frameId: number | null = null;
      let rect: DOMRect | null = null;
      let nextX = '50%';
      let nextY = '50%';

      const apply = () => {
        frameId = null;
        surface.style.setProperty('--pointer-x', nextX);
        surface.style.setProperty('--pointer-y', nextY);
      };
      const schedule = () => {
        if (frameId === null) frameId = window.requestAnimationFrame(apply);
      };
      const cacheRect = () => {
        rect = surface.getBoundingClientRect();
      };
      const onPointerMove = (event: PointerEvent) => {
        if (!rect) return;
        nextX = `${((event.clientX - rect.left) / rect.width) * 100}%`;
        nextY = `${((event.clientY - rect.top) / rect.height) * 100}%`;
        schedule();
      };
      const onPointerLeave = () => {
        rect = null;
        nextX = '50%';
        nextY = '50%';
        schedule();
      };
      const invalidateRect = () => {
        if (rect) cacheRect();
      };

      surface.addEventListener('pointerenter', cacheRect);
      surface.addEventListener('pointermove', onPointerMove);
      surface.addEventListener('pointerleave', onPointerLeave);
      window.addEventListener('resize', invalidateRect, { passive: true });
    });
}

export function MotionEnhancer() {
  const enhancementScript = `(${installMotionEnhancements.toString()})();`;

  return <script dangerouslySetInnerHTML={{ __html: enhancementScript }} />;
}
