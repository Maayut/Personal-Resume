import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { HomePage } from '@/components/site/home-page';
import {
  capabilityGroups,
  education,
  experiences,
  honors,
  profile,
} from '@/lib/resume';
import { projects } from '@/lib/projects';

function installMediaQueries() {
  window.matchMedia = vi.fn((query: string) => ({
    media: query,
    matches: query === '(prefers-reduced-motion: reduce)',
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('HomePage', () => {
  beforeEach(() => {
    installMediaQueries();
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(
      () => undefined,
    );
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders one accessible base-safe portrait', () => {
    render(<HomePage />);

    const portrait = screen.getByRole('img', { name: '马毓廷个人照片' });
    expect(screen.getAllByRole('img', { name: '马毓廷个人照片' })).toHaveLength(
      1,
    );
    expect(portrait.getAttribute('src')).toMatch(
      /(?:\/Personal-Resume)?\/media\/mayuting-portrait\.jpg$/,
    );
  });

  it('keeps results and highlights inside their experience articles', () => {
    render(<HomePage />);

    const articles = document.querySelectorAll('article.experience-item');
    expect(articles).toHaveLength(4);
    expect(
      document.querySelectorAll('.experience-item.is-featured'),
    ).toHaveLength(3);
    expect(
      document.querySelectorAll('.experience-item.is-compact'),
    ).toHaveLength(1);
    expect(document.querySelector('.metrics-strip')).toBeNull();

    for (const experience of experiences) {
      const article = screen
        .getByRole('heading', { name: experience.company })
        .closest('article');
      expect(article).not.toBeNull();
      expect(within(article!).getByText(experience.role)).toBeTruthy();
      expect(within(article!).getByText(experience.summary)).toBeTruthy();
      for (const metric of experience.metrics) {
        expect(within(article!).getByText(metric)).toBeTruthy();
      }
    }

    const compact = screen
      .getByRole('heading', { name: '科大讯飞' })
      .closest('article')!;
    expect(compact.classList.contains('is-compact')).toBe(true);
    expect(compact.querySelector('.experience-highlights')).toBeNull();
    expect(within(compact).getByText('交付效率提升约 100%')).toBeTruthy();
    expect(
      screen
        .getByText('问答响应耗时：约 5s → 约 2s')
        .closest('article')
        ?.querySelector('h3')?.textContent,
    ).toBe('千寻智能');
    expect(
      screen
        .getByText('口头禅重复率：40% → 10%')
        .closest('article')
        ?.querySelector('h3')?.textContent,
    ).toBe('京东科技');
    expect(
      screen
        .getByText('TV 端 MAU：540 万 → 900 万')
        .closest('article')
        ?.querySelector('h3')?.textContent,
    ).toBe('网易云音乐');
  });

  it('renders four linked project cards from the case data', () => {
    render(<HomePage />);

    const cards = document.querySelectorAll('article.project-card');
    expect(cards).toHaveLength(4);
    for (const project of projects) {
      const card = screen
        .getByRole('heading', { name: project.title })
        .closest('article')!;
      expect(within(card).getByText(project.metric)).toBeTruthy();
      expect(
        within(card)
          .getByRole('link', { name: '查看完整案例' })
          .getAttribute('href'),
      ).toMatch(new RegExp(`^(?:/Personal-Resume)?/projects/${project.id}/$`));
    }
  });

  it('renders approved headings, profile facts, capability groups, and honors without a PDF link', () => {
    render(<HomePage />);

    for (const text of [
      '00 / HUMAN IN THE LOOP',
      '把技术能力组织成可被使用的产品',
      '01 / FIELD EXPERIENCE',
      '从需求判断到现场交付',
      '02 / SELECTED AGENT WORK',
      '我与 Agent 共同完成的产品',
      '03 / EDUCATION & CAPABILITY',
      '研究、产品与工程之间',
      '武汉大学 · 信息资源管理硕士',
      profile.city,
      '国家二级运动员 · 三级跳远',
    ]) {
      expect(screen.getAllByText(text).length).toBeGreaterThan(0);
    }
    for (const item of education)
      expect(screen.getByText(item.degree)).toBeTruthy();
    for (const [label, values] of Object.entries(capabilityGroups)) {
      expect(screen.getByText(label)).toBeTruthy();
      expect(screen.getByText(values.join(' · '))).toBeTruthy();
    }
    for (const honor of honors) expect(screen.getByText(honor)).toBeTruthy();
    expect(screen.queryByRole('link', { name: /pdf/i })).toBeNull();
    expect(document.querySelector('a[href$=".pdf"]')).toBeNull();
  });
});
