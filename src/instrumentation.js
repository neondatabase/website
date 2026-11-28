// Next.js calls register() once when the server process starts. We use it to
// boot the content live-reload watcher in-process during development.
//
// Server-only, so no client-bundle impact. The import below is skipped unless
// NODE_ENV === 'development' and is marked webpack/turbopack-ignore, so the
// watcher and `ws` do not make it to the build.
export async function register() {
  if (process.env.NODE_ENV !== 'development') return;
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  const watcherUrl = new URL('../scripts/watch-content.mjs', import.meta.url).href;
  await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ watcherUrl);
}
