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
      surface.addEventListener('pointermove', (event: PointerEvent) => {
        const rect = surface.getBoundingClientRect();
        surface.style.setProperty(
          '--pointer-x',
          ((event.clientX - rect.left) / rect.width) * 100 + '%',
        );
        surface.style.setProperty(
          '--pointer-y',
          ((event.clientY - rect.top) / rect.height) * 100 + '%',
        );
      });
      surface.addEventListener('pointerleave', () => {
        surface.style.setProperty('--pointer-x', '50%');
        surface.style.setProperty('--pointer-y', '50%');
      });
    });
}

export function MotionEnhancer() {
  const enhancementScript = `(${installMotionEnhancements.toString()})();`;

  return <script dangerouslySetInnerHTML={{ __html: enhancementScript }} />;
}
