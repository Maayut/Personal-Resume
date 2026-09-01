import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

async function read(path) {
  return readFile(new URL(path, import.meta.url), 'utf8').catch(() => '');
}

const [css, nav, home, project, hero, videoHook, heroFallback] =
  await Promise.all([
    read('../site/site.css'),
    read('../components/site/site-nav.tsx'),
    read('../components/site/home-page.tsx'),
    read('../components/site/project-detail-page.tsx'),
    read('../components/site/interactive-hero.tsx'),
    read('../hooks/use-background-video.ts'),
    read('../public/media/hero-fallback.svg'),
  ]);

test('shared page shells include the site navigation and footer', () => {
  assert.match(home, /<SiteNav\s*\/>/);
  assert.match(home, /<SiteFooter\s*\/>/);
  assert.match(project, /<SiteNav\s+projectMode\s*\/>/);
  assert.match(project, /<SiteFooter\s*\/>/);
});

test('shared CSS exposes the site design tokens', () => {
  for (const token of [
    '--paper',
    '--paper-deep',
    '--ink',
    '--muted-ink',
    '--signal',
    '--signal-soft',
    '--grid-line',
    '--project-accent',
    '--radius-sm',
    '--radius-lg',
    '--ease-field',
    '--font-display',
    '--font-body',
  ]) {
    assert.match(css, new RegExp(token));
  }
  assert.match(css, /--paper:\s*#f7f7f3;/);
  assert.match(css, /--paper-deep:\s*#eceee9;/);
  assert.match(css, /--ink:\s*#111915;/);
  assert.match(css, /--muted-ink:\s*#5f6962;/);
  assert.match(css, /--signal:\s*#4d6d47;/);
  assert.match(css, /--signal-soft:\s*#dfe8dd;/);
  assert.match(css, /font-family:\s*var\(--font-body\)/);
  assert.match(css, /font-family:\s*var\(--font-display\)/);
});

test('navigation presents the approved visible brand', () => {
  assert.match(
    nav,
    /<a[\s\S]*className="nav-brand"[\s\S]*>\s*马毓廷 ✣\s*<\/a>/,
  );
});

test('public shared shells do not offer a PDF download', () => {
  assert.doesNotMatch(`${home}${nav}`, /下载 PDF|\.pdf/i);
});

test('navigation supports reduced motion and accessible mobile disclosure', () => {
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /scroll-padding-top:\s*4\.75rem/);
  assert.match(
    css,
    /@media \(max-width: 860px\)[\s\S]*scroll-padding-top:\s*4rem/,
  );
  assert.doesNotMatch(css, /scroll-margin-top/);
  assert.match(project, /project-detail-content/);
  assert.match(nav, /MotionConfig\s+reducedMotion="user"/);
  assert.match(nav, /AnimatePresence/);
  assert.match(nav, /aria-expanded/);
});

test('interactive hero retains its approved media and sensing copy contracts', () => {
  assert.match(hero, /hf_20260601_110537/);
  assert.match(hero, /hero-fallback\.svg/);
  assert.match(hero, /AI PRODUCT MANAGER · EMBODIED INTELLIGENCE/);
});

test('hero fallback SVG is purely decorative without textual metadata', () => {
  assert.match(heroFallback, /aria-hidden="true"/);
  assert.match(heroFallback, /focusable="false"/);
  assert.doesNotMatch(heroFallback, /<(?:text|title|desc)\b/i);
  assert.doesNotMatch(heroFallback, /aria-label/i);
});

test('background video hook encodes motion-safe responsive scrubbing', () => {
  assert.match(videoHook, /prefers-reduced-motion/);
  assert.match(videoHook, /1024/);
  assert.match(videoHook, /Math\.max\(\s*0,/);
});
