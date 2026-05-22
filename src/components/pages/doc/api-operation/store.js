import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';

import crossPageParamList from '../../../../data/api-ref/cross-page-params.json';

// Centralised shared state for the api-operation interactive editor.
// Replaces the hand-rolled session-storage helpers + cross-section
// callback threading that lived in operation-storage.js and the three
// section hooks before this migration.
//
// Three flat namespaces in the persisted state:
//   globals — the 14 cross-page session-identity IDs (org_id, project_id,
//             branch_id, etc.). One value per id, shared across every op.
//   perOp   — non-global CLI flags + non-global params (e.g. cursor,
//             limit). Keyed by `${operationId}:${name}` so list-projects'
//             cursor doesn't leak into list-shared-projects' cursor.
//   body    — per-path body field edits, keyed by dot-path (e.g.
//             `project.name`). Shared across ops by intent — the value
//             for `project.name` on createProject is the same value on
//             updateProject.

export const CROSS_PAGE_PARAMS = new Set(crossPageParamList);

// Convenience predicate so callers don't all import CROSS_PAGE_PARAMS
// just to call .has().
export function isCrossPageGlobal(name) {
  return CROSS_PAGE_PARAMS.has(name);
}

const INITIAL = { globals: {}, perOp: {}, body: {} };

const sessionJSON = createJSONStorage(() => sessionStorage);

export const useStore = create(
  devtools(
    persist(
      (set) => ({
        ...INITIAL,

        setGlobal: (name, value) =>
          set((s) => ({ globals: setOrDelete(s.globals, name, value) }), false, {
            type: 'setGlobal',
            name,
            value,
          }),
        setPerOp: (opId, name, value) =>
          set((s) => ({ perOp: setOrDelete(s.perOp, `${opId}:${name}`, value) }), false, {
            type: 'setPerOp',
            opId,
            name,
            value,
          }),
        setBody: (path, value) =>
          set((s) => ({ body: setOrDelete(s.body, path, value) }), false, {
            type: 'setBody',
            path,
            value,
          }),

        // Section-level resets: clear everything reachable from a specific
        // section. The section hooks call the appropriate combination
        // (params clears all CROSS_PAGE_PARAMS + its perOp; body clears
        // its body paths + the globals it surfaces; cli clears its perOp +
        // the globals it surfaces).
        resetGlobals: (names) =>
          set((s) => ({ globals: omit(s.globals, names) }), false, {
            type: 'resetGlobals',
            names,
          }),
        resetPerOp: (opId) =>
          set(
            (s) => ({
              perOp: Object.fromEntries(
                Object.entries(s.perOp).filter(([k]) => !k.startsWith(`${opId}:`))
              ),
            }),
            false,
            { type: 'resetPerOp', opId }
          ),
        resetBodyPaths: (paths) =>
          set((s) => ({ body: omit(s.body, paths) }), false, {
            type: 'resetBodyPaths',
            paths,
          }),
      }),
      {
        name: 'neon-api-ref-state',
        storage: sessionJSON,
        // CRITICAL for Next.js App Router: don't auto-rehydrate during the
        // first client render. The api operation pages are statically
        // generated; auto-rehydrate would make the first client render
        // differ from the SSR snapshot (which sees no sessionStorage),
        // producing a React hydration mismatch warning and a potential
        // subtree re-mount. <StoreHydrator/> calls rehydrate() in a
        // useEffect after mount; values appear on the second render.
        skipHydration: true,
      }
    ),
    { name: 'neon-api-ref' }
  )
);

// useShallow is the canonical way to subscribe to a selector that returns
// a fresh object literal each render. Re-exported here so callers don't
// have to know the import path.
export { useShallow };

function setOrDelete(obj, key, value) {
  if (value === undefined) {
    const { [key]: _gone, ...rest } = obj;
    return rest;
  }
  return { ...obj, [key]: value };
}

function omit(obj, keys) {
  const out = { ...obj };
  for (const k of keys) delete out[k];
  return out;
}
