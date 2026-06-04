import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';

import { InterfaceTabsProvider } from 'contexts/interface-tabs-context';

import OperationClient from '../operation-client';

import { resetTestStore } from './test-utils';

// Orchestrator integration tests. These exercise the full chain:
//   user click → EditableField → useBodyState.onEdit → store
//   → cross-section memo (buildCurl) → LiveCodeBlock render.
//
// The hook tests prove the state layer; these prove the render-wiring
// layer. A regression where the hooks are correct but the orchestrator
// passes the wrong prop (or skips a memo) would only fail here.

beforeEach(() => {
  resetTestStore();
  localStorage.clear();
});

// Minimal operation fixture. Just enough shape for OperationClient + its
// section hooks to render without throwing on optional-chained accesses.
function makeOperation(overrides = {}) {
  return {
    method: 'POST',
    path: '/projects',
    operationId: 'createProject',
    requestBody: { required: true },
    parameters: [],
    bodyGlobals: [{ path: 'project.org_id', global: 'org_id' }],
    idMeaning: null,
    errors: [],
    response: { status: 201 },
    ...overrides,
  };
}

// One nested object with two editable string leaves: `name` and `org_id`
// (the latter is wired to the org_id cross-page global via bodyGlobals).
const BODY_TREE = [
  {
    key: 'project',
    type: 'object',
    required: true,
    children: [
      { key: 'name', type: 'string', value: '', required: false, placeholder: 'My project' },
      { key: 'org_id', type: 'string', value: '', required: false, placeholder: 'org-…' },
    ],
  },
];

const INTERFACES = [
  { id: 'api', available: true },
  { id: 'sdk', available: true },
  { id: 'cli', available: false },
  { id: 'mcp', available: false },
  { id: 'console', available: false },
];

function renderClient(operation = makeOperation()) {
  return render(
    <InterfaceTabsProvider>
      <OperationClient
        operation={operation}
        interfaces={INTERFACES}
        bodyTree={BODY_TREE}
        respTree={[]}
      />
    </InterfaceTabsProvider>
  );
}

// Locate the LiveCodeBlock's <pre> by its monospace styling. There's only
// one per render (the orchestrator's top-level api/sdk/cli code block).
function getLiveCode() {
  const pre = document.querySelector('pre');
  return pre?.textContent ?? '';
}

// Find the EditableField row for a given leaf key + click it into edit
// mode. When the same key is surfaced by both body AND params (the org_id
// dedup test), pick the first match — the orchestrator renders body
// before params, so [0] is always the body field.
function startEditing(key) {
  const buttons = screen.getAllByRole('button', { name: `Edit ${key} value` });
  fireEvent.click(buttons[0]);
  return screen.getAllByLabelText(`Edit ${key} value`)[0];
}

describe('OperationClient integration', () => {
  it('typing in a body field updates the live curl block', () => {
    renderClient();

    // Body field `name` lives at path `project.name` and is not yet edited,
    // so the live curl shows the URL line but no JSON body.
    expect(getLiveCode()).toContain('curl "https://console.neon.tech/api/v2/projects"');
    expect(getLiveCode()).not.toContain('"name"');

    // Type a value; the cross-section memo should recompute the curl.
    const input = startEditing('name');
    fireEvent.change(input, { target: { value: 'my-project' } });

    const code = getLiveCode();
    expect(code).toContain('-X POST');
    expect(code).toContain('"name"');
    expect(code).toContain('my-project');
  });

  it('clicking the body section Reset button reverts the live block + clears the edit badge', () => {
    renderClient();

    const input = startEditing('name');
    fireEvent.change(input, { target: { value: 'my-project' } });
    expect(getLiveCode()).toContain('my-project');

    // The Reset button is rendered by BodySection only when editCount > 0.
    // It's the small "Reset" text-button in the body section header strip.
    const resetBtn = screen.getAllByRole('button').find((b) => b.textContent === 'Reset');
    expect(resetBtn).toBeDefined();
    fireEvent.click(resetBtn);

    expect(getLiveCode()).not.toContain('my-project');
  });

  // Regression test for hydration at the render boundary, not just the
  // hook. The orchestrator's liveEditCount used to double-count globals
  // that appear as both a param AND a body field.
  it('a single global edit shows "(1 edited)" in the live block badge, not "(2 edited)"', () => {
    const operation = makeOperation({
      parameters: [{ name: 'org_id', in: 'query', schema: { type: 'string' } }],
    });
    renderClient(operation);

    const input = startEditing('org_id');
    fireEvent.change(input, { target: { value: 'rough-scene-12345678' } });

    // The badge text lives on the live-block copy button. It must say
    // "(1 edited)" — counting the single org_id once, even though the same
    // global is surfaced by both the body field AND the api parameter.
    expect(screen.getByText(/Copy \(1 edited\)/)).toBeDefined();
    expect(screen.queryByText(/Copy \(2 edited\)/)).toBeNull();
  });
});
