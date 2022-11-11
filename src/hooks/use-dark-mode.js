import { createContext, useContext } from 'react';

import useIsomorphicLayoutEffect from './use-isomorphic-layout-effect';
import useLocalStorage from './use-local-storage';

const ThemeContext = createContext([]);
export { ThemeContext };

export function useDarkModeInit() {
  const [enabledState, setEnabledState] = useLocalStorage('dark-mode-enabled');
  const isSystemDarkMode =
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isSystemThemeEnabled =
    typeof localStorage !== 'undefined'
      ? (localStorage.theme && JSON.parse(localStorage.theme) === 'system') ||
        !('theme' in localStorage)
      : false;
  const enabled = enabledState || (isSystemThemeEnabled && isSystemDarkMode);

  useIsomorphicLayoutEffect(() => {
    const className = 'dark';
    const element = document.documentElement;
    if (enabled) {
      element.classList.add(className);
    } else {
      element.classList.remove(className);
    }
  }, [enabled]);

  return [enabled, setEnabledState];
}

function useDarkMode() {
  return useContext(ThemeContext);
}

export default useDarkMode;
