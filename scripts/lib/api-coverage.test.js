import { describe, it, expect } from 'vitest';

import {
  BUMP_ACTION,
  NON_OPERATION_RAW_EXPORTS,
  REGEN_ACTION,
  computeCoverage,
  groupCoverageActions,
  operationIdsFromSpec,
  sdkRawOperationNames,
} from './api-coverage.mjs';

describe('operationIdsFromSpec', () => {
  it('collects operationIds across paths and HTTP methods', () => {
    const spec = {
      paths: {
        '/projects': {
          get: { operationId: 'listProjects' },
          post: { operationId: 'createProject' },
          parameters: [{ name: 'x' }], // non-method key ignored
        },
        '/projects/{id}': {
          get: { operationId: 'getProject' },
          delete: { operationId: 'deleteProject' },
        },
      },
    };
    expect([...operationIdsFromSpec(spec)].sort()).toEqual([
      'createProject',
      'deleteProject',
      'getProject',
      'listProjects',
    ]);
  });

  it('ignores operations without an operationId and tolerates empty specs', () => {
    expect([...operationIdsFromSpec({ paths: { '/a': { get: {} } } })]).toEqual([]);
    expect([...operationIdsFromSpec({})]).toEqual([]);
    expect([...operationIdsFromSpec(null)]).toEqual([]);
  });
});

describe('sdkRawOperationNames', () => {
  it('keeps function exports and drops infrastructure exports', () => {
    const rawModule = {
      listProjects: () => {},
      createProject: () => {},
      createClient: () => {},
      createConfig: () => {},
      wrapRaw: () => {},
      client: {},
      SomeType: undefined,
    };
    expect([...sdkRawOperationNames(rawModule)].sort()).toEqual(['createProject', 'listProjects']);
    for (const infra of NON_OPERATION_RAW_EXPORTS) {
      expect(sdkRawOperationNames(rawModule).has(infra)).toBe(false);
    }
  });
});

describe('computeCoverage', () => {
  it('reports nothing when docs and SDK are perfectly aligned', () => {
    const documentedOps = ['listProjects', 'getProjectJWKS'];
    // toSdkMethodName lowercases acronyms: getProjectJWKS -> getProjectJwks
    const rawOps = ['listProjects', 'getProjectJwks'];
    const result = computeCoverage({ documentedOps, rawOps });
    expect(result.sdkNotDocumented).toEqual([]);
    expect(result.documentedNotInSdk).toEqual([]);
    expect(result.specNotDocumented).toBeNull();
    expect(result.documentedNotInSpec).toBeNull();
    expect(result.specNotInSdk).toBeNull();
  });

  it('flags SDK raw methods missing from the docs', () => {
    const result = computeCoverage({
      documentedOps: ['listProjects'],
      rawOps: ['listProjects', 'createBranch'],
    });
    expect(result.sdkNotDocumented).toEqual(['createBranch']);
    expect(result.documentedNotInSdk).toEqual([]);
  });

  it('flags documented operations missing from the SDK raw layer', () => {
    const result = computeCoverage({
      documentedOps: ['listProjects', 'createProject'],
      rawOps: ['listProjects'],
    });
    expect(result.documentedNotInSdk).toEqual(['createProject']);
    expect(result.sdkNotDocumented).toEqual([]);
  });

  it('diffs the live spec against docs and SDK when specOps is provided', () => {
    const result = computeCoverage({
      documentedOps: ['listProjects'],
      rawOps: ['listProjects'],
      specOps: ['listProjects', 'newEndpoint'],
    });
    expect(result.specNotDocumented).toEqual(['newEndpoint']);
    expect(result.specNotInSdk).toEqual(['newEndpoint']);
    expect(result.documentedNotInSpec).toEqual([]);
  });

  it('flags documented operations the spec no longer exposes (stale artifacts)', () => {
    // Synthetic op names — `removedOp` stands for the build-breaking class where
    // the committed manifest still lists an operation the live spec has dropped.
    const result = computeCoverage({
      documentedOps: ['presentOp', 'removedOp'],
      rawOps: ['presentOp'],
      specOps: ['presentOp'],
    });
    expect(result.documentedNotInSpec).toEqual(['removedOp']);
    expect(result.specNotDocumented).toEqual([]);
  });
});

describe('groupCoverageActions', () => {
  const group = (coverage, opts) =>
    groupCoverageActions(coverage, { sdkVersion: '1.0.0', ...opts });

  it('routes a stale documented op (missing from spec AND sdk) to regenerate, not bump', () => {
    // Regression for the routing bug: `removedOp` is gone from the spec and
    // absent from the SDK, so it lands in documentedNotInSdk too. Spec-first
    // classification must call this "regenerate", never "bump @neon/sdk".
    const coverage = computeCoverage({
      documentedOps: ['presentOp', 'removedOp'],
      rawOps: ['presentOp'],
      specOps: ['presentOp'],
    });
    const groups = group(coverage, { hasSpec: true });
    const forOp = groups.find((g) => g.ops.includes('removedOp'));
    expect(forOp.action).toBe(REGEN_ACTION);
    expect(groups.some((g) => g.action === BUMP_ACTION)).toBe(false);
  });

  it('routes a genuine SDK-behind op to bump', () => {
    const coverage = computeCoverage({
      documentedOps: ['presentOp', 'sdkMissingOp'],
      rawOps: ['presentOp'],
      specOps: ['presentOp', 'sdkMissingOp'],
    });
    const groups = group(coverage, { hasSpec: true });
    const forOp = groups.find((g) => g.ops.includes('sdkMissingOp'));
    expect(forOp.action).toBe(BUMP_ACTION);
  });

  it('emits no groups when everything is aligned', () => {
    const coverage = computeCoverage({
      documentedOps: ['presentOp'],
      rawOps: ['presentOp'],
      specOps: ['presentOp'],
    });
    expect(group(coverage, { hasSpec: true })).toEqual([]);
  });

  it('offline: reports documentedNotInSdk with an ambiguous action (no spec to classify)', () => {
    const coverage = computeCoverage({
      documentedOps: ['presentOp', 'removedOp'],
      rawOps: ['presentOp'],
    });
    const groups = group(coverage, { hasSpec: false });
    const forOp = groups.find((g) => g.ops.includes('removedOp'));
    expect(forOp).toBeDefined();
    expect(forOp.action).not.toBe(BUMP_ACTION);
    expect(forOp.action).not.toBe(REGEN_ACTION);
  });
});
