import { useEffect, useState } from 'react';

type TypewriterState = {
  text: string;
  speed: number;
  delay: number;
  displayed: string;
  done: boolean;
};

function reducedMotionIsPreferred() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function useTypewriter(text: string, speed = 42, delay = 450) {
  const reducedMotion = reducedMotionIsPreferred();
  const [state, setState] = useState<TypewriterState>(() => ({
    text,
    speed,
    delay,
    displayed: reducedMotion ? text : '',
    done: reducedMotion || text.length === 0,
  }));
  const inputsChanged =
    state.text !== text || state.speed !== speed || state.delay !== delay;

  useEffect(() => {
    if (reducedMotion || text.length === 0) return;

    let position = 0;
    let intervalId: number | undefined;
    const delayId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        position += 1;
        const complete = position >= text.length;
        setState({
          text,
          speed,
          delay,
          displayed: text.slice(0, position),
          done: complete,
        });

        if (complete) window.clearInterval(intervalId);
      }, speed);
    }, delay);

    return () => {
      window.clearTimeout(delayId);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [delay, reducedMotion, speed, text]);

  if (reducedMotion || text.length === 0) {
    return { displayed: text, done: true };
  }

  if (inputsChanged) {
    return {
      displayed: '',
      done: false,
    };
  }

  return { displayed: state.displayed, done: state.done };
}
