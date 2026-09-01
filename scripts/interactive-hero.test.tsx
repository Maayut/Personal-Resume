import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { StrictMode, useEffect } from 'react';

import { InteractiveHero } from '@/components/site/interactive-hero';
import { useBackgroundVideo } from '@/hooks/use-background-video';
import { useTypewriter } from '@/hooks/use-typewriter';

function installMediaQuery(reducedMotion = false) {
  window.matchMedia = vi.fn((query: string) => ({
    matches: query === '(prefers-reduced-motion: reduce)' && reducedMotion,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia;
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
    installMediaQuery(false);
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 800,
    });
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
});

describe('InteractiveHero', () => {
  beforeEach(() => installMediaQuery(false));
  afterEach(() => cleanup());

  it('renders the approved label, headline region, remote video, and fallback poster', () => {
    render(<InteractiveHero />);

    expect(
      screen.getByText('AI PRODUCT MANAGER · EMBODIED INTELLIGENCE'),
    ).toBeTruthy();
    expect(screen.getByRole('heading')).toBeTruthy();
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
