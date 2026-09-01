import { useEffect, useState } from 'react';

import { useMediaQuery } from '@/hooks/use-media-query';

type TypewriterState = {
  runId: string;
  displayed: string;
  done: boolean;
};

function createRunId(
  text: string,
  speed: number,
  delay: number,
  reducedMotion: boolean,
) {
  return `${text}\u0000${speed}\u0000${delay}\u0000${reducedMotion}`;
}

function createState(
  runId: string,
  text: string,
  reducedMotion: boolean,
): TypewriterState {
  return {
    runId,
    displayed: reducedMotion ? text : '',
    done: reducedMotion || text.length === 0,
  };
}

export function useTypewriter(text: string, speed = 42, delay = 450) {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const runId = createRunId(text, speed, delay, reducedMotion);
  const [state, setState] = useState<TypewriterState>(() =>
    createState(runId, text, reducedMotion),
  );

  if (state.runId !== runId) {
    setState(createState(runId, text, reducedMotion));
  }

  useEffect(() => {
    if (reducedMotion || text.length === 0) return;

    let position = 0;
    let intervalId: number | undefined;
    const delayId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        position += 1;
        const complete = position >= text.length;
        setState((current) => {
          if (current.runId !== runId) return current;
          return {
            runId,
            displayed: text.slice(0, position),
            done: complete,
          };
        });

        if (complete) window.clearInterval(intervalId);
      }, speed);
    }, delay);

    return () => {
      window.clearTimeout(delayId);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [delay, reducedMotion, runId, speed, text]);

  return { displayed: state.displayed, done: state.done };
}
