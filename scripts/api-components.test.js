import { describe, it, expect } from 'vitest';

import { METHOD_STYLES, TYPE_STYLES, getStatusStyle } from 'utils/api-style';

// These tests assert against the shared module that ApiMethodBadge, ApiResponse,
// and ApiParam all consume. Renaming a color here will fail both the tests and
// (visibly) the rendered components.

// --- METHOD_STYLES (consumed by ApiMethodBadge) ---

describe('METHOD_STYLES', () => {
  it('has a style for each HTTP method', () => {
    for (const method of ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']) {
      expect(METHOD_STYLES[method]).toBeTruthy();
    }
  });

  it('GET uses green (#00B87B)', () => {
    expect(METHOD_STYLES.GET).toContain('#00B87B');
  });

  it('POST uses blue (#426CE0)', () => {
    expect(METHOD_STYLES.POST).toContain('#426CE0');
  });

  it('PUT uses brown (#BE8A3C)', () => {
    expect(METHOD_STYLES.PUT).toContain('#BE8A3C');
  });

  it('PATCH uses orange (#E9943E)', () => {
    expect(METHOD_STYLES.PATCH).toContain('#E9943E');
  });

  it('DELETE uses red (#E2301D)', () => {
    expect(METHOD_STYLES.DELETE).toContain('#E2301D');
  });

  it('unknown method is undefined (caller falls back)', () => {
    expect(METHOD_STYLES.OPTIONS).toBeUndefined();
  });
});

// --- getStatusStyle (consumed by ApiResponse) ---

describe('getStatusStyle', () => {
  it('2xx uses success green', () => {
    expect(getStatusStyle(200)).toContain('#00B87B');
    expect(getStatusStyle(201)).toContain('#00B87B');
  });

  it('3xx uses redirect blue', () => {
    expect(getStatusStyle(301)).toContain('#426CE0');
  });

  it('4xx uses warning orange', () => {
    expect(getStatusStyle(400)).toContain('#E9943E');
    expect(getStatusStyle(404)).toContain('#E9943E');
    expect(getStatusStyle('422')).toContain('#E9943E');
  });

  it('5xx uses error red', () => {
    expect(getStatusStyle(500)).toContain('#E2301D');
  });
});

// --- TYPE_STYLES (consumed by ApiParam) ---

describe('TYPE_STYLES', () => {
  it('string uses blue (#426CE0)', () => {
    expect(TYPE_STYLES.string).toContain('#426CE0');
  });

  it('integer and number both use purple (#8458D0)', () => {
    expect(TYPE_STYLES.integer).toContain('#8458D0');
    expect(TYPE_STYLES.number).toContain('#8458D0');
  });

  it('boolean uses brown (#BE8A3C)', () => {
    expect(TYPE_STYLES.boolean).toContain('#BE8A3C');
  });

  it('object and array use gray', () => {
    expect(TYPE_STYLES.object).toContain('gray-new-40');
    expect(TYPE_STYLES.array).toContain('gray-new-40');
  });

  it('covers all expected types', () => {
    const expected = ['string', 'integer', 'number', 'boolean', 'object', 'array'];
    for (const t of expected) {
      expect(TYPE_STYLES[t]).toBeTruthy();
    }
  });
});
