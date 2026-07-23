import { describe, it, expect } from 'vitest';

import {
  NON_OPERATION_RAW_EXPORTS,
  computeCoverage,
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
  });
});
