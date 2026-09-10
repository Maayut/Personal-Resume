import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { StrictMode, useEffect, useRef } from 'react';

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
  const surfaceRef = useRef<HTMLOutputElement>(null);
  const { videoRef, failed } = useBackgroundVideo(surfaceRef);

  useEffect(() => {
    if (videoRef.current) onReady(videoRef.current);
  }, [onReady, videoRef]);

  return (
    <output
      ref={surfaceRef}
      data-testid="video-surface"
      data-video-failed={failed}
    >
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
    const getRect = vi.spyOn(surface, 'getBoundingClientRect').mockReturnValue({
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
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      value: 'visible',
    });
  });

  function prepareVideo(initialDuration = 10) {
    let video!: HTMLVideoElement;
    const view = render(
      <VideoProbe
        onReady={(node) => {
          video = node;
        }}
      />,
    );
    const surface = view.getByTestId('video-surface');
    vi.spyOn(surface, 'getBoundingClientRect').mockReturnValue({
      left: 100,
      top: 0,
      width: 1000,
      height: 500,
      right: 1100,
      bottom: 500,
      x: 100,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);
    let currentTime = 0;
    let seeking = false;
    let duration = initialDuration;
    let readyState = Number.isFinite(duration) ? 1 : 0;
    const seek = vi.fn((value: number) => {
      currentTime = value;
      seeking = true;
    });
    Object.defineProperties(video, {
      currentTime: { configurable: true, get: () => currentTime, set: seek },
      seeking: { configurable: true, get: () => seeking },
      duration: { configurable: true, get: () => duration },
      readyState: { configurable: true, get: () => readyState },
    });
    const pointer = (clientX: number) => {
      void act(() =>
        surface.dispatchEvent(new PointerEvent('pointermove', { clientX })),
      );
    };
    const metadata = (value = initialDuration) => {
      duration = value;
      readyState = 1;
      void act(() => video.dispatchEvent(new Event('loadedmetadata')));
    };
    const finishSeek = () => {
      seeking = false;
      void act(() => video.dispatchEvent(new Event('seeked')));
    };
    return { ...view, video, surface, seek, pointer, metadata, finishSeek };
  }

  it('keeps desktop video paused and maps the latest cursor position to its timeline', () => {
    installMediaQuery(false, true);
    const raf = installAnimationFrameHarness();
    const { video, seek, pointer, metadata } = prepareVideo();
    metadata();

    expect(play).not.toHaveBeenCalled();
    expect(pause).toHaveBeenCalled();
    expect(raf.pending()).toBe(0);

    pointer(300);
    pointer(600);
    pointer(900);
    expect(raf.pending()).toBe(1);
    expect(seek).not.toHaveBeenCalled();
     act(() => raf.flush(100));

    expect(seek).toHaveBeenCalledTimes(1);
    expect(video.currentTime).toBeCloseTo((10 - 1 / 24) * 0.8, 1);
    expect(play).not.toHaveBeenCalled();
  });

  it('waits for metadata without spinning frames and then applies the last cursor position', () => {
    installMediaQuery(false, true);
    const raf = installAnimationFrameHarness();
    const { video, seek, pointer, metadata } = prepareVideo(Number.NaN);

    pointer(400);
    pointer(600);
    expect(raf.pending()).toBe(0);
    expect(seek).not.toHaveBeenCalled();

    metadata(10);
     act(() => raf.flush(100));
    expect(seek).toHaveBeenCalledTimes(1);
    expect(video.currentTime).toBeCloseTo((10 - 1 / 24) * 0.5, 1);
  });

  it('allows one in-flight seek and uses the latest target when decoding finishes', () => {
    installMediaQuery(false, true);
    const raf = installAnimationFrameHarness();
    const { video, seek, pointer, metadata, finishSeek } = prepareVideo();
    metadata();
    pointer(300);
     act(() => raf.flush(100));
    expect(seek).toHaveBeenCalledTimes(1);

    pointer(600);
    pointer(1000);
     act(() => raf.flush(200));
    expect(seek).toHaveBeenCalledTimes(1);
    finishSeek();
     act(() => raf.flush(250));

    expect(seek).toHaveBeenCalledTimes(2);
    expect(video.currentTime).toBeCloseTo((10 - 1 / 24) * 0.9, 1);
  });

  it('limits seeking to 30 updates per second even when decoding is immediate', () => {
    installMediaQuery(false, true);
    const raf = installAnimationFrameHarness();
    const { seek, pointer, metadata, finishSeek } = prepareVideo();
    metadata();
    pointer(300);
     act(() => raf.flush(100));
    finishSeek();
    pointer(900);
     act(() => raf.flush(116));
    expect(seek).toHaveBeenCalledTimes(1);
     act(() => raf.flush(134));
    expect(seek).toHaveBeenCalledTimes(2);
  });

  it('clamps the cursor to valid video positions without seeking to the ended frame', () => {
    installMediaQuery(false, true);
    const raf = installAnimationFrameHarness();
    const { video, pointer, metadata, finishSeek } = prepareVideo();
    metadata();
    pointer(1200);
     act(() => raf.flush(100));
    expect(video.currentTime).toBeCloseTo(10 - 1 / 24, 3);
    finishSeek();
    pointer(0);
     act(() => raf.flush(200));
    expect(video.currentTime).toBe(0);
  });

  it('cancels pending cursor work on pointer leave and unmount', () => {
    installMediaQuery(false, true);
    const raf = installAnimationFrameHarness();
    const { surface, seek, pointer, metadata, unmount } = prepareVideo();
    metadata();
    pointer(600);
    void act(() => surface.dispatchEvent(new PointerEvent('pointerleave')));
     act(() => raf.flush(100));
    expect(seek).not.toHaveBeenCalled();
    expect(raf.pending()).toBe(0);

    pointer(900);
    unmount();
     act(() => raf.flush(200));
    expect(seek).not.toHaveBeenCalled();
    expect(raf.pending()).toBe(0);
  });

  it('suppresses queued targets while hidden, including a pending seek completion', () => {
    installMediaQuery(false, true);
    const raf = installAnimationFrameHarness();
    const { seek, pointer, metadata, finishSeek } = prepareVideo();
    metadata();
    pointer(300);
     act(() => raf.flush(100));
    pointer(900);
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      value: 'hidden',
    });
    void act(() => document.dispatchEvent(new Event('visibilitychange')));
    finishSeek();
    pointer(1000);
     act(() => raf.flush(200));
    expect(seek).toHaveBeenCalledTimes(1);
    expect(raf.pending()).toBe(0);
  });

  it('autoplays on coarse-pointer devices without cursor-driven work', async () => {
    installMediaQuery(false, false);
    const raf = installAnimationFrameHarness();
    const { pointer, metadata, seek } = prepareVideo();
    metadata();
    await act(async () => undefined);
    pointer(900);
    expect(play).toHaveBeenCalledTimes(1);
    expect(raf.pending()).toBe(0);
    expect(seek).not.toHaveBeenCalled();
  });

  it('cancels desktop seeks when the pointer mode switches to mobile autoplay', async () => {
    const media = installMediaQuery(false, true);
    const raf = installAnimationFrameHarness();
    const { pointer, metadata, seek } = prepareVideo();
    metadata();
    pointer(900);
     act(() => media.setDesktop(false));
     act(() => raf.flush(100));
    await act(async () => undefined);
    expect(play).toHaveBeenCalledTimes(1);
    expect(seek).not.toHaveBeenCalled();
    pointer(600);
    expect(raf.pending()).toBe(0);
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

  it('resumes mobile autoplay after reduced motion is disabled', () => {
    const media = installMediaQuery(true, false);
    render(<VideoProbe onReady={() => undefined} />);

    expect(pause).toHaveBeenCalledTimes(1);
     act(() => media.setReducedMotion(false));

    expect(play).toHaveBeenCalledTimes(1);
  });

  it('ignores a stale play rejection after motion is disabled and re-enabled', async () => {
    const media = installMediaQuery(false, false);
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

  it('ignores a stale mobile playback rejection after switching to cursor control', async () => {
    const media = installMediaQuery(false, false);
    let rejectPlay!: (reason: Error) => void;
    play.mockImplementationOnce(
      () =>
        new Promise<void>((_resolve, reject) => {
          rejectPlay = reject;
        }),
    );
    render(<VideoProbe onReady={() => undefined} />);
     act(() => media.setDesktop(true));
    await act(async () => rejectPlay(new Error('interrupted')));

    expect(pause).toHaveBeenCalled();
    expect(screen.getByRole('status').getAttribute('data-video-failed')).toBe(
      'false',
    );
  });

  it('leaves the fallback when a later playback attempt succeeds', async () => {
    const media = installMediaQuery(false, false);
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
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('renders the approved label, headline region, local scrub video, and fallback poster', () => {
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
    expect(video.querySelector('source')?.src).toContain('/media/hero-scrub.mp4');
    expect(screen.queryByText(/左右移动/)).toBeNull();
  });

  it('scrubs the visible video when the cursor moves over foreground hero text', () => {
    const raf = installAnimationFrameHarness();
    const { container } = render(<InteractiveHero />);
    const surface = container.querySelector('.resume-hero')!;
    const video = container.querySelector('video')!;
    vi.spyOn(surface, 'getBoundingClientRect').mockReturnValue({
      left: 100,
      top: 0,
      width: 1000,
      height: 500,
      right: 1100,
      bottom: 500,
      x: 100,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);
    Object.defineProperty(video, 'duration', { configurable: true, value: 10 });
    void act(() => video.dispatchEvent(new Event('loadedmetadata')));
    void act(() =>
      screen
        .getByRole('heading', { name: '让 AI 从能力走向真实交互' })
        .dispatchEvent(
          new PointerEvent('pointermove', { clientX: 700, bubbles: true }),
        ),
    );
     act(() => raf.flush(100));

    expect(video.currentTime).toBeCloseTo((10 - 1 / 24) * 0.6, 1);
    expect(video.autoplay).toBe(false);
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
