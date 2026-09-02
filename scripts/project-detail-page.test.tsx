import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ProjectDetailPage } from '@/components/site/project-detail-page';
import { projects } from '@/lib/projects';
import { projectAccents } from '@/site/project-accents';

function installBrowserPrimitives() {
  window.matchMedia = vi.fn(() => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;

  class TestIntersectionObserver {
    root = null;
    rootMargin = '';
    thresholds = [];
    constructor(_callback: IntersectionObserverCallback) {}
    disconnect() {}
    observe() {}
    takeRecords() {
      return [];
    }
    unobserve() {}
  }
  vi.stubGlobal('IntersectionObserver', TestIntersectionObserver);
}

function rgb(hex: string) {
  return [0, 2, 4].map((index) =>
    Number.parseInt(hex.slice(index + 1, index + 3), 16),
  );
}

function luminance(channels: number[]) {
  return channels.reduce((total, value, index) => {
    const channel = value / 255;
    const linear =
      channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    return total + [0.2126, 0.7152, 0.0722][index] * linear;
  }, 0);
}

function contrast(first: string, second: string) {
  const [light, dark] = [luminance(rgb(first)), luminance(rgb(second))].sort(
    (a, b) => b - a,
  );
  return (light + 0.05) / (dark + 0.05);
}

function mixedHex(background: string, foreground: string, amount: number) {
  const channels = rgb(background).map((value, index) =>
    Math.round(value * (1 - amount) + rgb(foreground)[index] * amount),
  );
  return `#${channels.map((value) => value.toString(16).padStart(2, '0')).join('')}`;
}

describe('ProjectDetailPage', () => {
  beforeEach(installBrowserPrimitives);
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it.each(projects)(
    'renders the complete evidence hierarchy for $id',
    (project) => {
      const { container } = render(<ProjectDetailPage project={project} />);

      expect(
        screen.getAllByRole('heading', { level: 1, name: project.title }),
      ).toHaveLength(1);
      const hero = container.querySelector<HTMLElement>('.project-hero')!;
      expect(within(hero).getByText(`PROJECT / ${project.index}`)).toBeTruthy();
      for (const value of [project.audience, project.subtitle, project.metric])
        expect(within(hero).getByText(value)).toBeTruthy();
      const tagList = within(hero).getByRole('list', {
        name: `${project.title} 标签`,
      });
      expect(within(tagList).getAllByRole('listitem')).toHaveLength(
        project.tags.length,
      );
      for (const tag of project.tags)
        expect(within(tagList).getByText(tag)).toBeTruthy();

      const sections = [
        ['project-overview', '为什么做，以及做到哪里'],
        ['project-star', '从问题判断到可验证结果'],
        ['project-collaboration', '我与 AI 的分工'],
        ['project-decisions', '核心挑战与解决方案'],
        ['project-tooling', '工具与模型为什么这样选'],
        ['project-boundary', '诚实边界'],
      ] as const;
      for (const [id, heading] of sections) {
        const section = document.getElementById(id)!;
        expect(section.getAttribute('aria-labelledby')).toBe(`${id}-title`);
        expect(
          within(section).getByRole('heading', { level: 2, name: heading }),
        ).toBeTruthy();
      }

      const overview = document.getElementById('project-overview')!;
      const overviewGrid = overview.querySelector<HTMLElement>(
        '.project-overview-grid',
      )!;
      const overviewColumns = [...overviewGrid.children] as HTMLElement[];
      expect(overviewColumns).toHaveLength(3);
      const overviewValues = [
        ['问题背景', project.situation],
        ['产品任务', project.task],
        ['当前完成度', project.result[0]],
      ] as const;
      for (const [index, column] of overviewColumns.entries()) {
        const [label, value] = overviewValues[index]!;
        expect(within(column).getByText(label)).toBeTruthy();
        expect(within(column).getByText(value)).toBeTruthy();
      }

      const star = document.getElementById('project-star')!;
      const starCards = [
        ...star.querySelectorAll<HTMLElement>('article.project-star-card'),
      ];
      expect(starCards).toHaveLength(4);
      for (const label of ['SITUATION', 'TASK', 'ACTION', 'RESULT']) {
        const card = within(star).getByRole('article', { name: label });
        expect(card.classList.contains('project-star-card')).toBe(true);
        expect(
          within(card).getByRole('heading', { level: 3, name: label }),
        ).toBeTruthy();
      }
      for (const [label, values] of [
        ['SITUATION', [project.situation]],
        ['TASK', [project.task]],
        ['ACTION', project.actions],
        ['RESULT', project.result],
      ] as const) {
        const card = starCards.find((item) => within(item).queryByText(label))!;
        expect(within(card).getAllByRole('list')).toHaveLength(1);
        const listItems = within(card)
          .getAllByRole('listitem')
          .map((item) => item.textContent);
        expect(listItems).toHaveLength(values.length);
        expect(listItems).toEqual(values);
      }

      const collaboration = document.getElementById('project-collaboration')!;
      for (const [heading, values] of [
        ['我负责', project.humanRole],
        ['AI Agent 负责', project.agentRole],
      ] as const) {
        const article = within(collaboration)
          .getByRole('heading', { level: 3, name: heading })
          .closest('article')!;
        const listItems = within(article)
          .getAllByRole('listitem')
          .map((item) => item.textContent);
        expect(listItems).toHaveLength(values.length);
        expect(listItems).toEqual(values);
      }
      const loop = collaboration.querySelector<HTMLElement>('.project-loop')!;
      expect(within(loop).getByText(project.collaborationLoop)).toBeTruthy();

      const decisions = document.getElementById('project-decisions')!;
      expect(
        decisions.querySelectorAll('article.project-challenge'),
      ).toHaveLength(project.challenges.length);
      for (const challenge of project.challenges) {
        const card = within(decisions)
          .getByRole('heading', { level: 3, name: challenge.title })
          .closest('article')!;
        const contentBlocks = [...card.children].filter(
          (child) => child.tagName === 'DIV',
        ) as HTMLElement[];
        expect(contentBlocks).toHaveLength(2);
        expect(within(contentBlocks[0]).getByText('PROBLEM')).toBeTruthy();
        expect(
          within(contentBlocks[0]).getByText(challenge.problem),
        ).toBeTruthy();
        expect(within(contentBlocks[1]).getByText('SOLUTION')).toBeTruthy();
        expect(
          within(contentBlocks[1]).getByText(challenge.solution),
        ).toBeTruthy();
      }

      const tooling = document.getElementById('project-tooling')!;
      expect(tooling.querySelectorAll('article.project-tool')).toHaveLength(
        project.tools.length,
      );
      for (const tool of project.tools) {
        const card = within(tooling)
          .getByRole('heading', { level: 3, name: tool.name })
          .closest('article')!;
        expect(within(card).getByText(tool.reason)).toBeTruthy();
      }
      expect(
        within(document.getElementById('project-boundary')!).getByText(
          project.boundary,
        ),
      ).toBeTruthy();
      expect(
        document.querySelectorAll('aside.project-boundary-note'),
      ).toHaveLength(0);
      for (const landmark of screen.getAllByRole('complementary')) {
        expect(landmark.getAttribute('aria-label')).toBeTruthy();
      }
      expect(screen.queryByText(/复刻/)).toBeNull();
      expect(screen.queryByRole('link', { name: /pdf/i })).toBeNull();
      expect(document.querySelector('a[href$=".pdf"]')).toBeNull();
    },
  );

  it.each(projects)('sets a readable project accent for $id', (project) => {
    const { container } = render(<ProjectDetailPage project={project} />);
    const shell = container.querySelector('.project-shell') as HTMLElement;
    const accent = projectAccents[project.id];
    expect(shell.style.getPropertyValue('--project-accent')).toBe(accent);
    expect(contrast(accent, '#f7f7f3')).toBeGreaterThanOrEqual(4.5);
    expect(
      contrast(accent, mixedHex('#f7f7f3', accent, 0.09)),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it.each([
    ['compliance', 'resume-autofill', 'mock-interview'],
    ['mock-interview', 'compliance', 'career-pathfinder'],
    ['career-pathfinder', 'mock-interview', 'resume-autofill'],
    ['resume-autofill', 'career-pathfinder', 'compliance'],
  ] as const)(
    'uses cyclic base-safe pagination for %s',
    (id, previousId, nextId) => {
      const project = projects.find((item) => item.id === id)!;
      render(<ProjectDetailPage project={project} />);
      expect(
        screen.getByRole('link', { name: /返回主页/ }).getAttribute('href'),
      ).toMatch(/^(?:\/Personal-Resume)?\/#projects$/);
      expect(
        screen
          .getByRole('link', {
            name: `上一项目 ${projects.find((item) => item.id === previousId)!.title}`,
          })
          .getAttribute('href'),
      ).toMatch(new RegExp(`^(?:/Personal-Resume)?/projects/${previousId}/$`));
      expect(
        screen
          .getByRole('link', {
            name: `下一项目 ${projects.find((item) => item.id === nextId)!.title}`,
          })
          .getAttribute('href'),
      ).toMatch(new RegExp(`^(?:/Personal-Resume)?/projects/${nextId}/$`));
      const labelsByHash = {
        experience: '经历',
        projects: '项目',
        education: '教育',
        about: '关于',
        contact: '联系',
      };
      const mainNav = screen.getByRole('navigation', { name: '主导航' });
      for (const [hash, label] of Object.entries(labelsByHash)) {
        const link = within(mainNav).getByRole('link', { name: label });
        expect(link.getAttribute('href')).toMatch(
          new RegExp(`^(?:/Personal-Resume)?/#${hash}$`),
        );
      }
    },
  );
});
