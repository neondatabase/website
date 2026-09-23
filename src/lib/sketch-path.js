// Restrict dynamic imports to repository-owned sketch modules, including subdirectories.
export const isSketchPath = (src) =>
  typeof src === 'string' && /^\/sketches\/(?:[\w-]+\/)*[\w-]+\.(?:js|ts)$/.test(src);
