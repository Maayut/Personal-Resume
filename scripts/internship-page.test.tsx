import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { InternshipPage } from '@/components/site/internship-page';
import { RecommendationDemo } from '@/components/site/internship-visuals';
import { experiences } from '@/lib/resume';

beforeEach(() => {
  window.matchMedia = vi.fn(() => ({
    matches: true,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

afterEach(() => {
  cleanup();
  window.history.replaceState(null, '', window.location.pathname);
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('internship pages', () => {
  it.each([
    ['qianxun', 'response'],
    ['jd', 'conversation'],
  ])(
    'restores a direct chapter link after %s mounts without removing its hash',
    (id, chapter) => {
      const scrollIntoView = vi.fn();
      Object.defineProperty(Element.prototype, 'scrollIntoView', {
        configurable: true,
        value: scrollIntoView,
      });
      window.history.replaceState(null, '', `#${chapter}`);

      render(<InternshipPage internshipId={id} />);

      expect(scrollIntoView).toHaveBeenCalledOnce();
      expect(scrollIntoView.mock.instances[0]).toBe(
        document.getElementById(chapter),
      );
      expect(scrollIntoView).toHaveBeenCalledWith({
        behavior: 'instant',
        block: 'start',
      });
      expect(window.location.hash).toBe(`#${chapter}`);
    },
  );

  it.each(['', '#unknown-chapter'])(
    'leaves the initial position alone for %s',
    (hash) => {
      const scrollIntoView = vi.fn();
      Object.defineProperty(Element.prototype, 'scrollIntoView', {
        configurable: true,
        value: scrollIntoView,
      });
      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}${hash}`,
      );

      render(<InternshipPage internshipId="jd" />);

      expect(scrollIntoView).not.toHaveBeenCalled();
    },
  );

  it.each([
    {
      id: 'qianxun',
      next: 'jd',
      heading: '茶点服务与接待机器人多模态交互产品实践',
      count: 5,
    },
    {
      id: 'jd',
      next: 'qianxun',
      heading: '京造炒菜机器人JOYINSIDE 语音交互',
      count: 5,
    },
  ])(
    'renders $id with a complete chapter index, resume facts and working navigation',
    ({ id, next, heading, count }) => {
      const { container } = render(<InternshipPage internshipId={id} />);
      expect(
        screen.getByRole('heading', { level: 1, name: heading }),
      ).toBeTruthy();
      const experience = experiences.find((item) => item.detailId === id)!;
      expect(screen.getByText(experience.period)).toBeTruthy();
      expect(screen.getByText(experience.role)).toBeTruthy();
      const index = screen.getByRole('navigation', { name: '实习案例章节' });
      const links = within(index).getAllByRole('link');
      expect(links).toHaveLength(count);
      for (const link of links) {
        const target = container.querySelector(link.getAttribute('href')!);
        expect(target).not.toBeNull();
        expect(target?.getAttribute('aria-labelledby')).toBeTruthy();
      }
      expect(
        screen.getByRole('link', { name: '返回实习经历' }).getAttribute('href'),
      ).toMatch(/^(?:\/Personal-Resume)?\/#experience$/);
      expect(
        container.querySelector('.internship-next')?.getAttribute('href'),
      ).toMatch(new RegExp(`/experience/${next}/$`));
    },
  );

  it('asks for preferences only on the third batch change and allows reset', async () => {
    const user = userEvent.setup();
    render(<RecommendationDemo />);
    for (let count = 0; count < 2; count++) {
      await user.click(screen.getByRole('button', { name: /换一批菜谱/ }));
      expect(screen.queryByRole('button', { name: '口味' })).toBeNull();
    }
    await user.click(screen.getByRole('button', { name: /换一批菜谱/ }));
    expect(screen.getByRole('status').textContent).toContain(
      '口味、食材，还是烹饪时间',
    );
    await user.click(screen.getByRole('button', { name: '时间' }));
    expect(screen.getByRole('status').textContent).toContain(
      '根据「时间」补充筛选条件',
    );
    expect(
      screen.getByRole('button', { name: '时间' }).getAttribute('aria-pressed'),
    ).toBe('true');
    await user.click(screen.getByRole('button', { name: '重置' }));
    expect(screen.queryByRole('button', { name: '时间' })).toBeNull();
    expect(screen.getByText('换批次数 0 / 3')).toBeTruthy();
  });

  it('keeps keyboard focus within the demo when its controls change', async () => {
    const user = userEvent.setup();
    render(<RecommendationDemo />);
    const changeBatch = screen.getByRole('button', { name: /换一批菜谱/ });
    expect(document.activeElement).not.toBe(changeBatch);
    await user.tab();
    expect(document.activeElement).toBe(changeBatch);

    await user.keyboard('{Enter}{Enter}{Enter}');
    const preferences = screen.getByRole('group', { name: '选择偏好方向' });
    expect(document.activeElement).toBe(
      within(preferences).getByRole('button', { name: '口味' }),
    );

    await user.tab();
    await user.tab();
    const timePreference = within(preferences).getByRole('button', {
      name: '时间',
    });
    expect(document.activeElement).toBe(timePreference);
    await user.keyboard('{Enter}');
    expect(timePreference.getAttribute('aria-pressed')).toBe('true');
    expect(document.activeElement).toBe(timePreference);

    await user.tab();
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: '重置' }),
    );
    await user.keyboard('{Enter}');
    expect(screen.queryByRole('group', { name: '选择偏好方向' })).toBeNull();
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: /换一批菜谱/ }),
    );
  });

  it('handles unknown experience ids without showing another company', () => {
    render(<InternshipPage internshipId="missing" />);
    expect(
      screen.getByRole('heading', { name: '实习经历不存在' }),
    ).toBeTruthy();
    expect(
      screen.getByRole('link', { name: '返回实习经历' }).getAttribute('href'),
    ).toMatch(/\/#experience$/);
  });
});
