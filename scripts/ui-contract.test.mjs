import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

async function read(path) {
  return readFile(new URL(path, import.meta.url), 'utf8').catch(() => '');
}

const [css, nav, home, project, hero, videoHook, heroFallback, reveal] =
  await Promise.all([
    read('../site/site.css'),
    read('../components/site/site-nav.tsx'),
    read('../components/site/home-page.tsx'),
    read('../components/site/project-detail-page.tsx'),
    read('../components/site/interactive-hero.tsx'),
    read('../hooks/use-background-video.ts'),
    read('../public/media/hero-fallback.svg'),
    read('../components/site/reveal.tsx'),
  ]);

test('shared page shells include the site navigation and footer', () => {
  assert.match(home, /<SiteNav\s*\/>/);
  assert.match(home, /<SiteFooter\s*\/>/);
  assert.match(project, /<SiteNav\s+projectMode\s*\/>/);
  assert.match(project, /<SiteFooter\s*\/>/);
});

test('project detail source declares the complete evidence-led case structure', () => {
  for (const label of [
    'SITUATION',
    'TASK',
    'ACTION',
    'RESULT',
    '我负责',
    'AI Agent 负责',
    '核心挑战',
    '工具与模型',
    '诚实边界',
  ]) {
    assert.match(project, new RegExp(label));
  }
  assert.match(project, /project\.challenges\.map/);
  assert.match(project, /projectHref/);
  assert.match(project, /--project-accent/);
  assert.match(project, /<SiteNav\s+projectMode\s*\/>/);
  assert.doesNotMatch(project, /ProjectCaseCard/);
  assert.doesNotMatch(project, /from\s+['"][^'"]*project-case/);
});

function hexToRgb(hex) {
  return [0, 2, 4].map((index) =>
    Number.parseInt(hex.slice(index + 1, index + 3), 16),
  );
}

function relativeLuminance([red, green, blue]) {
  const channel = (value) => {
    const normalized = value / 255;
    return normalized <= 0.04045
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  };
  return (
    0.2126 * channel(red) + 0.7152 * channel(green) + 0.0722 * channel(blue)
  );
}

function contrast(first, second) {
  const [lighter, darker] = [
    relativeLuminance(first),
    relativeLuminance(second),
  ].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

function mix(background, foreground, foregroundRatio) {
  return background.map((value, index) =>
    Math.round(
      value * (1 - foregroundRatio) + foreground[index] * foregroundRatio,
    ),
  );
}

test('homepage source declares the recruiter-facing content structure', () => {
  for (const label of [
    'HUMAN IN THE LOOP',
    'FIELD EXPERIENCE',
    'SELECTED AGENT WORK',
    'EDUCATION',
    'CAPABILITY',
  ]) {
    assert.match(home, new RegExp(label));
  }
  for (const anchor of ['about', 'experience', 'projects', 'education']) {
    assert.match(home, new RegExp(`id=["']${anchor}["']`));
  }
  assert.match(home, /mayuting-portrait\.jpg/);
  assert.match(home, /experiences\.map/);
  assert.match(home, /projects\.map/);
  assert.match(
    home,
    /我的实践从智能座舱数据、IoT 商业化延伸到语音 Agent 与具身机器人：先确认人在什么场景下遇到什么阻力，再定义交互策略、协作边界和上线验收。/,
  );
  assert.doesNotMatch(home, /真实日志、场景约束和用户反馈/);
});

test('reveal primitive keeps motion singular, viewport-bound, and user-reduced', () => {
  assert.match(reveal, /MotionConfig\s+reducedMotion="user"/);
  assert.match(reveal, /whileInView/);
  assert.match(reveal, /once:\s*true/);
  assert.match(reveal, /data-reveal/);
  assert.match(reveal, /duration:\s*0\.5/);
  assert.match(home, /experiences\.map\(\(experience, index\)/);
  assert.match(home, /projects\.map\(\(project, index\)/);
  assert.match(home, /delay=\{index \* 0\.04\}/);
});

test('project accent colors stay readable on normal and hover card surfaces', () => {
  const expectedAccents = {
    compliance: '#1f5f3a',
    'mock-interview': '#9c3b00',
    'career-pathfinder': '#69408d',
    'resume-autofill': '#195d91',
  };
  const paper = hexToRgb('#f7f7f3');
  assert.equal(new Set(Object.values(expectedAccents)).size, 4);

  for (const [project, hex] of Object.entries(expectedAccents)) {
    assert.match(
      css,
      new RegExp(
        `\\.project-accent-${project}\\s*\\{\\s*--project-card-accent:\\s*${hex};`,
      ),
    );
    const accent = hexToRgb(hex);
    const hover = mix(paper, accent, 0.08);
    assert.ok(
      contrast(accent, paper) >= 4.5,
      `${project} should pass on paper`,
    );
    assert.ok(
      contrast(accent, hover) >= 4.5,
      `${project} should pass on hover`,
    );
  }
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
  assert.match(project, /project-shell/);
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
