import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { StrictMode, useEffect } from 'react';

import { InteractiveHero } from '@/components/site/interactive-hero';
import { useBackgroundVideo } from '@/hooks/use-background-video';
import { useTypewriter } from '@/hooks/use-typewriter';

type MediaListener = (event: MediaQueryListEvent) => void;

function installMediaQuery(
  initialReducedMotion = false,
  initialDesktop = true,
) {
  let reducedMotion = initialReducedMotion;
  let desktop = initialDesktop;
  const listeners = new Map<string, Set<MediaListener>>();

  const matches = (query: string) => {
    if (query === '(prefers-reduced-motion: reduce)') return reducedMotion;
    if (query === '(min-width: 1024px)') return desktop;
    return false;
  };

  const notify = (query: string) => {
    for (const listener of listeners.get(query) ?? []) {
      listener({
        matches: matches(query),
        media: query,
      } as MediaQueryListEvent);
    }
  };

  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    value: desktop ? 1280 : 800,
  });
  window.matchMedia = vi.fn((query: string) => {
    const queryListeners = listeners.get(query) ?? new Set<MediaListener>();
    listeners.set(query, queryListeners);
    return {
      media: query,
      onchange: null,
      get matches() {
        return matches(query);
      },
      addEventListener: (_type: 'change', listener: MediaListener) =>
        queryListeners.add(listener),
      removeEventListener: (_type: 'change', listener: MediaListener) =>
        queryListeners.delete(listener),
      addListener: (listener: MediaListener) => queryListeners.add(listener),
      removeListener: (listener: MediaListener) =>
        queryListeners.delete(listener),
      dispatchEvent: () => true,
    } as unknown as MediaQueryList;
  });

  return {
    setReducedMotion(value: boolean) {
      reducedMotion = value;
      notify('(prefers-reduced-motion: reduce)');
    },
    setDesktop(value: boolean) {
      desktop = value;
      Object.defineProperty(window, 'innerWidth', {
        configurable: true,
        value: desktop ? 1280 : 800,
      });
      notify('(min-width: 1024px)');
    },
  };
}

function TypewriterProbe({
  text,
  speed = 42,
  delay = 450,
}: {
  text: string;
  speed?: number;
  delay?: number;
}) {
  const { displayed, done } = useTypewriter(text, speed, delay);
  return <output data-done={done}>{displayed}</output>;
}

function VideoProbe({
  onReady,
}: {
  onReady: (video: HTMLVideoElement) => void;
}) {
  const { videoRef } = useBackgroundVideo();

  useEffect(() => {
    if (videoRef.current) onReady(videoRef.current);
  }, [onReady, videoRef]);

  return <video ref={videoRef} muted playsInline />;
}

