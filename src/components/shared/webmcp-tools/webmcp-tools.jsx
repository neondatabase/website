'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Registers one tool, and unregisters it when `signal` aborts. Supports the
// current API (register options take a signal) and the earlier Chrome preview
// and polyfills (unregisterTool(name), or a returned { unregister }).
function registerTool(modelContext, tool, signal) {
  // Registration rejects with an AbortError when the signal aborts first (an
  // unmount, or React Strict Mode's mount-unmount-mount in development).
  const warn = (error) => {
    if (!signal.aborted) console.warn(`WebMCP: couldn't register ${tool.name}`, error);
  };
  try {
    Promise.resolve(modelContext.registerTool(tool, { signal })).then((registration) => {
      const unregister = () => {
        try {
          if (typeof registration?.unregister === 'function') registration.unregister();
          else modelContext.unregisterTool?.(tool.name);
        } catch {
          // Already unregistered through the signal.
        }
      };
      if (signal.aborted) unregister();
      else signal.addEventListener('abort', unregister, { once: true });
    }, warn);
  } catch (error) {
    warn(error);
  }
}

// Mounted in the root layout, so the tools stay registered across client-side
// navigation. Renders nothing, and in browsers without WebMCP does nothing: the
// tool definitions load in a separate chunk only when WebMCP is available, after
// the page has hydrated.
const WebMcpTools = () => {
  const router = useRouter();

  useEffect(() => {
    // document.modelContext is the current spec; navigator.modelContext is the earlier name.
    const modelContext = document.modelContext ?? navigator.modelContext;
    if (typeof modelContext?.registerTool !== 'function') return undefined;

    const controller = new AbortController();
    import('./tools')
      .then(({ default: createTools }) => {
        if (controller.signal.aborted) return;
        createTools(router).forEach((tool) => registerTool(modelContext, tool, controller.signal));
      })
      .catch((error) => console.warn("WebMCP: couldn't load tools", error));
    return () => controller.abort();
  }, [router]);

  return null;
};

export default WebMcpTools;
