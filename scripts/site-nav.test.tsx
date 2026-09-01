import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SiteNav } from '@/components/site/site-nav';

type MediaListener = (event: MediaQueryListEvent) => void;

function installMediaQueries() {
  let desktop = false;
  let reducedMotion = false;
  const queries = new Map<string, Set<MediaListener>>();

  const matches = (query: string) => {
    if (query === '(min-width: 861px)') return desktop;
    if (query === '(prefers-reduced-motion: reduce)') return reducedMotion;
    return false;
  };

  window.matchMedia = vi.fn((query: string) => {
    const listeners = queries.get(query) ?? new Set<MediaListener>();
    queries.set(query, listeners);
    return {
      media: query,
      onchange: null,
      get matches() {
        return matches(query);
      },
      addEventListener: (_type: 'change', listener: MediaListener) =>
        listeners.add(listener),
      removeEventListener: (_type: 'change', listener: MediaListener) =>
        listeners.delete(listener),
      addListener: (listener: MediaListener) => listeners.add(listener),
      removeListener: (listener: MediaListener) => listeners.delete(listener),
      dispatchEvent: () => true,
    } as unknown as MediaQueryList;
  });

  const notify = (query: string) => {
    for (const listener of queries.get(query) ?? []) {
      listener({
        matches: matches(query),
        media: query,
      } as MediaQueryListEvent);
    }
  };

  return {
    setDesktop(value: boolean) {
      desktop = value;
      notify('(min-width: 861px)');
    },
    setReducedMotion(value: boolean) {
      reducedMotion = value;
      notify('(prefers-reduced-motion: reduce)');
    },
  };
}

describe('SiteNav', () => {
  let media: ReturnType<typeof installMediaQueries>;

  beforeEach(() => {
    media = installMediaQueries();
    document.body.style.overflow = '';
    window.location.hash = '';
  });

  afterEach(() => {
    cleanup();
    document.body.style.overflow = '';
  });

  async function openMenu() {
    const user = userEvent.setup();
    const trigger = screen.getByRole('button', { name: '打开导航菜单' });
    await user.click(trigger);
    const menu = await screen.findByRole('navigation', { name: '移动导航' });
    return { menu, trigger, user };
  }

  it('opens with a linked trigger, locks scrolling, and focuses the first link', async () => {
    render(<SiteNav />);

    const { menu, trigger } = await openMenu();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(trigger.getAttribute('aria-controls')).toBe(
      'site-mobile-navigation',
    );
    expect(trigger.getAttribute('aria-label')).toBe('关闭导航菜单');
    expect(menu.getAttribute('id')).toBe('site-mobile-navigation');
    expect(document.activeElement).toBe(
      within(menu).getByRole('link', { name: '经历' }),
    );
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('traps Tab and Shift+Tab inside the open menu', async () => {
    render(<SiteNav />);

    const { menu } = await openMenu();
    const links = within(menu).getAllByRole('link');
    const first = links[0];
    const last = links.at(-1)!;

    fireEvent.keyDown(first, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(last);
    fireEvent.keyDown(last, { key: 'Tab' });
    expect(document.activeElement).toBe(first);
  });

  it('closes on Escape and restores focus to the trigger', async () => {
    render(<SiteNav />);

    const { trigger } = await openMenu();
    fireEvent.keyDown(window, { key: 'Escape' });

    await waitFor(() =>
      expect(trigger.getAttribute('aria-expanded')).toBe('false'),
    );
    expect(document.activeElement).toBe(trigger);
    expect(document.body.style.overflow).toBe('');
  });

  it('closes after link selection while preserving the destination hash', async () => {
    render(<SiteNav />);

    const { menu, trigger, user } = await openMenu();
    await user.click(within(menu).getByRole('link', { name: '经历' }));

    await waitFor(() =>
      expect(trigger.getAttribute('aria-expanded')).toBe('false'),
    );
    expect(window.location.hash).toBe('#experience');
  });

  it('closes on a desktop breakpoint without focusing the hidden trigger', async () => {
    render(<SiteNav />);

    const { trigger } = await openMenu();
    media.setDesktop(true);

    await waitFor(() =>
      expect(trigger.getAttribute('aria-expanded')).toBe('false'),
    );
    expect(document.activeElement).not.toBe(trigger);
  });

  it('respects reduced motion while keeping the mobile menu available', async () => {
    media.setReducedMotion(true);
    render(<SiteNav />);

    const { menu } = await openMenu();

    expect(menu.getAttribute('data-motion-mode')).toBe('reduced');
    expect(menu.style.transform).toBe('');
  });
});
