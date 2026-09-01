"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { homeHref } from "@/site/routes";

const links = [
  { label: "经历", hash: "#experience" },
  { label: "项目", hash: "#projects" },
  { label: "教育", hash: "#education" },
  { label: "关于", hash: "#about" },
  { label: "联系", hash: "#contact" },
];

export function SiteNav({ projectMode = false }: { projectMode?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const hrefFor = (hash: string) => (projectMode ? homeHref(hash) : hash);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <>
      <header className="site-nav">
        <div className="site-container nav-inner">
          <a className="nav-brand" href={homeHref()} aria-label="马毓廷个人主页">
            马毓廷 ✣
          </a>
          <nav className="desktop-nav" aria-label="主导航">
            {links.map(({ label, hash }) => <a key={hash} href={hrefFor(hash)}>{label}</a>)}
          </nav>
          <button
            className="menu-button"
            type="button"
            aria-label="打开导航菜单"
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
            className="mobile-nav"
            aria-label="移动导航"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            {links.map(({ label, hash }) => (
              <a key={hash} href={hrefFor(hash)} onClick={() => setIsOpen(false)}>{label}</a>
            ))}
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </>
  );
}
