import { useStore } from '../store';

// Reset both the in-memory store state and sessionStorage between tests.
// Called from beforeEach in every test file that exercises any code path
// touching the store (hooks, integration, components that render section
// components).
//
// IMPORTANT: don't pass `true` to setState (the replace flag) — that wipes
// the action methods (setGlobal/setPerOp/...) which live alongside the
// state namespaces in the initial state object. Default merge mode keeps
// the actions while resetting the three namespaces to empty.
export function resetTestStore() {
  useStore.setState({ globals: {}, perOp: {}, body: {} });
  sessionStorage.clear();
}
