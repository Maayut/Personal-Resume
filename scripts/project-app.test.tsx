import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ProjectApp } from '@/components/site/project-app';
import { projects } from '@/lib/projects';

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

describe('ProjectApp', () => {
  beforeEach(installBrowserPrimitives);
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it.each(projects)('selects only the $id project route', (project) => {
    render(<ProjectApp projectId={project.id} />);

    expect(
      screen.getByRole('heading', { level: 1, name: project.title }),
    ).toBeTruthy();
    for (const other of projects.filter((item) => item.id !== project.id)) {
      expect(
        screen.queryByRole('heading', { level: 1, name: other.title }),
      ).toBeNull();
    }
  });

  it.each([undefined, 'missing-project'])(
    'renders an accessible base-safe fallback for %s',
    (projectId) => {
      render(<ProjectApp projectId={projectId} />);

      expect(
        screen.getByRole('heading', { level: 1, name: '项目不存在' }),
      ).toBeTruthy();
      expect(screen.getByText('请返回主页查看已发布的项目案例。')).toBeTruthy();
      expect(
        screen.getByRole('link', { name: '返回主页' }).getAttribute('href'),
      ).toMatch(/^(?:\/Personal-Resume)?\/$/);
      expect(screen.getByRole('navigation', { name: '主导航' })).toBeTruthy();
      expect(screen.getByRole('contentinfo')).toBeTruthy();
    },
  );
});
