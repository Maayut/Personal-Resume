'use client';

import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { homeHref } from '@/site/routes';

const links = [
  { label: '经历', hash: '#experience' },
  { label: '项目', hash: '#projects' },
  { label: '教育', hash: '#education' },
  { label: '关于', hash: '#about' },
  { label: '联系', hash: '#contact' },
];
const mobileNavId = 'site-mobile-navigation';

export function SiteNav({ projectMode = false }: { projectMode?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const hrefFor = (hash: string) => (projectMode ? homeHref(hash) : hash);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateReducedMotion = (event: MediaQueryListEvent) =>
      setReducedMotion(event.matches);

    motionQuery.addEventListener('change', updateReducedMotion);
    return () => motionQuery.removeEventListener('change', updateReducedMotion);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    firstMenuLinkRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsOpen(false);
      triggerRef.current?.focus();
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isOpen]);

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 861px)');
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setIsOpen(false);
    };

    desktopQuery.addEventListener('change', closeOnDesktop);
    return () => desktopQuery.removeEventListener('change', closeOnDesktop);
  }, []);

  const trapMenuFocus = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Tab') return;

    const focusable =
      menuRef.current?.querySelectorAll<HTMLAnchorElement>('a[href]');
    if (!focusable?.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <header className="site-nav">
        <div className="site-container nav-inner">
          <a
            className="nav-brand"
            href={homeHref()}
            aria-label="马毓廷个人主页"
          >
            马毓廷 ✣
          </a>
          <nav className="desktop-nav" aria-label="主导航">
            {links.map(({ label, hash }) => (
              <a key={hash} href={hrefFor(hash)}>
                {label}
              </a>
            ))}
          </nav>
          <button
            ref={triggerRef}
            className="menu-button"
            type="button"
            aria-controls={mobileNavId}
            aria-label={isOpen ? '关闭导航菜单' : '打开导航菜单'}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((open) => !open)}
          >
            菜单
          </button>
        </div>
      </header>
      <AnimatePresence>
        {isOpen ? (
          <motion.nav
            ref={menuRef}
            id={mobileNavId}
            className="mobile-nav"
            aria-label="移动导航"
            data-motion-mode={reducedMotion ? 'reduced' : 'full'}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            onKeyDown={trapMenuFocus}
          >
            {links.map(({ label, hash }, index) => (
              <a
                key={hash}
                ref={index === 0 ? firstMenuLinkRef : undefined}
                href={hrefFor(hash)}
                onClick={() => setIsOpen(false)}
              >
                {label}
              </a>
            ))}
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </MotionConfig>
  );
}
