import { useCallback, useSyncExternalStore } from 'react';

const getServerSnapshot = () => false;

export function useMediaQuery(query: string) {
  const getSnapshot = useCallback(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
    [query],
  );
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (typeof window === 'undefined') return () => undefined;

      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener('change', onChange);
      return () => mediaQuery.removeEventListener('change', onChange);
    },
    [query],
  );

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
