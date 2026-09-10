import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { StrictMode, useEffect } from 'react';

import { InteractiveHero } from '@/components/site/interactive-hero';
import { useBackgroundVideo } from '@/hooks/use-background-video';
import { useHeroPointerFollow } from '@/hooks/use-hero-pointer-follow';
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
    if (query === '(hover: hover) and (pointer: fine)') return desktop;
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
      notify('(hover: hover) and (pointer: fine)');
    },
  };
}

function installAnimationFrameHarness() {
  let nextId = 1;
  const frames = new Map<number, FrameRequestCallback>();
  const request = vi.fn((callback: FrameRequestCallback) => {
    const id = nextId++;
    frames.set(id, callback);
    return id;
  });
  const cancel = vi.fn((id: number) => frames.delete(id));
  vi.stubGlobal('requestAnimationFrame', request);
  vi.stubGlobal('cancelAnimationFrame', cancel);

  return {
    request,
    cancel,
    flush(timestamp = 16) {
      const pending = [...frames.values()];
      frames.clear();
      pending.forEach((callback) => callback(timestamp));
    },
    pending: () => frames.size,
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
  const { videoRef, failed } = useBackgroundVideo();

  useEffect(() => {
    if (videoRef.current) onReady(videoRef.current);
  }, [onReady, videoRef]);

  return (
    <output data-video-failed={failed}>
      <video ref={videoRef} muted playsInline />
    </output>
  );
}

function PointerFollowProbe() {
  const { motionRef, surfaceRef } = useHeroPointerFollow<HTMLDivElement>();

  return (
    <div ref={surfaceRef} data-testid="pointer-surface">
      <div ref={motionRef} data-testid="pointer-overlay" />
    </div>
  );
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

describe('useHeroPointerFollow', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('coalesces pointer input and writes only a compositor transform', () => {
    installMediaQuery(false, true);
    const raf = installAnimationFrameHarness();
    const { getByTestId } = render(<PointerFollowProbe />);
    const surface = getByTestId('pointer-surface');
    const overlay = getByTestId('pointer-overlay');
    const getRect = vi
      .spyOn(surface, 'getBoundingClientRect')
      .mockReturnValue({
        left: 0,
        top: 0,
        width: 1000,
        height: 500,
        right: 1000,
        bottom: 500,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      } as DOMRect);

    surface.dispatchEvent(
      new PointerEvent('pointerenter', { clientX: 500, clientY: 250 }),
    );
    surface.dispatchEvent(
      new PointerEvent('pointermove', { clientX: 800, clientY: 100 }),
    );
    surface.dispatchEvent(
      new PointerEvent('pointermove', { clientX: 900, clientY: 50 }),
    );

    expect(raf.request).toHaveBeenCalledTimes(1);
    expect(getRect).toHaveBeenCalledTimes(1);
    expect(surface.style.getPropertyValue('transform')).toBe('');

    raf.flush();

    expect(surface.style.transform).toBe('');
    expect(overlay.style.transform).toMatch(/^translate3d\(/);
    expect(surface.style.getPropertyValue('--hero-shift-x')).toBe('');
    expect(surface.style.getPropertyValue('--hero-shift-y')).toBe('');
  });

  it('does not schedule pointer motion for reduced-motion users', () => {
    installMediaQuery(true, true);
    const raf = installAnimationFrameHarness();
    const { getByTestId } = render(<PointerFollowProbe />);
    const surface = getByTestId('pointer-surface');

    surface.dispatchEvent(
      new PointerEvent('pointerenter', { clientX: 500, clientY: 250 }),
    );
    surface.dispatchEvent(
      new PointerEvent('pointermove', { clientX: 800, clientY: 100 }),
    );

    expect(raf.request).not.toHaveBeenCalled();
    expect(surface.style.transform).toBe('');
  });

  it('does not schedule pointer motion while the document is hidden', () => {
    installMediaQuery(false, true);
    const raf = installAnimationFrameHarness();
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      value: 'hidden',
    });
    const { getByTestId } = render(<PointerFollowProbe />);
    const surface = getByTestId('pointer-surface');

    surface.dispatchEvent(
      new PointerEvent('pointerenter', { clientX: 500, clientY: 250 }),
    );
    surface.dispatchEvent(
      new PointerEvent('pointermove', { clientX: 800, clientY: 100 }),
    );

    expect(raf.request).not.toHaveBeenCalled();
    expect(surface.style.transform).toBe('');

    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      value: 'visible',
    });
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

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('autoplays the desktop background without pointer-driven RAF work', async () => {
    installMediaQuery(false, true);
    const raf = installAnimationFrameHarness();
    render(<VideoProbe onReady={() => undefined} />);

    await act(async () => undefined);

    expect(play).toHaveBeenCalledTimes(1);
    expect(raf.request).not.toHaveBeenCalled();
    void act(() =>
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 900 })),
    );
    expect(raf.request).not.toHaveBeenCalled();
  });

  it('does not schedule video frames while the document is hidden', () => {
    installMediaQuery(false);
    const raf = installAnimationFrameHarness();
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      value: 'hidden',
    });
    render(<VideoProbe onReady={() => undefined} />);

    expect(raf.request).not.toHaveBeenCalled();
    expect(raf.pending()).toBe(0);
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      value: 'visible',
    });
  });

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

  it('uses the fallback when muted inline playback is blocked', async () => {
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
    expect(screen.getByRole('status').getAttribute('data-video-failed')).toBe(
      'true',
    );
  });

  it('resumes autoplay after reduced motion is disabled', () => {
    const media = installMediaQuery(true, true);
    render(<VideoProbe onReady={() => undefined} />);

    expect(pause).toHaveBeenCalledTimes(1);
    act(() => media.setReducedMotion(false));

    expect(play).toHaveBeenCalledTimes(1);
  });

  it('ignores a stale play rejection after motion is disabled and re-enabled', async () => {
    const media = installMediaQuery(false, true);
    let rejectInitialPlay!: (reason: Error) => void;
    play.mockImplementationOnce(
      () =>
        new Promise<void>((_resolve, reject) => {
          rejectInitialPlay = reject;
        }),
    );
    render(<VideoProbe onReady={() => undefined} />);

    act(() => media.setReducedMotion(true));
    act(() => media.setReducedMotion(false));
    await act(async () => undefined);
    await act(async () => {
      rejectInitialPlay(new DOMException('Playback interrupted', 'AbortError'));
    });

    expect(play).toHaveBeenCalledTimes(2);
    expect(screen.getByRole('status').getAttribute('data-video-failed')).toBe(
      'false',
    );
  });

  it('leaves the fallback when a later playback attempt succeeds', async () => {
    const media = installMediaQuery(false, true);
    play.mockRejectedValueOnce(new DOMException('Blocked', 'NotAllowedError'));
    render(<VideoProbe onReady={() => undefined} />);
    await act(async () => undefined);
    expect(screen.getByRole('status').getAttribute('data-video-failed')).toBe(
      'true',
    );

    act(() => media.setReducedMotion(true));
    act(() => media.setReducedMotion(false));
    await act(async () => undefined);

    expect(play).toHaveBeenCalledTimes(2);
    expect(screen.getByRole('status').getAttribute('data-video-failed')).toBe(
      'false',
    );
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
    expect(video.loop).toBe(true);
    expect(video.getAttribute('poster')).toContain('media/hero-fallback.svg');
    expect(video.querySelector('source')?.src).toContain('hf_20260601_110537');
    expect(screen.queryByText(/左右移动/)).toBeNull();
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
