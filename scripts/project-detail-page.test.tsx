import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ProjectDetailPage } from '@/components/site/project-detail-page';
import { projects } from '@/lib/projects';

const expectedAccents = {
  compliance: '#1f5f3a',
  'mock-interview': '#9c3b00',
  'career-pathfinder': '#69408d',
  'resume-autofill': '#195d91',
} as const;

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
      render(<ProjectDetailPage project={project} />);

      expect(
        screen.getAllByRole('heading', { level: 1, name: project.title }),
      ).toHaveLength(1);
      for (const value of [
        project.audience,
        project.subtitle,
        project.metric,
      ]) {
        expect(screen.getByText(value)).toBeTruthy();
      }
      const tagList = screen.getByRole('list', {
        name: `${project.title} 标签`,
      });
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
      for (const value of [
        project.situation,
        project.task,
        project.result[0],
      ]) {
        expect(within(overview).getByText(value)).toBeTruthy();
      }
      const star = document.getElementById('project-star')!;
      for (const value of [
        project.situation,
        project.task,
        ...project.actions,
        ...project.result,
      ]) {
        expect(within(star).getByText(value)).toBeTruthy();
      }
      const collaboration = document.getElementById('project-collaboration')!;
      for (const value of [
        ...project.humanRole,
        ...project.agentRole,
        project.collaborationLoop,
      ]) {
        expect(within(collaboration).getByText(value)).toBeTruthy();
      }
      const decisions = document.getElementById('project-decisions')!;
      expect(
        decisions.querySelectorAll('article.project-challenge'),
      ).toHaveLength(project.challenges.length);
      for (const challenge of project.challenges) {
        expect(within(decisions).getByText(challenge.title)).toBeTruthy();
        expect(within(decisions).getByText(challenge.problem)).toBeTruthy();
        expect(within(decisions).getByText(challenge.solution)).toBeTruthy();
      }
      const tooling = document.getElementById('project-tooling')!;
      expect(tooling.querySelectorAll('article.project-tool')).toHaveLength(
        project.tools.length,
      );
      for (const tool of project.tools) {
        expect(within(tooling).getByText(tool.name)).toBeTruthy();
        expect(within(tooling).getByText(tool.reason)).toBeTruthy();
      }
      expect(
        within(document.getElementById('project-boundary')!).getByText(
          project.boundary,
        ),
      ).toBeTruthy();
      expect(screen.queryByText(/复刻/)).toBeNull();
      expect(screen.queryByRole('link', { name: /pdf/i })).toBeNull();
      expect(document.querySelector('a[href$=".pdf"]')).toBeNull();
    },
  );

  it.each(projects)('sets a readable project accent for $id', (project) => {
    const { container } = render(<ProjectDetailPage project={project} />);
    const shell = container.querySelector('.project-shell') as HTMLElement;
    const accent = expectedAccents[project.id];
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
