import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Reveal } from '@/components/site/reveal';

function installIntersectionObserver() {
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

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('Reveal', () => {
  it('marks its single semantic motion target and preserves an article element', () => {
    installIntersectionObserver();
    const { container } = render(
      <Reveal as="article" className="case-unit" delay={0.08}>
        <h3>Case</h3>
      </Reveal>,
    );

    const target = container.querySelector('article[data-reveal]');
    expect(target).not.toBeNull();
    expect(target?.classList.contains('case-unit')).toBe(true);
    expect(target?.getAttribute('data-reveal')).toBe('');
  });
});