describe('useTypewriter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('returns complete text immediately for reduced motion', () => {
    installMediaQuery(true);
    render(<TypewriterProbe text="SENSE" />);

    expect(screen.getByRole('status').textContent).toBe('SENSE');
    expect(screen.getByRole('status').getAttribute('data-done')).toBe('true');
  });

  it('starts after delay, advances at speed, completes, and clears timers', () => {
    installMediaQuery(false);
    const clearInterval = vi.spyOn(globalThis, 'clearInterval');
    const { unmount } = render(
      <TypewriterProbe text="AI" speed={40} delay={100} />,
    );

    expect(screen.getByRole('status').textContent).toBe('');
    void act(() => vi.advanceTimersByTime(99));
    expect(screen.getByRole('status').textContent).toBe('');
    void act(() => vi.advanceTimersByTime(1));
    void act(() => vi.advanceTimersByTime(40));
    expect(screen.getByRole('status').textContent).toBe('A');
    void act(() => vi.advanceTimersByTime(40));
    expect(screen.getByRole('status').textContent).toBe('AI');
    expect(screen.getByRole('status').getAttribute('data-done')).toBe('true');

    unmount();
    expect(clearInterval).toHaveBeenCalled();
  });

  it('keeps one correct progression when StrictMode replays effects', () => {
    installMediaQuery(false);
    render(
      <StrictMode>
        <TypewriterProbe text="MAP" speed={20} delay={30} />
      </StrictMode>,
    );

    void act(() => vi.advanceTimersByTime(30));
    expect(vi.getTimerCount()).toBe(1);
    void act(() => vi.advanceTimersByTime(20));
    expect(screen.getByRole('status').textContent).toBe('M');
    void act(() => vi.advanceTimersByTime(20));
    expect(screen.getByRole('status').textContent).toBe('MA');
    void act(() => vi.advanceTimersByTime(20));
    expect(screen.getByRole('status').textContent).toBe('MAP');
    expect(screen.getByRole('status').getAttribute('data-done')).toBe('true');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('resets immediately for changed inputs and prevents stale timers', () => {
    installMediaQuery(false);
    const { rerender } = render(
      <TypewriterProbe text="OLD" speed={25} delay={50} />,
    );

    void act(() => vi.advanceTimersByTime(75));
    expect(screen.getByRole('status').textContent).toBe('O');

    rerender(<TypewriterProbe text="NEW" speed={10} delay={80} />);
    expect(screen.getByRole('status').textContent).toBe('');
    expect(screen.getByRole('status').getAttribute('data-done')).toBe('false');
    void act(() => vi.advanceTimersByTime(79));
    expect(screen.getByRole('status').textContent).toBe('');
    void act(() => vi.advanceTimersByTime(1));
    void act(() => vi.advanceTimersByTime(10));
    expect(screen.getByRole('status').textContent).toBe('N');
    void act(() => vi.advanceTimersByTime(20));
    expect(screen.getByRole('status').textContent).toBe('NEW');
    expect(screen.getByRole('status').getAttribute('data-done')).toBe('true');

    rerender(<output>stopped</output>);
    void act(() => vi.advanceTimersByTime(500));
    expect(screen.getByRole('status').textContent).toBe('stopped');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('restarts after nonempty, empty, then the original text', () => {
    installMediaQuery(false);
    const { rerender } = render(
      <TypewriterProbe text="OK" speed={10} delay={20} />,
    );

    void act(() => vi.advanceTimersByTime(40));
    expect(screen.getByRole('status').textContent).toBe('OK');
    rerender(<TypewriterProbe text="" speed={10} delay={20} />);
    expect(screen.getByRole('status').textContent).toBe('');
    expect(screen.getByRole('status').getAttribute('data-done')).toBe('true');
    rerender(<TypewriterProbe text="OK" speed={10} delay={20} />);
    expect(screen.getByRole('status').textContent).toBe('');
    expect(screen.getByRole('status').getAttribute('data-done')).toBe('false');
    void act(() => vi.advanceTimersByTime(30));
    expect(screen.getByRole('status').textContent).toBe('O');
    void act(() => vi.advanceTimersByTime(10));
    expect(screen.getByRole('status').textContent).toBe('OK');
  });

  it('switches live reduced motion between complete and fresh delayed typing', () => {
    const media = installMediaQuery(false);
    render(<TypewriterProbe text="LIVE" speed={10} delay={20} />);

    act(() => media.setReducedMotion(true));
    expect(screen.getByRole('status').textContent).toBe('LIVE');
    expect(screen.getByRole('status').getAttribute('data-done')).toBe('true');
    act(() => media.setReducedMotion(false));
    expect(screen.getByRole('status').textContent).toBe('');
    expect(screen.getByRole('status').getAttribute('data-done')).toBe('false');
    void act(() => vi.advanceTimersByTime(29));
    expect(screen.getByRole('status').textContent).toBe('');
    void act(() => vi.advanceTimersByTime(1));
    expect(screen.getByRole('status').textContent).toBe('L');
  });

  it('cleans timers before delay and during active typing', () => {
    installMediaQuery(false);
    const beforeDelay = render(
      <TypewriterProbe text="LATE" speed={10} delay={40} />,
    );
    expect(vi.getTimerCount()).toBe(1);
    beforeDelay.unmount();
    expect(vi.getTimerCount()).toBe(0);

    const duringTyping = render(
      <TypewriterProbe text="ACTIVE" speed={10} delay={20} />,
    );
    void act(() => vi.advanceTimersByTime(30));
    expect(screen.getByRole('status').textContent).toBe('A');
    expect(vi.getTimerCount()).toBe(1);
    duringTyping.unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe('useBackgroundVideo', () => {
  let play: ReturnType<typeof vi.fn>;
  let pause: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    play = vi.fn(() => Promise.resolve());
    pause = vi.fn();
    Object.defineProperty(HTMLMediaElement.prototype, 'play', {
      configurable: true,
      value: play,
    });
    Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
      configurable: true,
      value: pause,
    });
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 1280,
    });
  });

  afterEach(() => cleanup());

  it('pauses and rewinds for reduced motion', () => {
    installMediaQuery(true);
    let video!: HTMLVideoElement;
    render(
      <VideoProbe
        onReady={(node) => {
          video = node;
        }}
      />,
    );
    video.currentTime = 3;
    void act(() => video.dispatchEvent(new Event('loadedmetadata')));

    expect(pause).toHaveBeenCalled();
    expect(video.currentTime).toBe(0);
  });

  it('attempts muted inline mobile playback and ignores a rejected promise', async () => {
    installMediaQuery(false, false);
    play.mockImplementation(() => Promise.reject(new Error('blocked')));
    let video!: HTMLVideoElement;
    render(
      <VideoProbe
        onReady={(node) => {
          video = node;
        }}
      />,
    );
    void act(() => video.dispatchEvent(new Event('loadedmetadata')));
    await act(async () => undefined);

    expect(play).toHaveBeenCalled();
    expect(video.muted).toBe(true);
    expect(video.playsInline).toBe(true);
  });

  it('scrubs finite desktop video within duration and removes its listener', () => {
    installMediaQuery(false);
    let video!: HTMLVideoElement;
    const { unmount } = render(
      <VideoProbe
        onReady={(node) => {
          video = node;
        }}
      />,
    );
    Object.defineProperty(video, 'duration', { configurable: true, value: 10 });
    video.currentTime = 5;
    void act(() =>
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 0 })),
    );
    void act(() =>
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 9999 })),
    );
    expect(video.currentTime).toBe(10);
    void act(() =>
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: -9999 })),
    );
    expect(video.currentTime).toBe(0);

    unmount();
    video.currentTime = 5;
    void act(() =>
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 900 })),
    );
    expect(video.currentTime).toBe(5);
  });

  it('reapplies scrub and playback exactly once across live desktop changes', () => {
    const media = installMediaQuery(false, true);
    let video!: HTMLVideoElement;
    render(
      <VideoProbe
        onReady={(node) => {
          video = node;
        }}
      />,
    );
    Object.defineProperty(video, 'duration', { configurable: true, value: 10 });
    video.currentTime = 0;
    void act(() =>
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 0 })),
    );
    void act(() =>
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 640 })),
    );
    expect(video.currentTime).toBe(4);

    act(() => media.setDesktop(false));
    expect(play).toHaveBeenCalledTimes(1);
    video.currentTime = 0;
    void act(() =>
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 640 })),
    );
    expect(video.currentTime).toBe(0);

    act(() => media.setDesktop(true));
    void act(() =>
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 0 })),
    );
    void act(() =>
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 640 })),
    );
    expect(video.currentTime).toBe(4);
  });

  it('pauses, resets, and restores desktop scrubbing across live reduced motion', () => {
    const media = installMediaQuery(false, true);
    let video!: HTMLVideoElement;
    render(
      <VideoProbe
        onReady={(node) => {
          video = node;
        }}
      />,
    );
    Object.defineProperty(video, 'duration', { configurable: true, value: 10 });
    video.currentTime = 3;
    act(() => media.setReducedMotion(true));
    expect(pause).toHaveBeenCalled();
    expect(video.currentTime).toBe(0);
    video.currentTime = 2;
    void act(() => video.dispatchEvent(new Event('loadedmetadata')));
    expect(video.currentTime).toBe(0);

    act(() => media.setReducedMotion(false));
    video.currentTime = 0;
    void act(() =>
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 0 })),
    );
    void act(() =>
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 640 })),
    );
    expect(video.currentTime).toBe(4);
  });
});

describe('InteractiveHero', () => {
  beforeEach(() => installMediaQuery(false));
  afterEach(() => cleanup());

  it('renders the approved label, headline region, remote video, and fallback poster', () => {
    render(<InteractiveHero />);

    expect(
      screen.getByText('AI PRODUCT MANAGER · EMBODIED INTELLIGENCE'),
    ).toBeTruthy();
    expect(
      screen.getByRole('heading', { name: '让 AI 从能力走向真实交互' }),
    ).toBeTruthy();
    const video = document.querySelector('video')!;
    expect(video.getAttribute('poster')).toContain('media/hero-fallback.svg');
    expect(video.querySelector('source')?.src).toContain('hf_20260601_110537');
  });

  it('marks the hero fallback state when the video errors', () => {
    const { container } = render(<InteractiveHero />);
    const video = container.querySelector('video')!;
    void act(() => video.dispatchEvent(new Event('error')));

    expect(
      container
        .querySelector('.resume-hero')
        ?.classList.contains('has-video-fallback'),
    ).toBe(true);
  });
});
